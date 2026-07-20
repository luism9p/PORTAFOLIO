import { useInView } from '../hooks/useInView';
import { useScrollDepthTracking } from '../hooks/useScrollDepthTracking';
import { results } from '../data/results';

export default function Results() {
  const [ref, isVisible] = useInView({ threshold: 0.15 });
  useScrollDepthTracking(ref, 'scroll_resultados');

  return (
    <section
      className={`qr-results reveal${isVisible ? ' is-visible' : ''}`}
      id="resultados"
      ref={ref}
    >
      <h2>Esto no es teoría. Así les fue a negocios como el tuyo.</h2>
      {results.map((r) => (
        <div className="result-card" key={r.name}>
          <img className="result-photo" src={r.photo} alt={r.alt} loading="lazy" />
          <div className="result-name">{r.name}</div>
          <blockquote>{r.quote}</blockquote>
        </div>
      ))}
    </section>
  );
}
