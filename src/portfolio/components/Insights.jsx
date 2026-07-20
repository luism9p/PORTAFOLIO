import { posts } from '../data/posts';

export default function Insights() {
  return (
    <section id="insights" className="insights">
      <div className="insights-side">
        <div className="insights-label">
          A VECES<br />ESCRIBIMOS.<br />
          <a href="#insights" className="accent-text">VER TODO →</a>
        </div>
        <div className="vertical-label">ARTÍCULOS DESTACADOS</div>
      </div>
      <div className="insights-body">
        <a href="#insights" className="featured-post">
          <div className="featured-image placeholder-insight"></div>
          <div className="featured-meta">
            <h3>La historia detrás del rebranding de FlowHive y su nueva arquitectura web.</h3>
            <span className="post-date">JUN 2026</span>
          </div>
        </a>
        <div className="post-list">
          {posts.map((post) => (
            <a href="#insights" className="post-row" key={post.title}>
              <span className="post-title">{post.title}</span>
              <span className="post-date">{post.date}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
