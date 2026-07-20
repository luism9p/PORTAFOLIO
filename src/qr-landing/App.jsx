import Header from './components/Header';
import Hero from './components/Hero';
import Steps from './components/Steps';
import Results from './components/Results';
import Closing from './components/Closing';
import Footer from './components/Footer';
import { useTimeOnPage } from './hooks/useTimeOnPage';

export default function App() {
  useTimeOnPage();

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Steps />
        <Results />
        <Closing />
      </main>
      <Footer />
    </>
  );
}
