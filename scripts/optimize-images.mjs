// Genera WebP responsivos desde img/ (PNG originales) hacia public/img/
// y escribe src/data/image-manifest.json con anchos y dimensiones.
import sharp from 'sharp';
import { readdir, mkdir, stat, writeFile } from 'node:fs/promises';
import { join, relative, dirname, basename, extname } from 'node:path';

const SRC = 'img';
const OUT = 'public/img';
const MANIFEST = 'src/data/image-manifest.json';

// anchos por tipo de imagen
const widthsFor = (rel, w) => {
  if (rel.startsWith('hero') || rel.startsWith('editorial')) return [800, 1280, 1916];
  if (rel.startsWith('newsletter')) return [600, 900, 1536];
  if (rel.startsWith('instagram')) return [400, 640, 900, 1254];
  if (rel.includes('-04-macro')) return [640, 1024, 1448];
  return [400, 640, 900, 1122]; // 4:5 producto / destacado
};

// Fondo para la galería de la ficha: la foto se muestra completa (object-fit: contain) y los costados
// que quedan vacíos se pintan con el color de sus propios bordes, para que no se note dónde termina.
const BANDS = 11;
const median = (values) => values.sort((a, b) => a - b)[Math.floor(values.length / 2)];
const hex = (rgb) => '#' + rgb.map((v) => v.toString(16).padStart(2, '0')).join('');

// Fotos de estudio: dos degradados verticales (borde izquierdo y derecho), exactos para el fondo beige.
async function gradientBackdrop(file) {
  const W = 100, H = 125, STRIP = 1; // solo la columna del borde: es la que toca el fondo
  const { data } = await sharp(file).resize(W, H, { fit: 'fill' }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const color = (xs, y0, y1) => {
    const pixels = [];
    let total = 0;
    for (let y = y0; y < y1; y++) for (const x of xs) {
      const p = [...data.subarray((y * W + x) * 3, (y * W + x) * 3 + 3)];
      total++;
      if (Math.min(...p) <= 232) pixels.push(p); // el blanco casi puro es el nombre impreso, no el fondo
    }
    return pixels.length > total * 0.3 ? [0, 1, 2].map((c) => median(pixels.map((p) => p[c]))) : null;
  };
  const side = (xs) => {
    const bands = [...Array(BANDS).keys()].map((i) => color(xs, Math.floor((i * H) / BANDS), Math.floor(((i + 1) * H) / BANDS)));
    // una franja tapada por el texto toma el color de la franja válida más cercana
    const filled = bands.map((c, i) => {
      for (let d = 0; !c && d < BANDS; d++) c = bands[i - d] ?? bands[i + d];
      return c ?? [201, 190, 183];
    });
    // mediana con las franjas vecinas: un brillo aislado en el borde no se convierte en una raya
    return filled.map((c, i) => {
      const near = [filled[Math.max(0, i - 1)], c, filled[Math.min(BANDS - 1, i + 1)]];
      return hex([0, 1, 2].map((k) => median(near.map((n) => n[k]))));
    });
  };
  const all = [...Array(W).keys()];
  const left = side(all.slice(0, STRIP)), right = side(all.slice(-STRIP));
  const gradient = (colors) => `linear-gradient(to bottom, ${colors.map((c, i) => `${c} ${(((i + 0.5) / BANDS) * 100).toFixed(1)}%`).join(', ')})`;
  return `${gradient(left)} left / 50.5% 100% no-repeat, ${gradient(right)} right / 50.5% 100% no-repeat ${left[5]}`;
}

// Fotos de ambiente y detalle: un color no basta. Se prolongan sus bordes en espejo, cada vez más
// desenfocados; colocada detrás y alineada con la foto, la prolongación continúa la escena sin corte.
async function sceneBackdrop(file, base, meta, srcTime) {
  const landscape = meta.width > meta.height;
  const width = landscape ? 1000 : Math.round((900 * meta.width) / meta.height);
  const height = Math.round((width * meta.height) / meta.width);
  // vertical: lienzo 2:1 a la altura de la foto; horizontal: lienzo 1,45 veces el ancho y casi cuadrado
  const x = landscape ? Math.round(width * 0.225) : Math.round((height * 2 - width) / 2);
  const y = landscape ? Math.round(((width + 2 * x) / 0.9 - height) / 2) : 0;
  const out = join(OUT, `${base}-fondo.webp`);
  let fresh = false;
  try { fresh = (await stat(out)).mtimeMs > srcTime; } catch {}
  const wide = await sharp(file).resize({ width, height, fit: 'fill' })
    .extend({ left: x, right: x, top: y, bottom: y, extendWith: 'mirror' }).png().toBuffer();
  if (!fresh) {
    // el desenfoque entra poco a poco desde el borde de la foto (transparencia según la distancia)
    const W = width + 2 * x, H = height + 2 * y, RAMP = 70;
    const mask = Buffer.alloc(W * H);
    for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) {
      const d = Math.max(x - i, i - (x + width - 1), y - j, j - (y + height - 1), 0);
      mask[j * W + i] = Math.round(Math.min(1, d / RAMP) * 255);
    }
    const blurred = await sharp(wide).blur(12).removeAlpha().joinChannel(mask, { raw: { width: W, height: H, channels: 1 } }).png().toBuffer();
    await sharp(wide).composite([{ input: blurred }]).webp({ quality: 62 }).toFile(out);
  }
  const [r, g, b] = (await sharp(wide).stats()).channels.map((c) => Math.round(c.mean));
  // el ancho de la foto en pantalla es el del hueco menos el margen lateral (--gal-pad)
  const size = landscape ? 'calc((100% - 2 * var(--gal-pad)) * 1.45) auto' : 'auto 100%';
  return `url("/img/${base}-fondo.webp") center / ${size} no-repeat ${hex([r, g, b])}`;
}

async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (extname(e.name).toLowerCase() === '.png') yield p;
  }
}

const manifest = {};
let made = 0, skipped = 0;
for await (const file of walk(SRC)) {
  const rel = relative(SRC, file).replaceAll(String.fromCharCode(92), '/');
  const base = rel.replace(/\.png$/i, '');
  const meta = await sharp(file).metadata();
  const widths = widthsFor(rel, meta.width).filter((w) => w <= meta.width);
  if (!widths.includes(meta.width) && meta.width <= Math.max(...widths) + 40) widths.push(meta.width);
  const ws = [...new Set(widths)].sort((a, b) => a - b);
  manifest[base] = { widths: ws, width: meta.width, height: meta.height };
  const srcTime = (await stat(file)).mtimeMs;
  for (const w of ws) {
    const out = join(OUT, `${base}-${w}.webp`);
    try { if ((await stat(out)).mtimeMs > srcTime) { skipped++; continue; } } catch {}
    await mkdir(dirname(out), { recursive: true });
    await sharp(file).resize({ width: w, withoutEnlargement: true }).webp({ quality: 80, effort: 5 }).toFile(out);
    made++;
  }
  if (rel.startsWith('productos/')) {
    await mkdir(dirname(join(OUT, base)), { recursive: true });
    manifest[base].backdrop = /ambiente|macro/.test(base)
      ? await sceneBackdrop(file, base, meta, srcTime)
      : await gradientBackdrop(file);
  }
}
await mkdir(dirname(MANIFEST), { recursive: true });
await writeFile(MANIFEST, JSON.stringify(manifest, null, 1));
console.log(`WebP generados: ${made}, ya al día: ${skipped}, imágenes: ${Object.keys(manifest).length}`);
