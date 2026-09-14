import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { ArrowRight, ArrowUpRight, ChevronDown, CircuitBoard, CloudSun, Code2, Gamepad2, Layers, Play, ShoppingBag, Smartphone, Sparkles } from 'lucide-react';
import { MODULES, MORE_REPOS, type Module, type ModuleCategory } from './content';
import { useStudio } from './context';
import { GithubIcon, Modal, Reveal, SectionTitle } from './ui';
import { CircuitDiagram, type CircuitNodeId } from './Circuit';

function ModuleArtwork({ module }: { module: Module }) {
  return <div className={`module-art art-${module.visual}`} style={{ '--module-accent': module.accent } as CSSProperties} aria-hidden="true">
    <div className="module-art-grid" />
    <span className="art-label">MKA / INTERFACE STUDY</span>
    {module.visual === 'media' && <div className="mini-player">
      <div className="mini-chrome"><i /><i /><i /><span>VIDEO PLAYER</span></div>
      <div className="mini-video"><img src="/images/synthwave-horizon.jpg" alt="" loading="lazy" /><span><Play size={20} fill="currentColor" /></span></div>
      <div className="mini-progress"><i /></div>
      <div className="mini-playback"><Play size={8} /><span>02:34 / 08:12</span><i /></div>
    </div>}
    {module.visual === 'dashboard' && <div className="mini-dashboard">
      <aside><i /><i /><i /><i /></aside>
      <div className="mini-dash-body"><strong>Overview <span>THIS WEEK</span></strong><div className="mini-dash-stats"><i /><i /><i /></div>
        <div className="mini-chart">{[30, 54, 42, 70, 58, 84, 66, 94, 75, 90, 100].map((h, i) => <i key={i} style={{ height: `${h}%` }} />)}</div>
      </div>
    </div>}
    {module.visual === 'pos' && <div className="mini-pos"><div><strong>Point of sale</strong><div className="mini-products">{[0, 1, 2, 3, 4, 5].map((i) => <span key={i}><ShoppingBag size={17} /><i /><i /></span>)}</div></div><aside><span>ORDER SUMMARY</span><i /><i /><i /><hr /><i /><b>CHECKOUT</b></aside></div>}
    {module.visual === 'web' && <div className="mini-browser"><div className="mini-chrome"><i /><i /><i /><span>mka / web</span></div><div className="mini-web-hero"><Layers size={36} /><strong>Ideas, everywhere.</strong><span>YOUR NEXT WEB EXPERIENCE</span><i /></div></div>}
    {module.visual === 'games' && <div className="mini-arcade"><span>PLAYER ONE</span><div className="arcade-invaders">{Array.from({ length: 15 }, (_, i) => <Gamepad2 key={i} size={18} />)}</div><i /><strong>READY TO PLAY</strong></div>}
    {module.visual === 'weather' && <div className="mini-weather"><span>BANGKOK, TH</span><CloudSun size={65} strokeWidth={1} /><strong>28<span>°</span></strong><p>PARTLY CLOUDY</p><div><i /><i /><i /><i /></div></div>}
    <span className="art-corner"><Smartphone size={12} />DESIGN EXPLORATION</span>
  </div>;
}

function TargetMetric({ target }: { target: Module['targets'][number] }) {
  const [progress, setProgress] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const { paused, reducedMotion } = useStudio();
  useEffect(() => {
    let raf = 0;
    if (!ref.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      if (paused || reducedMotion) { setProgress(1); return; }
      const start = performance.now();
      const tick = (t: number) => {
        const amount = Math.min((t - start) / 1100, 1);
        setProgress(1 - (1 - amount) ** 3);
        if (amount < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.1 });
    observer.observe(ref.current);
    return () => { observer.disconnect(); cancelAnimationFrame(raf); };
  }, [paused, reducedMotion]);
  return <div ref={ref} className="module-metric"><span>{target.label}<b>{(target.value * progress).toFixed(Number.isInteger(target.value) ? 0 : 1)}<small>{target.unit}</small></b></span><div className="metric-track"><i style={{ width: `${Math.min(100, target.value / target.max * 100) * progress}%` }} /></div></div>;
}

export function ModuleDetails({ module, onClose }: { module: Module; onClose?: () => void }) {
  const [tab, setTab] = useState<'overview' | 'architecture' | 'targets'>('overview');
  const [node, setNode] = useState<CircuitNodeId>('domain');
  const { openAssistant } = useStudio();
  return <div className="module-detail">
    <div className="module-detail-title"><span className="studio-eyebrow">MODULE / {module.category.toUpperCase()}</span><h2>{module.name}</h2><p>{module.description}</p></div>
    <div className="detail-tabs" role="tablist" aria-label="Module details">
      {(['overview', 'architecture', 'targets'] as const).map((id, i, tabs) => <button key={id} role="tab" id={`tab-${id}`} tabIndex={tab === id ? 0 : -1} aria-selected={tab === id} aria-controls={`panel-${id}`} onClick={() => setTab(id)} onKeyDown={(event) => {
        const direction = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
        if (!direction && event.key !== 'Home' && event.key !== 'End') return;
        event.preventDefault();
        const next = tabs[event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (i + direction + tabs.length) % tabs.length];
        setTab(next);
        document.getElementById(`tab-${next}`)?.focus();
      }}>{id}</button>)}
    </div>
    <div className="detail-tab-content" role="tabpanel" aria-labelledby={`tab-${tab}`} id={`panel-${tab}`}>
      {tab === 'overview' && <><ModuleArtwork module={module} /><h3>Built around a clear objective.</h3><p>{module.objective}</p><ol>{module.decisions.map((decision, i) => <li key={decision}><span>0{i + 1}</span>{decision}</li>)}</ol></>}
      {tab === 'architecture' && <><p className="detail-note">An illustrative architecture study for this module. This is a proposed approach, not an automated analysis of the repository.</p><CircuitDiagram selected={node} onSelect={setNode} /></>}
      {tab === 'targets' && <><h3>Performance is a design constraint.</h3><p>These are engineering targets, not measured benchmark results. Device-specific timings require a release-build trace on real hardware.</p><div className="detail-metrics">{module.targets.map((target) => <TargetMetric key={target.label} target={target} />)}</div><p className="detail-note">Suggested verification: frame timing traces, cold-start runs, failure recovery tests, and accessibility checks.</p></>}
    </div>
    <div className="module-detail-actions"><a href={module.repository} target="_blank" rel="noopener noreferrer" className="studio-button primary"><GithubIcon size={16} />View repository<ArrowUpRight size={15} /></a><button type="button" className="studio-button ghost" onClick={() => { onClose?.(); openAssistant({ project: module.id, question: `Explain the architecture for ${module.name}` }); }}><Sparkles size={15} />Ask the assistant</button></div>
  </div>;
}

export function ProjectRoute({ slug }: { slug: string }) {
  const module = MODULES.find((m) => m.id === slug);
  if (!module) return null;
  return <div className="studio-container standalone-project"><a href="#projects" className="back-link">Back to selected work <ArrowUpRight size={14} /></a><ModuleDetails module={module} /></div>;
}

export default function Modules() {
  const [filter, setFilter] = useState<ModuleCategory | 'All work'>('All work');
  const [selected, setSelected] = useState<Module | null>(null);
  const [archive, setArchive] = useState(false);
  const { mode } = useStudio();
  const list = MODULES.filter((m) => filter === 'All work' || m.category === filter);

  return <section className="studio-section modules-section studio-container" id="projects">
    <Reveal><div className="section-heading-row"><SectionTitle number="01" eyebrow="SELECTED WORK" title="Ideas. Engineered" accent="into reality." description="Independent builds, thoughtful interfaces, and systems made to last." /><a className="studio-text-link" href="https://github.com/moekyawaung-tech/" target="_blank" rel="noopener noreferrer"><GithubIcon size={16} />All repositories<ArrowUpRight size={14} /></a></div></Reveal>
    <div className="modules-toolbar"><div className="project-filters" role="group" aria-label="Filter projects">{(['All work', 'Android', 'Web / PWA', 'Games'] as const).map((category) => <button key={category} type="button" aria-pressed={filter === category} onClick={() => setFilter(category)}>{category}{filter === category && <span>{list.length.toString().padStart(2, '0')}</span>}</button>)}</div><span className="module-count">{mode === 'plasma' ? <CircuitBoard size={12} /> : <Gamepad2 size={13} />} {mode === 'plasma' ? 'MODULE LIBRARY' : 'CARTRIDGE LIBRARY'}</span></div>
    <div className="module-grid" key={filter}>
      {list.map((module, i) => <Reveal key={module.id} delay={i % 3 * 80} className="module-reveal">
        <article className={`module-card ${mode === 'synthwave' ? 'cartridge-card' : ''}`} style={{ '--module-accent': module.accent } as CSSProperties}>
          <button type="button" className="module-art-button" onClick={() => setSelected(module)} aria-label={`Explore ${module.name}`}><ModuleArtwork module={module} /><span className="module-zoom"><ArrowUpRight size={20} /></span></button>
          <div className="module-body"><div className="module-index"><span>{mode === 'plasma' ? 'MODULE' : 'CARTRIDGE'}_{String(MODULES.indexOf(module) + 1).padStart(3, '0')}</span><i /><span>{module.category}</span></div>
            <h3><button onClick={() => setSelected(module)}>{module.name}<ArrowUpRight size={19} /></button></h3><p>{module.description}</p>
            <div className="module-tags">{module.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
            <div className="module-targets"><span className="targets-caption">ENGINEERING TARGETS</span>{module.targets.map((target) => <TargetMetric key={target.label} target={target} />)}</div>
            <div className="module-actions"><button onClick={() => setSelected(module)}>Explore {mode === 'plasma' ? 'module' : 'cartridge'}<ArrowRight size={14} /></button><a href={module.repository} target="_blank" rel="noopener noreferrer" aria-label={`View ${module.name} source on GitHub`}><GithubIcon size={16} /><span>Source</span></a></div>
          </div>
        </article>
      </Reveal>)}
    </div>
    <div className="modules-footer"><p><Code2 size={14} />Interface studies. Real repositories. Targets are not benchmark claims.</p><button type="button" onClick={() => setArchive(!archive)} aria-expanded={archive}>More from the workshop<ChevronDown size={14} className={archive ? 'rotated' : ''} /></button></div>
    {archive && <div className="repository-archive">{MORE_REPOS.map(([name, href]) => <a key={href} href={href} target="_blank" rel="noopener noreferrer"><GithubIcon size={15} />{name}<ArrowUpRight size={14} /></a>)}</div>}
    {selected && <Modal title={`${mode === 'plasma' ? 'Module' : 'Cartridge'} / ${selected.name}`} onClose={() => setSelected(null)} wide><ModuleDetails key={selected.id} module={selected} onClose={() => setSelected(null)} /></Modal>}
  </section>;
}