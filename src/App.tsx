import { lazy, Suspense, useEffect, useRef } from 'react';
import { LangCtx } from './hooks';
import { useRoute } from './lib/router';
import { StudioProvider, useStudio } from './studio/context';
import Header from './studio/Header';
import Hero from './studio/Hero';
import Modules, { ProjectRoute } from './studio/Modules';
import { About, Expertise, Playground, ResumePage } from './studio/Sections';
import Contact from './studio/Contact';
import Footer from './studio/Footer';
import Assistant from './studio/Assistant';
import { MODULES, OWNER } from './studio/content';

const ReferencePages = lazy(() => import('./studio/ReferencePages'));

function Portfolio() {
  const route = useRoute();
  const { mode } = useStudio();
  const firstRender = useRef(true);
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const subject = route ? route.replace(/[-/]/g, ' ') : mode === 'plasma' ? 'Plasma Reactor' : 'Synthwave';
    document.title = `${OWNER.name} | ${subject} Portfolio`;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', mode === 'plasma' ? '#09060f' : '#0d0715');
  }, [route, mode]);

  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      if (!route) {
        const params = new URLSearchParams(location.hash.split('?')[1] ?? '');
        const id = params.get('section') ?? (location.hash.startsWith('#/') ? 'home' : location.hash.slice(1) || 'home');
        const target = document.getElementById(id);
        if (target && id !== 'home') target.scrollIntoView({ behavior: 'auto', block: 'start' });
        else window.scrollTo({ top: 0, behavior: 'auto' });
      } else {
        window.scrollTo({ top: 0, behavior: 'auto' });
        if (!firstRender.current) mainRef.current?.focus({ preventScroll: true });
      }
      firstRender.current = false;
    });
    return () => cancelAnimationFrame(handle);
  }, [route]);

  let page;
  const primaryPages = ['projects', 'about', 'skills', 'contact', 'playground', 'resume'];
  if (!route) page = <><Hero /><Modules /><About /><Expertise /><Playground /><Contact /></>;
  else if (route === 'resume') page = <ResumePage />;
  else if (route.startsWith('project/') && MODULES.some((m) => m.id === route.slice(8))) page = <ProjectRoute slug={route.slice(8)} />;
  else if (primaryPages.includes(route)) page = <div className="legacy-page">
    <h1 className="sr-only">{route.charAt(0).toUpperCase() + route.slice(1)} | {OWNER.name}</h1>
    {route === 'projects' ? <Modules /> : route === 'about' ? <About /> : route === 'skills' ? <Expertise /> : route === 'playground' ? <Playground /> : <Contact />}
  </div>;
  else page = <Suspense fallback={<div className="studio-container studio-section resume-page" role="status">Loading the workshop...</div>}><ReferencePages route={route} /></Suspense>;

  return <LangCtx.Provider value="en">
    <a href="#main-content" className="skip-link">Skip to content</a>
    <Header />
    <main ref={mainRef} id="main-content" tabIndex={-1}>{page}</main>
    <Footer />
    <Assistant />
  </LangCtx.Provider>;
}

export default function App() {
  return <StudioProvider><Portfolio /></StudioProvider>;
}