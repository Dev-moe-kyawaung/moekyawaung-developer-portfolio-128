import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { useScrollY } from '../hooks';

/* a few soft floating "data motes" for the desktop depth */
const MOTES = [
  { l: '8%', t: '22%', s: 5, c: 'var(--ion)', dur: 16, dx: 26, dy: -34 },
  { l: '82%', t: '18%', s: 4, c: 'var(--magenta)', dur: 19, dx: -22, dy: 28 },
  { l: '18%', t: '68%', s: 6, c: 'var(--ember)', dur: 14, dx: 30, dy: -22 },
  { l: '72%', t: '72%', s: 4, c: 'var(--ion)', dur: 21, dx: -28, dy: -30 },
  { l: '48%', t: '30%', s: 3, c: 'var(--arc)', dur: 17, dx: 18, dy: 26 },
  { l: '60%', t: '82%', s: 5, c: 'var(--amber)', dur: 15, dx: -20, dy: -26 },
  { l: '34%', t: '52%', s: 3, c: 'var(--stable)', dur: 23, dx: 24, dy: 20 },
];

/* ============ BACKGROUND — the 3D desktop ============ */
export function Background() {
  return (
    <div className="chamber" aria-hidden="true">
      <div className="os-floor" />
      <div className="os-horizon" />
      {MOTES.map((m, i) => (
        <span key={i} className="os-mote"
          style={{
            left: m.l, top: m.t, width: m.s, height: m.s,
            background: m.c, boxShadow: `0 0 ${m.s * 3}px ${m.c}`,
            ['--dur' as string]: `${m.dur}s`,
            ['--dx' as string]: `${m.dx}px`,
            ['--dy' as string]: `${m.dy}px`,
          }} />
      ))}
      <div className="plasma-haze" style={{ left: '-6%' }} />
      <div className="plasma-haze" style={{ right: '-8%', background: 'linear-gradient(to bottom, rgba(160,107,255,0.06), transparent 58%)' }} />
    </div>
  );
}

/* ============ PRELOADER — OS boot log ============ */
const BOOT_LINES = [
  'mka-os 3.1 — secure boot',
  'init kernel · k8-android',
  'loading module: kotlin.runtime … ok',
  'loading module: jetpack.compose … ok',
  'loading module: clean.architecture … ok',
  'linking firebase relay … ok',
  'calibrating holographic ui … done',
];

export function Preloader({ onDone }: { onDone: () => void }) {
  const [line, setLine] = useState(0);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setLine(BOOT_LINES.length);
      setTimeout(() => { setGone(true); setTimeout(onDone, 300); }, 400);
      return;
    }
    const id = setInterval(() => {
      setLine((l) => {
        if (l >= BOOT_LINES.length) {
          clearInterval(id);
          setTimeout(() => { setGone(true); setTimeout(onDone, 500); }, 420);
          return l;
        }
        return l + 1;
      });
    }, 175);
    return () => clearInterval(id);
  }, [onDone]);

  const pct = Math.round((line / BOOT_LINES.length) * 100);

  return (
    <div className={`preloader ${gone ? 'done' : ''}`} aria-hidden={gone}>
      <div className="chamber"><div className="os-floor" /><div className="os-horizon" /></div>

      <div className="relative w-[min(440px,88vw)]">
        <div className="os-window in">
          <div className="os-window-holo">
            <div className="os-window-card !translate-y-0 !opacity-100 !scale-100">
              <div className="os-titlebar">
                <div className="win-dots">
                  <span className="win-dot close" /><span className="win-dot min" /><span className="win-dot max" />
                </div>
                <span className="font-mono2 text-[10px] tracking-[0.16em] text-[var(--faint)] uppercase">boot.log — mka-os</span>
                <div className="flex-1" />
              </div>
              <div className="term p-5">
                {BOOT_LINES.slice(0, line).map((l) => (
                  <div key={l} className="flex items-center gap-2 text-[11.5px] leading-[1.9]">
                    <span className="text-[var(--stable)]">▸</span>
                    <span className={l.includes('ok') || l.includes('done') ? 'text-[var(--txt-soft)]' : 'text-[var(--dim)]'}>{l}</span>
                  </div>
                ))}
                <div className="mt-3 flex items-center gap-2">
                  <div className="gauge-track flex-1"><div className="gauge-fill" style={{ width: `${pct}%`, transition: 'width 200ms ease' }} /></div>
                  <span className="font-mono2 text-[11px] text-[var(--ion)] tabular-nums">{pct}%</span>
                </div>
                <div className="mt-3 font-mono2 text-[10px] text-[var(--faint)] tracking-[0.1em]">
                  {line >= BOOT_LINES.length ? 'welcome, engineer.' : 'initializing'}<span className="type-caret" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============ CURSOR ============ */
export function Cursor() { return null; }

/* ============ TILT (API compat) ============ */
export function Tilt({ children, className = '' }: { children: React.ReactNode; className?: string; max?: number }) {
  return <div className={className}>{children}</div>;
}

/* ============ BACK TO TOP ============ */
export function BackToTop() {
  const y = useScrollY();
  const show = y > 460;
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      className={`fixed bottom-24 right-6 z-40 hidden md:flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--line-strong)] bg-[var(--panel)] text-[var(--ion)] backdrop-blur-md transition-all duration-500 hover:border-[var(--ion)] hover:shadow-[var(--glow-ion)] ${show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'}`}
    >
      <ArrowUp size={17} />
    </button>
  );
}

/* ============ STICKY CTA (dock carries the CTA now) ============ */
export function StickyCta() { return null; }
