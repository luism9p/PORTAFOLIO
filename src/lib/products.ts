import { existsSync } from 'node:fs';
import { join } from 'node:path';
import data from '../data/products.json';

export type Variante = { id: string; nombre: string; detalle: string; color: string };
/** Campos opcionales que un producto puede traer para sobrescribir el bloque "marca". */
type Overrides = { videoHero?: any; videoSplit?: any; faq?: any[]; ficha?: Record<string, any> };
export type Product = (typeof data.productos)[number] & Overrides;

export const marca = data.marca;
export const products = data.productos as Product[];

/** Hasta que haya un precio real, el dato queda como "PRECIO_PENDIENTE" (o vacío) y no se muestra como cifra. */
const num = (v: unknown): number | null => {
  const n = typeof v === 'number' ? v : Number(String(v ?? '').replace(',', '.'));
  return Number.isFinite(n) && n > 0 ? n : null;
};
export const hasPrice = (p: { precio?: unknown }) => num(p.precio) !== null;
export const formatPrice = (v: unknown): string => {
  const n = num(v);
  return n === null ? '' : `S/ ${n.toLocaleString('es-PE', { minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 })}`;
};

/** Solo los productos con fotos aparecen en listados; los demás tienen página pero no se listan todavía. */
export const listed = products.filter((p) => p.imagenes);

export const productUrl = (slug: string) => `/producto/${slug}/`;

/** 4 productos relacionados: primero los de la misma colección y, si faltan, se completa con otros. */
export function related(current: Product, n = 4) {
  const others = listed.filter((p) => p.slug !== current.slug);
  const same = others.filter((p) => p.coleccion === current.coleccion);
  const rest = others.filter((p) => p.coleccion !== current.coleccion);
  return [...same, ...rest].slice(0, n);
}

/** Orden de la galería: principal, ambiente, detalle y medidas. */
export const galleryViews = [
  { key: 'tarjeta', label: 'vista principal' },
  { key: 'ambiente', label: 'en ambiente' },
  { key: 'macro', label: 'detalle' },
  { key: 'medidas', label: 'medidas' },
] as const;

export const isLamp = (p: Product) => p.tipoDetalle !== 'florero';

/** ¿Existe el archivo en public/? (para imágenes que todavía no se han subido). */
export const publicExists = (path: string) => existsSync(join(process.cwd(), 'public', path));

/** Mensajes de WhatsApp desde un producto: siempre incluyen su nombre. */
export const interestMessage = (p: Product) =>
  `Hola FlowHive, me interesa ${isLamp(p) ? 'la lámpara' : 'el florero'} ${p.nombre.toUpperCase()}`;
/** Pedido: el nombre del producto y, si tiene variantes, la elegida (al cargar, la primera). */
export const orderMessage = (p: Product, variant = p.variantes?.opciones?.[0]?.nombre) =>
  `${interestMessage(p)}${variant && p.variantes ? ` (${p.variantes.etiqueta}: ${variant})` : ''}`;
/** Para consultar el precio mientras no haya uno publicado. */
export const priceMessage = (p: Product) => `${interestMessage(p)}. ¿Me pasas el precio?`;

/**
 * Secciones de la ficha: usa el bloque "marca" de src/data/products.json y deja que cada producto
 * sobrescriba videoHero, videoSplit, faq y ficha con sus propios datos.
 */
export function sections(p: Product) {
  const lamp = isLamp(p);
  const hero = { ...marca.videoHero, ...(p.videoHero ?? {}) };
  const split = {
    izquierda: { ...marca.videoSplit.izquierda, ...(p.videoSplit?.izquierda ?? {}) },
    derecha: { ...marca.videoSplit.derecha, ...(p.videoSplit?.derecha ?? {}) },
  };
  const unica = {
    titulo: marca.unica.titulo,
    tarjetas: marca.unica.tarjetas
      .filter((t: any) => lamp || !t.soloLamparas)
      .map((t: any) => ({ ...t, imagen: t.imagen && publicExists(t.imagen) ? t.imagen : null })),
  };
  const faq = (p.faq ?? marca.saber.faq)
    .filter((q: any) => lamp || !q.soloLamparas)
    .filter((q: any) => q.respuesta) // sin respuesta todavía → la pregunta no se muestra
    .map((q: any) => ({ pregunta: q.pregunta, respuesta: q.respuesta }));
  const saber = { titulo: `${marca.saber.titulo} ${p.nombre.toLowerCase()}`, video: marca.saber.video, faq };

  // Ficha técnica: material y alto salen del producto; el resto, de p.ficha (si falta, "por confirmar").
  const values: Record<string, string> = {
    material: p.material,
    alto: `${p.alto_mm} mm`,
    ...Object.fromEntries(Object.entries(p.ficha ?? {}).filter(([k]) => !['imagen', 'alt'].includes(k)).map(([k, v]) => [k, String(v)])),
  };
  const filas = marca.ficha.campos
    .filter((c: any) => lamp || !c.soloLamparas)
    .map((c: any) => ({ etiqueta: c.etiqueta, valor: values[c.clave] ?? c.valor }))
    .filter((f: any) => f.valor); // sin dato todavía → la fila no se muestra
  const ficha = { titulo: marca.ficha.titulo, filas, imagen: p.ficha?.imagen ?? null, alt: p.ficha?.alt ?? `Detalle de ${p.nombre}` };

  return { hero, split, unica, saber, ficha };
}
