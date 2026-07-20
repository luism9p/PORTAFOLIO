const PHONE = '51904767959';

function waLink(message) {
  return `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`;
}

export const WA_LINKS = {
  header: waLink('Hola, vi el cartel y quiero mi pagina web'),
  hero: waLink('Hola, vi el cartel y quiero mi pagina web'),
  cierre: waLink('Hola, quiero mi pagina web ahora'),
  footer: waLink('Hola, quiero mi pagina web'),
};
