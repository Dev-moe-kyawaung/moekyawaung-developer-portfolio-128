import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { SectionLink } from './Header';
import { Scene } from './Scene';

export default function Hero() {
  return <section className="studio-hero" id="home" aria-labelledby="hero-title">
    <Scene />
    <div className="studio-container hero-content">
      <div className="hero-copy">
        <div className="hero-eyebrow"><span className="status-dot" />SENIOR ANDROID DEVELOPER<span className="eyebrow-line" /></div>
        <h1 id="hero-title">MOE<br /><span>KYAW AUNG</span><i className="name-cursor" aria-hidden="true">_</i></h1>
        <p className="hero-statement">Code with culture.<br className="mobile-only" /> Build with purpose.</p>
        <p className="hero-description">I turn complex ideas into secure, high-performance mobile experiences. Kotlin, Jetpack Compose &amp; Flutter.</p>
        <div className="hero-actions">
          <span className="primary-action"><SectionLink id="projects">Explore my work<ArrowUpRight size={18} /></SectionLink></span>
          <span className="secondary-action"><SectionLink id="contact"><span className="circle-arrow"><ArrowUpRight size={14} /></span>Let&apos;s build something</SectionLink></span>
        </div>
      </div>
    </div>
    <div className="hero-bottom studio-container">
      <SectionLink id="projects"><ArrowDown size={14} /><span>SCROLL TO EXPLORE</span></SectionLink>
    </div>
  </section>;
}