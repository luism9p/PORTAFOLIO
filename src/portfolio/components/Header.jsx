export default function Header({ mobileMenu }) {
  return (
    <header className="site-header">
      <a href="#top" className="logo">
        <img src="/assets/logo-white.png" alt="" className="logo-mark-img" />
        <span className="logo-word">flowhive</span>
      </a>
      <nav className="main-nav">
        <a href="#works">TRABAJOS</a>
        <a href="#expertise">SERVICIOS</a>
        <a href="#about">NOSOTROS</a>
        <a href="#insights">BLOG</a>
      </nav>
      <div className="header-contact">
        <span className="divider-line"></span>
        <a href="#footer" className="contact-link">CONTACTO</a>
      </div>
      <button
        className="menu-toggle"
        aria-label="Abrir menú"
        aria-expanded={mobileMenu.isOpen}
        onClick={mobileMenu.toggle}
        type="button"
      >
        <span></span><span></span>
      </button>
    </header>
  );
}
