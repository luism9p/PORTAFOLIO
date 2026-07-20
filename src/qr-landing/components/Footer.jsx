import { track } from '../lib/analytics';
import { WA_LINKS } from '../lib/whatsapp';

export default function Footer() {
  return (
    <footer className="qr-footer">
      <div>FlowHive — Páginas web en Lobitos, Piura</div>
      <a
        href={WA_LINKS.footer}
        data-event="click_whatsapp_footer"
        onClick={() => track('click_whatsapp_footer')}
      >
        WhatsApp
      </a>
    </footer>
  );
}
