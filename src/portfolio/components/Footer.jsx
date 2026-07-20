export default function Footer() {
  return (
    <footer id="footer" className="site-footer">
      <a href="mailto:portocarrerolopezluisangel@gmail.com" className="footer-cta">
        <h2>HOLA@FLOWHIVE.DEV</h2>
        <span className="cta-arrow">↗</span>
      </a>
      <div className="footer-grid">
        <div className="footer-info">
          <div className="footer-info-title">FlowHive Studio</div>
          +51 904 767 959<br />
          portocarrerolopezluisangel@gmail.com<br />
          Lobitos, Talara — Piura, Perú
        </div>
        <div className="footer-links">
          <div className="footer-links-title">MENÚ</div>
          <a href="#works">TRABAJOS</a>
          <a href="#expertise">SERVICIOS</a>
          <a href="#about">NOSOTROS</a>
          <a href="#insights">BLOG</a>
        </div>
        <div className="footer-links">
          <div className="footer-links-title">ESTUDIO</div>
          <a href="#">TRABAJA CON NOSOTROS</a>
          <a href="#footer">CONTACTO</a>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-copy">
          © 2026 FLOWHIVE — TODOS LOS DERECHOS RESERVADOS ·{' '}
          <span className="accent-text">HAGAMOS VOLAR TUS IDEAS.</span>
        </div>
      </div>
      <div className="footer-wordmark-wrap">
        <span className="footer-wordmark">flowhive</span>
      </div>
    </footer>
  );
}
