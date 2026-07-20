import BubbleMenu from './components/BubbleMenu';
import Hero from './components/Hero';
import ReelBar from './components/ReelBar';
import Commitment from './components/Commitment';
import SelectedWorks from './components/SelectedWorks';
import Expertise from './components/Expertise';
import Stats from './components/Stats';
import Partners from './components/Partners';
import Conclusion from './components/Conclusion';
import Insights from './components/Insights';
import Footer from './components/Footer';
import GradualBlur from './components/GradualBlur';
import { usePageLoadAnimation } from './hooks/usePageLoadAnimation';
import { navItems } from './data/navItems';

const BUBBLE_LOGO = (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
    <img src="/assets/logo-white.png" alt="" style={{ width: '22px', height: '22px', objectFit: 'contain' }} />
    <span
      style={{
        fontFamily: "'Archivo', sans-serif",
        fontWeight: 600,
        fontSize: '15px',
        letterSpacing: '-0.5px',
        color: '#C8FF00',
      }}
    >
      flowhive
    </span>
  </span>
);

export default function App() {
  usePageLoadAnimation();

  return (
    <>
      <div className="wrap">
        <BubbleMenu
          logo={BUBBLE_LOGO}
          items={navItems}
          menuAriaLabel="Abrir menú"
          menuBg="#0a0a0a"
          menuContentColor="#C8FF00"
          useFixedPosition
          animationEase="back.out(1.5)"
          animationDuration={0.5}
          staggerDelay={0.12}
        />
        <Hero />
        <ReelBar />
        <Commitment />
        <SelectedWorks />
        <Expertise />
        <Stats />
        <Partners />
        <Conclusion />
        <Insights />
        <Footer />
      </div>
      {/* page-header preset (top, 10rem, target:page). zIndex=-20 -> effective
          80, kept below BubbleMenu's nav (z-index 99) now that it replaces
          the old sticky header — see GradualBlur.jsx for the WebKit fix. */}
      <GradualBlur preset="page-header" strength={2} divCount={4} curve="bezier" zIndex={-20} />
    </>
  );
}
