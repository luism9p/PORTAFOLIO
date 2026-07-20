import { useRef } from 'react';
import { useTypewriter } from '../hooks/useTypewriter';
import { useHeroParallax } from '../hooks/useHeroParallax';

const HEADLINE = 'Donde el código y el diseño crean experiencias web imparables.';

export default function Hero() {
  const heroRef = useRef(null);
  const { displayedText, cursorRef } = useTypewriter(HEADLINE, {
    typingSpeed: 45,
    variableSpeed: { min: 30, max: 60 },
    initialDelay: 300,
  });
  useHeroParallax(heroRef);

  return (
    <section id="top" className="hero" ref={heroRef}>
      <div className="hero-left">
        <div className="hero-eyebrow">
          <span className="dot"></span>
          DESARROLLADOR FRONTEND · FULL-STACK · LOBITOS, PERÚ
        </div>
        <h1 className="hero-title hero__content" id="heroTitle" style={{ opacity: 1 }}>
          <span className="text-type__content">{displayedText}</span>
          <span className="text-type__cursor" ref={cursorRef}>|</span>
        </h1>
        <div className="hero-cta-row">
          <a href="#works" className="btn-primary">
            Ver proyectos <span className="arrow">→</span>
          </a>
          <div className="hero-note">
            Desarrollador que construye interfaces de alta precisión y automatiza el backend.
          </div>
        </div>
      </div>
      <div className="hero-right">
        <div className="hero-image placeholder-ocean hero__bg"></div>
        <div className="hero-card hero__content">
          <div className="hero-card-tag">FLOWHIVE®</div>
          <div className="hero-card-text">
            Un estudio de desarrollo web que da a las marcas una ventaja técnica real: rápido, dinámico, imparable.
          </div>
        </div>
        <div className="hero-scroll-indicator">
          <span className="pulse-bar"></span>
          <span className="pulse-arrow">↓</span>
        </div>
      </div>
    </section>
  );
}
