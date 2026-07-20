import PixelTrail from './PixelTrail';

export default function Conclusion() {
  return (
    <section className="conclusion">
      <div className="conclusion-trail">
        <PixelTrail
          gridSize={60}
          trailSize={0.08}
          maxAge={300}
          interpolate={4.7}
          color="#C8FF00"
          gooeyFilter={{ id: 'conclusion-goo-filter', strength: 2 }}
        />
      </div>
      <h2>
        — CONSTRUYO LAS WEBS QUE <span className="accent-text">NO SE PUEDEN IGNORAR.</span>
      </h2>
    </section>
  );
}
