import { track } from '../lib/analytics';
import { WA_LINKS } from '../lib/whatsapp';

// Entrance is pure CSS (@keyframes qr-fade-up via .qr-hero-intro) — no hook needed,
// deliberately runs regardless of prefers-reduced-motion for this poster campaign.
export default function Hero() {
  return (
    <section className="qr-hero qr-hero-intro" id="top">
      <h1>¿Tu negocio todavía depende solo del boca a boca?</h1>
      <p className="qr-hero-sub">
        Te hago una página web que trae clientes nuevos, no una que solo se ve bonita.
      </p>
      <a href="#resultados" className="qr-anchor-btn">
        Ver resultados reales de otros negocios
      </a>
      <a
        href={WA_LINKS.hero}
        className="wa-btn wa-btn-outline"
        data-event="click_whatsapp_hero"
        onClick={() => track('click_whatsapp_hero')}
      >
        Escríbeme por WhatsApp
      </a>
    </section>
  );
}
