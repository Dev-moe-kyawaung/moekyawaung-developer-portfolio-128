import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  Home, User, Layers, Box, Cpu, Banknote, Mail, Search, Bot,
  Activity, HardDrive, Gauge, Wifi, BatteryFull,
} from 'lucide-react';
import { useInView, useScrollY } from '../hooks';
import { useRoute, navigate } from '../lib/router';
import { PROFILE } from '../data';

/* ---------------- live clock ---------------- */
export function useNow() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

/* ---------------- scrollspy for the dock ---------------- */
export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const obs = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-38% 0px -55% 0px' },
    );
    ids.forEach((id) => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [ids]);
  return active;
}

/* ============ OS WINDOW — 3D, holographic, depth-reveal ============ */
export function OsWindow({
  title, subtitle, icon, toolbar, actions, children,
  float, floatDur = 7, tilt = false, className = '', bodyClass = '', delay = 0,
}: {
  title: string; subtitle?: string; icon?: ReactNode; toolbar?: string; actions?: ReactNode;
  children: ReactNode; float?: boolean; floatDur?: number; tilt?: boolean;
  className?: string; bodyClass?: string; delay?: number;
}) {
  const { ref, inView } = useInView(0.14);
  const cardRef = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tilt) return;
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(1200px) rotateX(${(-py * 5).toFixed(2)}deg) rotateY(${(px * 6).toFixed(2)}deg) translateY(-4px)`;
  };
  const onLeave = () => {
    if (!tilt || !cardRef.current) return;
    cardRef.current.style.transform = '';
  };

  return (
    <div ref={ref} className={`os-window ${inView ? 'in' : ''} ${className}`} style={{ ['--rd' as string]: `${delay}ms` }}>
      <div className={float ? 'os-float' : ''} style={float ? ({ ['--dur' as string]: `${floatDur}s` }) : undefined}>
        <div className="os-window-holo">
          <div
            ref={cardRef}
            className="os-window-card"
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            style={{ transitionDelay: `${delay}ms` }}
          >
            <div className="os-titlebar">
              <div className="win-dots">
                <span className="win-dot close" /><span className="win-dot min" /><span className="win-dot max" />
              </div>
              <div className="flex min-w-0 items-center gap-2">
                {icon && <span className="text-[var(--ion)]">{icon}</span>}
                <span className="truncate font-orbit text-[12.5px] tracking-tight text-[var(--txt)]">{title}</span>
                {subtitle && <span className="truncate font-mono2 text-[9px] uppercase tracking-[0.14em] text-[var(--faint)]">{subtitle}</span>}
              </div>
              <div className="flex-1" />
              {actions}
            </div>

            {toolbar && (
              <div className="os-toolbar">
                <span className="flex items-center gap-2">
                  <span className="text-[var(--ion)]">⌂</span> mka / {toolbar}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="led" /> online
                </span>
              </div>
            )}

            <div className={bodyClass}>{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============ SYSTEM WIDGETS (floating desktop panels) ============ */
export function SystemWidgets() {
  const now = useNow();
  const time = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const date = now.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short' });
  const y = useScrollY();

  return (
    <>
      {/* clock widget */}
      <div className="pointer-events-none absolute -right-2 top-4 hidden w-[190px] xl:block" style={{ transform: `translateY(${y * -0.03}px)` }}>
        <div className="os-window in">
          <div className="os-window-holo" style={{ opacity: 0.7 }}>
            <div className="os-window-card !rotate-x-0 opacity-100" style={{ transform: 'none' }}>
              <div className="p-4">
                <div className="flex items-center gap-2 text-[var(--stable)]"><Wifi size={12} /><span className="font-mono2 text-[8px] uppercase tracking-[0.18em] text-[var(--faint)]">local time</span></div>
                <div className="mt-2 font-display text-[26px] leading-none tracking-[-0.02em] tabular-nums">{time}</div>
                <div className="mt-1 font-mono2 text-[9px] uppercase tracking-[0.16em] text-[var(--faint)]">{date} · GMT+6:30</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* system stats widget */}
      <div className="pointer-events-none absolute -left-2 bottom-8 hidden w-[200px] xl:block" style={{ transform: `translateY(${y * 0.035}px)` }}>
        <div className="os-window in">
          <div className="os-window-holo" style={{ opacity: 0.7 }}>
            <div className="os-window-card" style={{ transform: 'none' }}>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[var(--ion)]"><Activity size={11} /><span className="font-mono2 text-[8px] uppercase tracking-[0.16em] text-[var(--faint)]">system</span></span>
                  <span className="led" />
                </div>
                <div className="mt-3 space-y-2.5">
                  {[
                    { i: <Cpu size={11} />, k: 'cpu', v: 34, c: 'var(--ion)' },
                    { i: <HardDrive size={11} />, k: 'ram', v: 61, c: 'var(--magenta)' },
                    { i: <BatteryFull size={11} />, k: 'battery', v: 88, c: 'var(--stable)' },
                  ].map((b) => (
                    <div key={b.k} className="flex items-center gap-2">
                      <span className="text-[var(--dim)]">{b.i}</span>
                      <span className="w-14 font-mono2 text-[8px] uppercase tracking-[0.12em] text-[var(--faint)]">{b.k}</span>
                      <div className="gauge-track flex-1"><div className="gauge-fill" style={{ width: `${b.v}%`, background: b.c, boxShadow: `0 0 10px ${b.c}` }} /></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ============ DOCK — magnifying app tray + system bot ============ */
const DOCK: { id: string; label: string; icon: ReactNode }[] = [
  { id: 'home', label: 'Home', icon: <Home size={22} /> },
  { id: 'about', label: 'About', icon: <User size={22} /> },
  { id: 'skills', label: 'Skills', icon: <Layers size={22} /> },
  { id: 'projects', label: 'Projects', icon: <Box size={22} /> },
  { id: 'blueprints', label: 'Blueprints', icon: <Cpu size={22} /> },
  { id: 'pricing', label: 'Pricing', icon: <Banknote size={22} /> },
  { id: 'contact', label: 'Contact', icon: <Mail size={22} /> },
];

export function Dock({ onOpenBot, botActive }: { onOpenBot: () => void; botActive: boolean }) {
  const active = useActiveSection(DOCK.map((d) => d.id));
  const route = useRoute();
  const dockRef = useRef<HTMLDivElement>(null);
  const [mx, setMx] = useState(-9999);

  const onMove = (e: React.MouseEvent) => {
    const r = dockRef.current?.getBoundingClientRect();
    if (r) setMx(e.clientX - r.left);
  };
  const onLeave = () => setMx(-9999);

  const goTo = (id: string) => {
    if (route !== '') { navigate(''); setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 140); return; }
    if (id === 'home') { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const magnify = (id: string) => {
    const dock = dockRef.current;
    const item = dock?.querySelector<HTMLElement>(`[data-x="${id}"]`);
    if (!dock || !item) return 0;
    const dr = dock.getBoundingClientRect();
    const ir = item.getBoundingClientRect();
    const center = ir.left + ir.width / 2 - dr.left;
    const dist = Math.abs(mx - center);
    return Math.max(0, 1 - dist / 110);
  };

  return (
    <div ref={dockRef} className="dock" onMouseMove={onMove} onMouseLeave={onLeave} role="toolbar" aria-label="Application dock">
      {DOCK.map((d) => {
        const boost = magnify(d.id);
        const scale = 1 + boost * 0.5;
        return (
          <button
            key={d.id}
            data-x={d.id}
            onClick={() => goTo(d.id)}
            aria-label={d.label}
            className={`dock-item ${active === d.id ? 'active' : ''}`}
            style={{ transform: `translateY(${-boost * 14}px) scale(${scale})` }}
          >
            <span className="dock-label">{d.label}</span>
            <span className="dock-ic">{d.icon}</span>
          </button>
        );
      })}

      <span className="dock-sep" aria-hidden="true" />

      {/* search */}
      <button onClick={() => { document.dispatchEvent(new CustomEvent('open-palette')); }} aria-label="Search" className="dock-item">
        <span className="dock-label">Search</span>
        <span className="dock-ic"><Search size={22} /></span>
      </button>

      {/* system bot */}
      <button onClick={onOpenBot} aria-label="System assistant" className={`dock-item ${botActive ? 'active' : ''}`}>
        <span className="dock-label">mka · assistant</span>
        <span className="dock-ic relative">
          <Bot size={22} />
          <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-[var(--stable)] ring-2 ring-[var(--panel-solid)]" />
        </span>
      </button>
    </div>
  );
}

/* ============ keep Gauge referenced (used by widgets) ============ */
export const __icons = { Gauge };
void __icons;
void PROFILE;
