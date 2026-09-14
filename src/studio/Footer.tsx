import { useState } from 'react';
import { ArrowUpRight, ArrowUp, Pause, Play } from 'lucide-react';
import { Link, scrollToSection } from '../lib/router';
import { useStudio } from './context';
import { OWNER } from './content';
import { ModeSwitch, PageDirectory } from './Header';
import { Mark } from './ui';

export default function Footer() {
  const [directory, setDirectory] = useState(false);
  const { paused, setPaused, reducedMotion } = useStudio();
  return <footer className="studio-footer"><div className="studio-container">
    <div className="footer-main"><Link to="" className="studio-brand"><Mark /><span>MKA<span className="brand-period">.</span><small>CODE WITH PURPOSE</small></span></Link><p>Built with intention.<br />Always evolving.</p><nav aria-label="Footer links"><a href={OWNER.github} target="_blank" rel="noopener noreferrer">GitHub<ArrowUpRight size={13} /></a><Link to="blueprints">Architecture lab<ArrowUpRight size={13} /></Link><button onClick={() => setDirectory(true)}>Explore all pages<ArrowUpRight size={13} /></button></nav><button className="back-to-top" onClick={() => scrollToSection('home')} aria-label="Back to top"><ArrowUp size={17} /></button></div>
    <div className="footer-bottom"><span>&copy; {new Date().getFullYear()} Moe Kyaw Aung. Designed to be different.</span><div><button className="footer-motion" disabled={reducedMotion} onClick={() => setPaused(!paused)}>{paused || reducedMotion ? <Play size={12} /> : <Pause size={12} />}{reducedMotion ? 'Reduced motion' : paused ? 'Motion paused' : 'Motion on'}</button><ModeSwitch compact /></div></div>
  </div>{directory && <PageDirectory onClose={() => setDirectory(false)} />}</footer>;
}