import site from '../data/site.json';

/** Número en site.json: solo dígitos, con código de país (p. ej. 51912345678). */
const waDigits = String(site.whatsapp || '').replace(/\D/g, '');

/**
 * Único constructor de enlaces a WhatsApp (se usa al generar las páginas y en el navegador).
 * Sin texto, lleva el mensaje general. Devuelve vacío si todavía no hay número.
 * Los mensajes van sin emojis: llegaban rotos.
 */
export const waLink = (text: string = site.mensajeGeneral) =>
  waDigits ? `https://api.whatsapp.com/send?phone=${waDigits}&text=${encodeURIComponent(text)}` : '';

export { site };
