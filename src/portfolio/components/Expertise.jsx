import { useAccordion } from '../hooks/useAccordion';
import { services } from '../data/services';

export default function Expertise() {
  const { openIndex, toggle } = useAccordion();

  return (
    <section id="expertise" className="expertise">
      <div className="expertise-side">
        <div className="expertise-labels">
          ESTRATEGIA<br />DESARROLLO<br />INTEGRACIÓN<br />OPTIMIZACIÓN
        </div>
        <a href="#about" className="vertical-label accent">NOSOTROS</a>
      </div>
      <div className="expertise-body">
        <div className="section-eyebrow">— SERVICIOS</div>
        <div className="accordion">
          {services.map((service, i) => (
            <div className={`accordion-item${openIndex === i ? ' open' : ''}`} key={service.num}>
              <button className="accordion-trigger" type="button" onClick={() => toggle(i)}>
                <span className="acc-num">{service.num}</span>
                <span className="acc-title">{service.title}</span>
                <span className="acc-icon">+</span>
              </button>
              <div className="accordion-panel">
                <p>{service.body}</p>
              </div>
            </div>
          ))}
        </div>
        <a href="#works" className="underline-link">VER TODOS LOS SERVICIOS →</a>
      </div>
    </section>
  );
}
