import { useInView } from '../hooks/useInView';
import { steps } from '../data/steps';

export default function Steps() {
  const [ref, isVisible] = useInView({ threshold: 0.15 });

  return (
    <section
      className={`qr-steps${isVisible ? ' is-visible' : ''}`}
      id="como-funciona"
      ref={ref}
    >
      <h2>Así de simple es empezar</h2>
      {steps.map((step) => (
        <div className="step" key={step.num}>
          <span className="step-num">{step.num}</span>
          <div className="step-body">
            <h3>{step.title}</h3>
            <p>{step.body}</p>
          </div>
        </div>
      ))}
    </section>
  );
}
