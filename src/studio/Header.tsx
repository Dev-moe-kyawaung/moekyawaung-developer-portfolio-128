import { useEffect, useState, type MouseEvent } from 'react';
import { ArrowUpRight, AudioLines, ChevronDown, Menu, Pause, Play, Search, Sun, Zap } from 'lucide-react';
import { NAV_GROUPS } from '../content';
import { Link, scrollToSection, useRoute } from '../lib/router';
import { useStudio } from './context';
import { Mark, Modal } from './ui';

const NAV = [['projects', 'Work'], ['about', 'About'], ['skills', 'Expertise'], ['playground', 'Playground']];

function SectionLink({ id, children, onFollow }: { id: string; children: React.ReactNode; onFollow?: () => void }) {
  const follow = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.ctrlKey || event.metaKey || event.shiftKey) return;
    event.preventDefault();
    onFollow?.();
    scrollToSection(id);
  };
  return <a href={`#${id}`} onClick={follow}>{children}</a>;
}

export function ModeSwitch({ compact = false }: { compact?: boolean }) {
  const { mode, setMode } = useStudio();
  return <div className={`mode-switch ${compact ? 'compact' : ''}`} role="group" aria-label="Visual theme">
    <button type="button" aria-pressed={mode === 'plasma'} onClick={() => setMode('plasma')}><Zap size={12} />Plasma</button>
    <button type="button" aria-pressed={mode === 'synthwave'} onClick={() => setMode('synthwave')}><Sun size={13} />Synthwave</button>
  </div>;
}

export function PageDirectory({ onClose }: { onClose: () => void }) {
  return <Modal title="Explore the portfolio" onClose={onClose} wide>
    <div className="directory-grid">{NAV_GROUPS.map((group) => <nav key={group.group} aria-label={`${group.group} pages`}>
      <h3>{group.group}</h3>
      {group.items.map((item) => <span key={item.to} onClick={onClose}><Link to={item.to}>{item.label}<ArrowUpRight size={13} /></Link></span>)}
    </nav>)}</div>
  </Modal>;
}

export default function Header() {
  const { paused, setPaused, reducedMotion } = useStudio();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [directory, setDirectory] = useState(false);
  const route = useRoute();

  useEffect(() => {
    const update = () => setScrolled(scrollY > 24);
    update(); addEventListener('scroll', update, { passive: true });
    return () => removeEventListener('scroll', update);
  }, []);
  useEffect(() => { setMenu(false); setDirectory(false); }, [route]);

  useEffect(() => {
    const shortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        if (!directory && document.querySelector('dialog[open]')) return;
        setMenu(false);
        setDirectory((open) => !open);
      }
    };
    addEventListener('keydown', shortcut);
    return () => removeEventListener('keydown', shortcut);
  }, [directory]);

  return <>
    <header className={`studio-header ${scrolled || route ? 'is-scrolled' : ''}`}>
      <div className="studio-header-inner">
        <Link to="" className="studio-brand" ariaLabel="Moe Kyaw Aung home"><Mark /><span>MKA<span className="brand-period">.</span><small>CODE WITH PURPOSE</small></span></Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {NAV.map(([id, label]) => <SectionLink id={id} key={id}>{label}</SectionLink>)}
          <button type="button" onClick={() => setDirectory(true)}>Explore<ChevronDown size={12} /></button>
        </nav>
        <div className="header-tools">
          <ModeSwitch compact />
          <button type="button" className="studio-icon-button motion-toggle" disabled={reducedMotion} aria-label={reducedMotion ? 'Reduced motion enabled by your system' : paused ? 'Resume animations' : 'Pause animations'} title={paused || reducedMotion ? 'Motion paused' : 'Pause motion'} onClick={() => setPaused(!paused)}>{paused || reducedMotion ? <Play size={15} /> : <Pause size={15} />}</button>
          <span className="header-contact"><SectionLink id="contact">Let&apos;s talk<ArrowUpRight size={15} /></SectionLink></span>
          <button type="button" className="studio-icon-button mobile-menu-trigger" onClick={() => setMenu(true)} aria-label="Open navigation" aria-expanded={menu}><Menu size={22} /></button>
        </div>
      </div>
    </header>
    {menu && <Modal title="Navigation" onClose={() => setMenu(false)}>
      <nav className="mobile-nav" aria-label="Mobile navigation">
        {NAV.map(([id, label], i) => <SectionLink key={id} id={id} onFollow={() => setMenu(false)}><span>0{i + 1}</span>{label}<ArrowUpRight size={20} /></SectionLink>)}
        <SectionLink id="contact" onFollow={() => setMenu(false)}><span>05</span>Contact<ArrowUpRight size={20} /></SectionLink>
        <button onClick={() => { setMenu(false); setDirectory(true); }}><Search size={18} />Explore all pages</button>
      </nav>
      <div className="mobile-menu-footer"><AudioLines size={15} /><ModeSwitch /></div>
    </Modal>}
    {directory && <PageDirectory onClose={() => setDirectory(false)} />}
  </>;
}

export { SectionLink };