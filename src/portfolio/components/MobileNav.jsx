export default function MobileNav({ mobileMenu }) {
  return (
    <nav className={`mobile-nav${mobileMenu.isOpen ? ' open' : ''}`}>
      <a href="#works" onClick={mobileMenu.close}>TRABAJOS</a>
      <a href="#expertise" onClick={mobileMenu.close}>SERVICIOS</a>
      <a href="#about" onClick={mobileMenu.close}>NOSOTROS</a>
      <a href="#insights" onClick={mobileMenu.close}>BLOG</a>
      <a href="#footer" onClick={mobileMenu.close}>CONTACTO</a>
    </nav>
  );
}
