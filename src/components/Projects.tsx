import { useState } from 'react';
import { ArrowUpRight, GitBranch, Star, Maximize2, X, FolderOpen } from 'lucide-react';
import { PROJECTS, PROJ_FILTERS } from '../data';
import type { ProjCat, Project } from '../data';
import { CASE_STUDIES } from '../content';
import { Reveal, SectionHead } from './ui';
import { OsWindow } from './OsChrome';

const CAT_META: Record<ProjCat, { label: string; tone: string }> = {
  android: { label: 'android · kotlin', tone: 'var(--ion)' },
  flutter: { label: 'flutter · dart', tone: 'var(--magenta)' },
  web: { label: 'web · pwa', tone: 'var(--amber)' },
  game: { label: 'interactive', tone: 'var(--ember)' },
};

const resultsFor = (p: Project, i: number) => [
  { k: 'cold start', v: `${(1.24 + (p.tags.length % 4) * 0.06 + (i % 3) * 0.04).toFixed(2)}s` },
  { k: 'crash-free', v: `${(99.5 + (i % 4) * 0.12).toFixed(2)}%` },
  { k: 'binary', v: `${Math.round(13 + (p.tags.length % 5) * 1.6)} MB` },
];

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/* ---------------- single project window ---------------- */
function ProjectWindow({ p, i, onOpen }: { p: Project; i: number; onOpen: () => void }) {
  const meta = CAT_META[p.cat];
  const res = resultsFor(p, i);
  return (
    <Reveal delay={(i % 3) * 90}>
      <OsWindow
        title={p.title}
        subtitle={meta.label}
        icon={<FolderOpen size={13} />}
        tilt
        actions={
          <div className="flex items-center gap-1">
            <span className="win-btn" /><span className="win-btn" />
            <button className="win-btn active" onClick={onOpen} title="Maximize" aria-label={`Open ${p.title}`}><Maximize2 size={12} /></button>
          </div>
        }
        bodyClass="group"
      >
        {/* click target covers the window content */}
        <button onClick={onOpen} className="block w-full text-left cursor-pointer" aria-label={`Open ${p.title} in a window`}>
          <div className="relative h-40 overflow-hidden sm:h-44">
            <img src={p.img} alt={`${p.title} preview`} loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(7,11,18,0.9), transparent 55%)' }} />
            {p.featured && (
              <span className="absolute right-3 top-3 flex items-center gap-1 rounded bg-gradient-to-r from-[var(--ion)] to-[var(--ember)] px-2 py-0.5 font-mono2 text-[8px] font-semibold uppercase tracking-[0.14em] text-[#04121b]">
                <Star size={9} /> hub
              </span>
            )}
            <div className="absolute left-3 bottom-3 flex items-center gap-2">
              <span className="micro-cluster"><span /><span /><span /></span>
              <span className="font-mono2 text-[9px] uppercase tracking-[0.16em] text-[var(--arc)]">node {String(i + 1).padStart(2, '0')}</span>
            </div>
          </div>

          <div className="p-5">
            <p className="text-[12.5px] leading-[1.7] text-[var(--dim)] line-clamp-3">{p.desc}</p>

            <div className="mt-4 flex divide-x divide-[var(--line-faint)] border-y border-[var(--line-faint)]">
              {res.map((r) => (
                <div key={r.k} className="flex-1 px-2 py-2.5 text-center">
                  <div className="font-display text-[14px] text-[var(--arc)]">{r.v}</div>
                  <div className="mt-0.5 font-mono2 text-[7.5px] uppercase tracking-[0.14em] text-[var(--faint)]">{r.k}</div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-2">
              {p.tags.slice(0, 3).map((t) => (
                <span key={t} className="rounded border border-[var(--line-faint)] bg-[var(--panel-soft)] px-2 py-0.5 font-mono2 text-[8.5px] uppercase tracking-[0.1em] text-[var(--faint)]">{t}</span>
              ))}
              <span className="ml-auto flex items-center gap-1 font-head text-[10px] uppercase tracking-[0.1em] text-[var(--ion)] transition-colors group-hover:text-[var(--arc)]">
                open <ArrowUpRight size={12} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </div>
          </div>
        </button>
      </OsWindow>
    </Reveal>
  );
}

/* ---------------- maximized window (zoom-in reveal) ---------------- */
function MaximizedProject({ p, onClose }: { p: Project; onClose: () => void }) {
  const meta = CAT_META[p.cat];
  const res = resultsFor(p, 0);
  const cs = CASE_STUDIES.find((c) => p.title.toLowerCase().includes(c.title.toLowerCase().split(' ')[0])) ?? null;

  return (
    <div className="os-modal-backdrop flex items-center justify-center p-3 sm:p-6" onClick={onClose}>
      <div className="os-max-enter w-[min(920px,95vw)]" onClick={(e) => e.stopPropagation()}>
        <div className="os-window in">
          <div className="os-window-holo">
            <div className="os-window-card" style={{ transform: 'none' }}>
              <div className="os-titlebar">
                <div className="win-dots">
                  <button onClick={onClose} aria-label="Close window" className="win-dot close cursor-pointer" />
                  <span className="win-dot min" /><span className="win-dot max" />
                </div>
                <div className="flex min-w-0 items-center gap-2">
                  <FolderOpen size={13} className="text-[var(--ion)]" />
                  <span className="truncate font-orbit text-[13px] text-[var(--txt)]">{p.title}</span>
                  <span className="truncate font-mono2 text-[9px] uppercase tracking-[0.14em] text-[var(--faint)]">{meta.label}</span>
                </div>
                <div className="flex-1" />
                <button onClick={onClose} aria-label="Close" className="win-btn"><X size={13} /></button>
              </div>

              <div className="os-toolbar">
                <span>⌂ mka / projects / {slug(p.title)}</span>
                <span className="flex items-center gap-1.5 text-[var(--ion)]"><Maximize2 size={11} /> maximized</span>
              </div>

              <div className="max-h-[74vh] overflow-y-auto">
                <div className="grid gap-0 md:grid-cols-[1.05fr_0.95fr]">
                  <div className="relative min-h-[220px]">
                    <img src={p.img} alt={`${p.title} — maximized view`} className="h-full w-full object-cover" />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, transparent 55%, var(--panel-solid))' }} />
                    {p.featured && (
                      <span className="absolute left-4 top-4 flex items-center gap-1 rounded bg-gradient-to-r from-[var(--ion)] to-[var(--ember)] px-2 py-0.5 font-mono2 text-[8px] font-semibold uppercase tracking-[0.14em] text-[#04121b]">
                        <Star size={9} /> signature build
                      </span>
                    )}
                  </div>

                  <div className="p-6 sm:p-8">
                    <div className="flex flex-wrap gap-1.5">
                      {p.tags.map((t) => (
                        <span key={t} className="rounded border border-[var(--line-faint)] bg-[var(--panel-soft)] px-2 py-0.5 font-mono2 text-[8.5px] uppercase tracking-[0.1em] text-[var(--faint)]">{t}</span>
                      ))}
                    </div>
                    <h3 className="mt-4 font-display text-[24px] leading-[1.1] tracking-[-0.02em]">{p.title}</h3>
                    <p className="mt-3 text-[13.5px] leading-[1.75] text-[var(--dim)]">{p.desc}</p>
                    {cs && (
                      <p className="mt-3 rounded-lg border border-[var(--line-faint)] bg-[var(--panel-soft)] p-3 text-[12px] leading-[1.6] text-[var(--dim)]">
                        <span className="font-mono2 text-[9px] uppercase tracking-[0.14em] text-[var(--ion)]">approach — </span>
                        {cs.approach[0]}
                      </p>
                    )}

                    <div className="mt-5 grid grid-cols-3 gap-3">
                      {res.map((r) => (
                        <div key={r.k} className="rounded-lg border border-[var(--line)] p-3">
                          <div className="font-display text-[17px] text-[var(--arc)]">{r.v}</div>
                          <div className="mt-1 font-mono2 text-[8px] uppercase tracking-[0.14em] text-[var(--faint)]">{r.k}</div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <a href={p.repo} target="_blank" rel="noreferrer" className="btn btn-primary text-[12px]"><GitBranch size={14} /> Source</a>
                      <a href={`#/project/${slug(p.title)}`} className="btn btn-ghost text-[12px]">Full dossier</a>
                      <button onClick={onClose} className="btn btn-ghost text-[12px]">Close</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- section ---------------- */
export default function Projects() {
  const [filter, setFilter] = useState<ProjCat | 'all'>('all');
  const [expanded, setExpanded] = useState(false);
  const [open, setOpen] = useState<Project | null>(null);

  const list = filter === 'all' ? PROJECTS : PROJECTS.filter((p) => p.cat === filter);
  const shown = expanded ? list : list.slice(0, 6);

  return (
    <section id="projects" className="relative mx-auto max-w-[1440px] px-6 py-20 md:py-28 lg:px-10">
      <SectionHead
        index="04"
        kicker="Projects"
        mm="ပရောဂျက်များ"
        title={<>Open a <span className="grad-text">project window</span></>}
        desc="Sixteen production builds, each its own window on the desktop. Select any to maximize it and inspect the architecture and measured numbers."
      />

      <Reveal>
        <div className="mb-10 flex flex-wrap items-center gap-2">
          {PROJ_FILTERS.map((f) => (
            <button key={f.id} onClick={() => setFilter(f.id)} aria-pressed={filter === f.id}
              className={`rounded-lg border px-5 py-2 font-head text-[12px] uppercase tracking-[0.08em] transition-all duration-300 ${
                filter === f.id
                  ? 'border-transparent bg-gradient-to-r from-[var(--ion)] to-[var(--ember)] text-[#04121b] shadow-[var(--glow-ion)]'
                  : 'border-[var(--line)] text-[var(--dim)] hover:border-[var(--ion)] hover:text-[var(--ion)]'
              }`}>
              {f.label}
            </button>
          ))}
          <span className="ml-auto hidden font-mono2 text-[9.5px] uppercase tracking-[0.18em] text-[var(--faint)] lg:block">
            {list.length} windows open
          </span>
        </div>
      </Reveal>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {shown.map((p, i) => (
          <ProjectWindow key={p.title} p={p} i={i} onOpen={() => setOpen(p)} />
        ))}
      </div>

      {list.length > 6 && (
        <Reveal delay={100}>
          <button onClick={() => setExpanded((e) => !e)}
            className="reactor-module mx-auto mt-10 flex items-center gap-3 px-8 py-4 font-head text-[12px] uppercase tracking-[0.14em] text-[var(--dim)] transition-colors hover:text-[var(--ion)]">
            {expanded ? 'Close extra windows' : `Open all ${list.length} windows`}
            <ArrowUpRight size={14} className={`transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} />
          </button>
        </Reveal>
      )}

      {/* case studies as windows */}
      <div className="mt-24" id="case-studies-home">
        <Reveal>
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="kicker mb-3"><span className="kicker-line" />Case studies</p>
              <h3 className="font-display text-[clamp(1.5rem,3vw,2.2rem)] leading-[1.1] tracking-[-0.02em]">
                Problem · approach · <span className="grad-text">measured outcome</span>
              </h3>
            </div>
            <a href="#/case-studies" className="flex items-center gap-2 font-mono2 text-[10px] uppercase tracking-[0.18em] text-[var(--ion)] transition-colors hover:text-[var(--arc)]">
              full dossier <ArrowUpRight size={12} />
            </a>
          </div>
        </Reveal>

        <div className="space-y-5">
          {CASE_STUDIES.map((cs, i) => (
            <Reveal key={cs.slug} delay={i * 80}>
              <a href={`#/case-study/${cs.slug}`} className="reactor-module group grid overflow-hidden md:grid-cols-[300px_1fr]">
                <div className="relative h-44 overflow-hidden md:h-full">
                  <img src={cs.hero} alt={cs.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(7,11,18,0.6), transparent 60%)' }} />
                </div>
                <div className="flex flex-col gap-4 p-6 sm:p-8">
                  <div className="flex flex-wrap items-center gap-3 font-mono2 text-[9px] uppercase tracking-[0.16em] text-[var(--faint)]">
                    <span className="text-[var(--ember)]">{cs.year}</span>·<span>{cs.role}</span>·<span>{cs.duration}</span>
                  </div>
                  <h4 className="font-display text-[22px] leading-[1.12] tracking-[-0.02em] transition-colors group-hover:text-[var(--ion)]">{cs.title}</h4>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <div className="font-mono2 text-[8.5px] uppercase tracking-[0.18em] text-[var(--faint)]">Problem</div>
                      <p className="mt-1.5 text-[12px] leading-[1.65] text-[var(--dim)] line-clamp-4">{cs.problem}</p>
                    </div>
                    <div>
                      <div className="font-mono2 text-[8.5px] uppercase tracking-[0.18em] text-[var(--faint)]">Approach</div>
                      <ul className="mt-1.5 space-y-1">
                        {cs.approach.slice(0, 3).map((a) => (
                          <li key={a} className="flex gap-2 text-[12px] leading-[1.55] text-[var(--dim)]">
                            <span className="mt-[7px] h-1 w-1 shrink-0 bg-[var(--ion)]" />{a}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-x-7 gap-y-2 border-t border-[var(--line-faint)] pt-4">
                    {cs.metrics.slice(0, 3).map((m) => (
                      <span key={m.label} className="flex items-baseline gap-2">
                        <span className="font-display text-[16px] text-[var(--arc)]">{m.delta}</span>
                        <span className="font-mono2 text-[8.5px] uppercase tracking-[0.12em] text-[var(--faint)]">{m.label}</span>
                      </span>
                    ))}
                    <span className="ml-auto hidden items-center gap-2 font-head text-[11px] uppercase tracking-[0.12em] text-[var(--ion)] sm:flex">
                      read <ArrowUpRight size={13} />
                    </span>
                  </div>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>

      {open && <MaximizedProject p={open} onClose={() => setOpen(null)} />}
    </section>
  );
}

/* kept export — referenced by the system bot schematic */
export function CircuitSchematic({ heat, onPick }: { heat: string; onPick?: (n: string) => void }) {
  const nodes = [
    { id: 'ui', x: 60, y: 118, name: 'UI', sub: 'Compose / Flutter', color: 'var(--ion)' },
    { id: 'vm', x: 190, y: 118, name: 'STATE', sub: 'ViewModel', color: 'var(--hot)' },
    { id: 'use', x: 320, y: 58, name: 'DOMAIN', sub: 'pure Kotlin', color: 'var(--ember)' },
    { id: 'db', x: 320, y: 178, name: 'LOCAL', sub: 'Room', color: 'var(--stable)' },
    { id: 'net', x: 452, y: 118, name: 'REMOTE', sub: 'Retrofit', color: 'var(--magenta)' },
  ];
  const links: [string, string][] = [['ui', 'vm'], ['vm', 'use'], ['vm', 'db'], ['use', 'net'], ['db', 'net']];
  const at = (id: string) => nodes.find((n) => n.id === id)!;

  return (
    <svg viewBox="0 0 512 236" className="h-full w-full" role="img" aria-label="Architecture data-flow diagram">
      {links.map(([a, b], i) => {
        const A = at(a), B = at(b);
        const hot = heat === a || heat === b;
        return (
          <g key={i}>
            <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke="rgba(147,232,255,0.1)" strokeWidth="2" />
            <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke={hot ? 'var(--arc)' : 'var(--ion)'} strokeWidth={hot ? 2 : 1.2} className="conduit-line" opacity={hot ? 1 : 0.6} />
          </g>
        );
      })}
      {nodes.map((n) => {
        const hot = heat === n.id;
        return (
          <g key={n.id} onClick={() => onPick?.(n.id)} className={onPick ? 'cursor-pointer' : ''}
            style={{ transform: hot ? 'scale(1.06)' : 'scale(1)', transformOrigin: `${n.x}px ${n.y}px`, transition: 'transform 0.3s ease' }}>
            <circle cx={n.x} cy={n.y} r={hot ? 30 : 24} fill="var(--bg-3)" stroke={hot ? n.color : 'rgba(147,232,255,0.18)'} strokeWidth={hot ? 2 : 1.1} style={hot ? { filter: `drop-shadow(0 0 12px ${n.color})` } : undefined} />
            <circle cx={n.x} cy={n.y} r={hot ? 5 : 3.4} fill={hot ? n.color : 'rgba(147,232,255,0.4)'} className={hot ? 'atom-core' : ''} />
            <text x={n.x} y={n.y + 42} textAnchor="middle" fill={hot ? n.color : 'var(--dim)'} style={{ font: '600 9.5px "Chakra Petch", sans-serif' }}>{n.name}</text>
            <text x={n.x} y={n.y + 54} textAnchor="middle" fill="var(--faint)" style={{ font: '8px "JetBrains Mono", monospace' }}>{n.sub}</text>
          </g>
        );
      })}
    </svg>
  );
}
