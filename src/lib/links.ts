import site from '../data/site.json';

/** Número en site.json: solo dígitos, con código de país (p. ej. 51912345678). */
export const waDigits = String(site.whatsapp || '').replace(/\D/g, '');
export const waHref = waDigits ? `https://wa.me/${waDigits}` : '';
/** Enlace de WhatsApp con mensaje ya escrito; vacío si todavía no hay número. */
export const waLink = (text: string) => (waHref ? `${waHref}?text=${encodeURIComponent(text)}` : '');
export { site };
