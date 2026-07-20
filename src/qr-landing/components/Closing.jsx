import { useRef } from 'react';
import { track } from '../lib/analytics';
import { WA_LINKS } from '../lib/whatsapp';
import { useScrollDepthTracking } from '../hooks/useScrollDepthTracking';

export default function Closing() {
  const ref = useRef(null);
  useScrollDepthTracking(ref, 'scroll_cierre');

  return (
    <section className="qr-closing" id="cierre" ref={ref}>
      <h2>Mientras lo piensas, alguien más ya está apareciendo antes que tú.</h2>
      <p>
        Cada semana que pasa sin una página web es una semana en la que un cliente
        elige a tu competencia solo porque la encontró primero.
      </p>
      <p>
        Escríbeme ahora y en 5 minutos sabrás si tu negocio puede tener resultados
        como los de arriba.
      </p>
      <p className="qr-closing-note">Sin compromiso, sin letra chica.</p>
      <a
        href={WA_LINKS.cierre}
        className="wa-btn wa-btn-large"
        data-event="click_whatsapp_cierre"
        onClick={() => track('click_whatsapp_cierre')}
      >
        Quiero mi página — Escribir por WhatsApp
      </a>
    </section>
  );
}
