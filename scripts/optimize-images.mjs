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
}
await mkdir(dirname(MANIFEST), { recursive: true });
await writeFile(MANIFEST, JSON.stringify(manifest, null, 1));
console.log(`WebP generados: ${made}, ya al día: ${skipped}, imágenes: ${Object.keys(manifest).length}`);
