import { stats } from '../data/stats';

export default function Stats() {
  return (
    <section className="stats-section">
      <p className="stats-quote">
        — Un desarrollador que trata cada línea de código como diseño: preciso, rápido y hecho
        para durar.
      </p>
      <div className="stats-grid">
        {stats.map((stat) => (
          <div className="stat-cell" key={stat.label}>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
