import Header from './components/Header';
import MobileNav from './components/MobileNav';
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
import { useMobileMenu } from './hooks/useMobileMenu';
import { usePageLoadAnimation } from './hooks/usePageLoadAnimation';

export default function App() {
  const mobileMenu = useMobileMenu();
  usePageLoadAnimation();

  return (
    <>
      <div className="wrap">
        <Header mobileMenu={mobileMenu} />
        <MobileNav mobileMenu={mobileMenu} />
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
      {/* page-header preset (top, 10rem, target:page) with strength/divCount/zIndex
          overrides tuned for this header — see GradualBlur.jsx for the WebKit fix. */}
      <GradualBlur preset="page-header" strength={2} divCount={4} curve="bezier" zIndex={50} />
    </>
  );
}
