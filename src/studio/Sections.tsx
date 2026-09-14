import { useEffect, useState, type CSSProperties } from 'react';
import { ArrowRight, ArrowUpRight, BrainCircuit, Check, Code2, Download, Layers, MapPin, Network, Pause, Play, RotateCcw, ShieldCheck, Smartphone, Sparkles, Zap } from 'lucide-react';
import { Link } from '../lib/router';
import { EXPERTISE, OWNER } from './content';
import { useStudio } from './context';
import { ModeSwitch } from './Header';
import { GithubIcon, ProfileImage, Reveal, SectionTitle } from './ui';

export function downloadResume() {
  const content = [
    'MOE KYAW AUNG', 'Senior Android Developer', '',
    `Email: ${OWNER.email}`, `Phone: ${OWNER.phone}`, `Alternate phone: ${OWNER.alternatePhone}`,
    `GitHub: ${OWNER.github}`, `LinkedIn: ${OWNER.linkedin}`, `Profile: ${OWNER.gravatar}`, '',
    'PROFESSIONAL SUMMARY',
    'Android developer with nearly 12 years of hands-on experience building secure, scalable, user-friendly mobile applications.',
    'Focus: clean architecture, maintainable code, practical security, and end-to-end product delivery.', '',
    'TECHNICAL FOCUS',
    'Kotlin, Jetpack Compose, ViewModel, Room, MVVM, Clean Architecture, Coroutines, REST APIs, Firebase, Flutter, Dart, CI/CD.', '',
    'CURRENT PROJECT', 'MoekyawTranslator: an AI translation application.', '',
    'SELECTED REPOSITORIES',
    'https://github.com/moekyawaung-tech/video-player',
    'https://github.com/moekyawaung-tech/social-dashboard',
    'https://github.com/moekyawaung-tech/POS-Ultimate-Pro-Max', '',
    'LOCATION', 'Tachileik, Myanmar / Bangkok, Thailand', '',
    'Source: owner-provided profile and links. Full bio: ' + OWNER.bio,
  ].join('\n');
  const url = URL.createObjectURL(new Blob([content], { type: 'text/plain;charset=utf-8' }));
  const anchor = document.createElement('a');
  anchor.href = url; anchor.download = 'Moe-Kyaw-Aung-Resume.txt'; anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function About() {
  return <section className="studio-section about-section" id="about">
    <div className="studio-container about-layout">
      <Reveal className="about-portrait-col"><a href={OWNER.gravatar} target="_blank" rel="noopener noreferrer" className="about-portrait"><ProfileImage src={OWNER.avatar} /><span className="portrait-link"><ArrowUpRight size={18} /></span></a><div className="portrait-caption"><span className="status-dot" />Open to meaningful collaborations</div></Reveal>
      <Reveal delay={100} className="about-copy"><SectionTitle number="02" eyebrow="THE ENGINEER BEHIND THE CODE" title="Built on curiosity." accent="Refined by experience." />
        <p className="about-lead">I&apos;m Moe Kyaw Aung. I build mobile experiences that feel simple, even when the systems behind them aren&apos;t.</p>
        <p>With nearly 12 years of hands-on Android development, I work across Kotlin, modern Jetpack, Firebase, and Flutter. My focus is clean architecture, practical security, and code that the next engineer can confidently maintain.</p>
        <p>From the first screen to networking, local caching, testing, and release, I care about how a product actually behaves in people&apos;s hands.</p>
        <div className="about-location"><MapPin size={15} />Tachileik, Myanmar<span>/</span>Bangkok, Thailand</div>
        <div className="about-actions"><button type="button" className="studio-button ghost" onClick={downloadResume}><Download size={15} />Download resume<span className="file-extension">TXT</span></button><a className="studio-text-link" href={OWNER.bio} target="_blank" rel="noopener noreferrer">Read my full bio<ArrowUpRight size={15} /></a></div>
      </Reveal>
    </div>
  </section>;
}

const ICONS = { mobile: Smartphone, layers: Layers, network: Network, ai: BrainCircuit };
export function Expertise() {
  return <section className="studio-section studio-container expertise-section" id="skills">
    <Reveal><div className="section-heading-row"><SectionTitle number="03" eyebrow="CORE CAPABILITIES" title="The craft behind" accent="the glow." description="Technology is the toolkit. Thoughtful engineering is the difference." /><Link to="blueprints" className="studio-text-link">Explore architecture notes<ArrowUpRight size={15} /></Link></div></Reveal>
    <div className="expertise-grid">{EXPERTISE.map((item, i) => {
      const Icon = ICONS[item.icon as keyof typeof ICONS];
      return <Reveal key={item.id} delay={i * 70}><div className="expertise-item"><div><Icon size={25} strokeWidth={1.5} /><span>{item.id}</span></div><h3>{item.title}</h3><p>{item.description}</p><small>{item.tags}</small></div></Reveal>;
    })}</div>
    <Reveal><div className="engineering-principle"><ShieldCheck size={18} /><p>Clear boundaries. Measurable performance. <strong>No magic required.</strong></p><Link to="architecture">My approach<ArrowUpRight size={14} /></Link></div></Reveal>
  </section>;
}

export function Playground() {
  const { mode, setMode, paused, setPaused, reducedMotion, openAssistant } = useStudio();
  const [power, setPower] = useState(65);
  const [running, setRunning] = useState(true);
  const [ticks, setTicks] = useState(0);
  const motion = running && !paused && !reducedMotion;
  useEffect(() => {
    if (!motion) return;
    const id = setInterval(() => { if (!document.hidden) setTicks((t) => t + 1); }, 1000);
    return () => clearInterval(id);
  }, [motion]);

  return <section id="playground" className="studio-section studio-container playground-section">
    <Reveal><div className="section-heading-row"><SectionTitle number="04" eyebrow="A LITTLE EXPERIMENTATION" title="Engineering, with" accent="room to play." description="One portfolio. Two frequencies. Tune the experience to your wavelength." /><ModeSwitch /></div></Reveal>
    <Reveal><div className="lab-console" style={{ '--power': power / 100, '--spin-time': `${32 - power * 0.26}s`, '--reactor-play': motion ? 'running' : 'paused' } as CSSProperties}>
      <div className="lab-stage">
        <div className="lab-stage-grid" />
        <div className={`lab-reactor ${mode === 'synthwave' ? 'retro' : ''}`}>
          <div className="lab-orbit orbit-a"><i /></div><div className="lab-orbit orbit-b"><i /></div><div className="lab-orbit orbit-c"><i /></div><div className="lab-nucleus"><Zap size={32} strokeWidth={1.2} /></div>
          <div className="reactor-floor" />
        </div>
        <div className="lab-stage-bottom"><span><i className={motion ? 'active' : ''} />{motion ? 'SIMULATION RUNNING' : 'SIMULATION PAUSED'}</span><span>{mode === 'plasma' ? 'RX-01' : 'ARCADE-86'}</span></div>
      </div>
      <div className="lab-controls">
        <span className="studio-eyebrow">INTERACTIVE VISUAL STUDY</span><h3>{mode === 'plasma' ? 'Tune the core.' : 'Find your frequency.'}</h3><p>{mode === 'plasma' ? 'Adjust the energy input. Watch the containment rings respond.' : 'Turn up the neon. Take the same system back to a different future.'}</p>
        <label className="power-control"><span>{mode === 'plasma' ? 'Energy input' : 'Neon intensity'}<strong>{power}<small>%</small></strong></span><input aria-label={mode === 'plasma' ? 'Energy input' : 'Neon intensity'} type="range" min="5" max="100" value={power} onChange={(e) => setPower(Number(e.target.value))} /><span className="range-labels"><span>LOW</span><span>HIGH</span></span></label>
        <div className="lab-readings"><span>ROTATION<strong>{(32 - power * 0.26).toFixed(1)}<small>s / cycle</small></strong></span><span>ELAPSED<strong>{Math.floor(ticks / 60).toString().padStart(2, '0')}:{(ticks % 60).toString().padStart(2, '0')}</strong></span></div>
        <div className="lab-actions"><button type="button" className="studio-button primary" disabled={reducedMotion} onClick={() => { if (paused) { setPaused(false); setRunning(true); } else setRunning(!running); }}>{motion ? <Pause size={14} /> : <Play size={14} />}{motion ? 'Pause simulation' : 'Start simulation'}</button><button type="button" className="studio-icon-button" aria-label="Reset simulation" title="Reset simulation" onClick={() => { setPower(65); setTicks(0); setRunning(true); }}><RotateCcw size={17} /></button></div>
        <small className="lab-disclaimer">Visual simulation only. {reducedMotion ? 'Your system preference has disabled motion.' : 'No device or production metrics are collected.'}</small>
        <button className="lab-assistant-link" onClick={() => openAssistant({ question: 'How does the engineering circuit work?' })}><Sparkles size={14} />Ask NOVA how it connects<ArrowRight size={14} /></button>
      </div>
    </div></Reveal>
    <div className="playground-note"><span><Code2 size={14} />Thoughtful motion. Real control. Reduced-motion aware.</span><button onClick={() => setMode(mode === 'plasma' ? 'synthwave' : 'plasma')}>Try the {mode === 'plasma' ? 'Synthwave' : 'Plasma'} experience<ArrowUpRight size={14} /></button></div>
  </section>;
}

export function ResumePage() {
  const [downloaded, setDownloaded] = useState(false);
  return <section className="studio-container studio-section resume-page">
    <SectionTitle number="CV" eyebrow="PROFESSIONAL PROFILE" title="Moe Kyaw Aung" accent="/ Engineer." description="Senior Android developer focused on secure, maintainable mobile products." />
    <div className="resume-content"><h2>Summary</h2><p>Nearly 12 years of hands-on mobile development. Kotlin, Jetpack Compose, Flutter, Firebase, REST APIs, local caching, testing, and release workflows.</p><h2>Engineering focus</h2><ul>{EXPERTISE.map((item) => <li key={item.id}><strong>{item.title}</strong> {item.tags}</li>)}</ul><h2>Selected work</h2><p>Video Player, Social Dashboard, POS Ultimate, PWA App, Game Collection, and Weather App.</p><h2>Contact</h2><p><a href={`mailto:${OWNER.email}`}>{OWNER.email}</a><br /><a href="tel:+959889000889">{OWNER.phone}</a></p></div>
    <div className="about-actions"><button className="studio-button primary" onClick={() => { downloadResume(); setDownloaded(true); }}>{downloaded ? <Check size={16} /> : <Download size={16} />}{downloaded ? 'Resume downloaded' : 'Download resume (.txt)'}</button><a className="studio-text-link" href={OWNER.github} target="_blank" rel="noopener noreferrer"><GithubIcon size={16} />GitHub<ArrowUpRight size={14} /></a></div>
  </section>;
}