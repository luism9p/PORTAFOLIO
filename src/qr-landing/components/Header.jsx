import { track } from '../lib/analytics';
import { WA_LINKS } from '../lib/whatsapp';

export default function Header() {
  return (
    <header className="qr-header">
      <a href="#top" className="qr-logo">
        <img src="/assets/logo-white.png" alt="FlowHive" className="qr-logo-mark" />
        <span>flowhive</span>
      </a>
      <a
        href={WA_LINKS.header}
        className="wa-btn wa-btn-small"
        data-event="click_whatsapp_header"
        onClick={() => track('click_whatsapp_header')}
      >
        Escríbeme por WhatsApp
      </a>
    </header>
  );
}
