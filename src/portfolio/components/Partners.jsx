import { partners } from '../data/partners';

export default function Partners() {
  return (
    <section className="partners">
      <div className="vertical-label">HISTORIAL DE SOCIOS DE CONFIANZA</div>
      <div className="partners-body">
        <div className="section-eyebrow">— SOCIOS DE CONFIANZA</div>
        <div className="partners-grid">
          {partners.map((name) => (
            <div className="partner-cell" key={name}>
              <span>{name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
