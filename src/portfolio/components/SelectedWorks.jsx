import { useRef } from 'react';
import { useWorksGlitch } from '../hooks/useWorksGlitch';
import { useLerpCursorPreview } from '../hooks/useLerpCursorPreview';
import { works } from '../data/works';

const GLITCH_BLOCK_COUNT = 9;

export default function SelectedWorks() {
  const sectionRef = useRef(null);
  const wrapRef = useRef(null);
  const trackerRef = useRef(null);

  useWorksGlitch(wrapRef);
  useLerpCursorPreview({ sectionRef, trackerRef });

  return (
    <section id="works" className="works" ref={sectionRef}>
      <div className="works-head">
        <div className="works-title-wrap" ref={wrapRef}>
          <h2 className="works-title">PROYECTOS<br />DESTACADOS</h2>
          <div className="glitch-blocks">
            {Array.from({ length: GLITCH_BLOCK_COUNT }).map((_, i) => (
              <span className="glitch-block" key={i}></span>
            ))}
          </div>
          <div className="glitch-banner">CONSTRUIMOS INTERFACES</div>
        </div>
        <div className="works-hint">Pasa el cursor sobre cada proyecto para previsualizarlo.</div>
      </div>

      <div className="works-list">
        {works.map((work, i) => (
          <a href="#works" className="work-row" data-work={i} key={work.name}>
            <span className="work-num">{work.num}</span>
            <span className="work-name">{work.name}</span>
            <span className="work-desc">{work.desc}</span>
          </a>
        ))}
      </div>

      <div className="work-tracker" ref={trackerRef}>
        {works.map((work, i) => (
          <img className="work-preview" src={work.photo} data-preview={i} alt="" key={work.name} />
        ))}
      </div>
    </section>
  );
}
