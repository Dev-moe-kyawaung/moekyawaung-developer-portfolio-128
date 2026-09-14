import { useEffect, useId, useRef } from 'react';
import { useStudio } from './context';

/** One bounded canvas, visible only while the hero is on screen. */
function EnergyParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { mode, paused, reducedMotion } = useStudio();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    let width = 1, height = 1, frame = 0, last = 0;
    let inView = true;
    const particles = Array.from({ length: 42 }, (_, i) => ({
      phase: (i * 2.39996) % (Math.PI * 2),
      distance: 0.12 + ((i * 17) % 43) / 70,
      rate: 0.07 + (i % 5) * 0.014,
      size: 0.7 + (i % 3) * 0.5,
    }));

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width; height = rect.height;
      const dpr = Math.min(devicePixelRatio || 1, 1.75);
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (paused || reducedMotion) draw(0);
    };

    const draw = (now: number) => {
      const delta = Math.min((now - last) / 1000 || 0, 0.04);
      last = now;
      ctx.clearRect(0, 0, width, height);
      // Match the full-bleed image's object-fit: cover coordinate system.
      const scale = Math.max(width / 1568, height / 880);
      const cx = (width - 1568 * scale) / 2 + 1040 * scale;
      const cy = (height - 880 * scale) / 2 + 410 * scale;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (!paused && !reducedMotion) p.phase += delta * p.rate;
        const radius = p.distance * Math.min(width, height);
        const angle = p.phase;
        const x = cx + Math.cos(angle) * radius * 1.2;
        const y = cy + Math.sin(angle) * radius * 0.82;
        const color = mode === 'plasma' ? (i % 3 ? '191,104,255' : '105,226,255') : '255,117,175';
        ctx.strokeStyle = `rgba(${color},0.22)`;
        ctx.lineWidth = p.size * 0.6;
        ctx.beginPath();
        ctx.moveTo(x - Math.sin(angle) * 6, y + Math.cos(angle) * 6);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.fillStyle = `rgba(${color},0.6)`;
        ctx.beginPath(); ctx.arc(x, y, p.size, 0, Math.PI * 2); ctx.fill();
      }
      if (inView && !document.hidden && !paused && !reducedMotion) frame = requestAnimationFrame(draw);
    };

    const restart = () => {
      cancelAnimationFrame(frame); last = performance.now();
      if (inView && !document.hidden) frame = requestAnimationFrame(draw);
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; restart(); }, { threshold: 0 });
    observer.observe(canvas);
    document.addEventListener('visibilitychange', restart);
    resize(); restart();
    return () => {
      cancelAnimationFrame(frame); observer.disconnect(); resizeObserver.disconnect();
      document.removeEventListener('visibilitychange', restart);
    };
  }, [mode, paused, reducedMotion]);
  return <canvas ref={canvasRef} className="hero-particles" aria-hidden="true" />;
}

export function Scene() {
  const { mode, paused, reducedMotion } = useStudio();
  const id = useId().replace(/:/g, '');
  const moving = !paused && !reducedMotion;
  return <div className="energy-scene" aria-hidden="true">
    <img className={`scene-image plasma-image ${mode === 'plasma' ? 'is-active' : ''}`} src="/images/plasma-reactor.jpg" alt="" fetchPriority="high" />
    <img className={`scene-image synthwave-image ${mode === 'synthwave' ? 'is-active' : ''}`} src="/images/synthwave-horizon.jpg" alt="" />
    <svg className={`scene-energy ${mode === 'plasma' ? 'is-active' : ''}`} viewBox="0 0 1568 880" preserveAspectRatio="xMidYMid slice">
      <defs>
        <filter id={`${id}-heat`} x="-30%" y="-30%" width="160%" height="160%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.025" numOctaves="1" seed="12" result="noise">
            {moving && <animate attributeName="baseFrequency" dur="12s" values="0.012 0.025;0.018 0.031;0.012 0.025" repeatCount="indefinite" />}
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={moving ? 7 : 0} />
        </filter>
        <radialGradient id={`${id}-glow`}><stop offset="0" stopColor="#edd5ff" stopOpacity="0.85" /><stop offset="0.24" stopColor="#c06fff" stopOpacity="0.4" /><stop offset="1" stopColor="#b92dff" stopOpacity="0" /></radialGradient>
      </defs>
      <g transform="translate(1034 410)">
        <circle r="106" fill={`url(#${id}-glow)`} className="energy-breathe" />
        <g transform="rotate(24)" filter={`url(#${id}-heat)`}>
          <ellipse rx="138" ry="185" fill="none" stroke="#d36cff" strokeWidth="1.5" opacity="0.4" />
          <g className="energy-orbit">
            <circle r="124" fill="none" stroke="#e783ff" strokeWidth="1.4" strokeDasharray="70 190 6 160" opacity="0.62" />
            <circle cx="124" cy="0" r="2.5" fill="#f8cfff" />
          </g>
          <g className="energy-orbit reverse">
            <circle r="64" fill="none" stroke="#84dfff" strokeWidth="1" strokeDasharray="36 82" opacity="0.4" />
            <circle cx="64" r="2" fill="#c9eaff" />
          </g>
        </g>
      </g>
    </svg>
    <div className="synthwave-grid" />
    <EnergyParticles />
    <div className="scene-grade" />
    <div className="retro-scanlines" />
  </div>;
}