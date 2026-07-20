export default function ReelBar() {
  return (
    <section className="reel-bar">
      <a href="#works" className="reel-link">VER TRABAJOS →</a>
      <button className="play-btn" aria-label="Reproducir video" type="button">
        <span>▶</span>
      </button>
      <div className="reel-right">
        <div className="reel-title">VER VIDEO</div>
        <div className="reel-sub">DESLIZA HACIA ABAJO <span>↓</span></div>
      </div>
    </section>
  );
}
