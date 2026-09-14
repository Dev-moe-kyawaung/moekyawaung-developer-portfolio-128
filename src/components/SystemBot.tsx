import { useEffect, useRef, useState } from 'react';
import { Bot, Send, Terminal, Cpu } from 'lucide-react';
import { PROFILE } from '../data';
import { useNow } from './OsChrome';

type Role = 'user' | 'sys';
interface Line { id: string; role: Role; text: string; header?: boolean; }

const STATS: [string, string][] = [
  ['uptime', '12 years · continuous'],
  ['deployments', '3,000+ production'],
  ['repositories', '600+ on GitHub'],
  ['crash-free', '99.9% sessions'],
  ['cold start', '1.40s (refit)'],
  ['targets', 'android · ios · desktop · wasm'],
  ['stack', 'kotlin · compose · flutter · firebase'],
];

const HELP = [
  'available commands',
  '  help                 this message',
  '  stats                system + record telemetry',
  '  open <section>       jump: about, skills, projects,',
  '                       blueprints, pricing, contact',
  '  theme light|dark     switch the OS theme',
  '  time                 local time (GMT+6:30)',
  '  about                who is behind the OS',
  '  contact              how to reach the engineer',
  '  clear                wipe the terminal',
  '',
  '…or just ask. I can walk through any engineering',
  'decision: architecture, offline sync, performance.',
].join('\n');

const ABOUT = `Moe Kyaw Aung (မိုးကျော်အောင်) — Senior Android / Flutter engineer.
12 years shipping mobile systems: Kotlin, Jetpack Compose,
Flutter, clean architecture, Firebase, on-device AI.
Based Tachileik, Myanmar ↔ Bangkok, Thailand · GMT+6:30.`;

const CONTACT = `channels are open:
  phone   ${PROFILE.phones[0]}
  email   ${PROFILE.primaryEmail}
  github  ${PROFILE.githubMain}
Response within 24h on business days. Use "open contact"
to jump straight to the form.`;

const qa = (q: string): string => {
  const s = q.toLowerCase();
  if (/(clean|architect|module|boundary|mvvm|mvi)/.test(s))
    return 'Architecture: domain is pure Kotlin with zero platform imports — enforced by a build rule that fails the PR on an Android import. Data owns sources behind repository contracts; UI is a pure function of immutable state. Result: 1,204 core tests run in ~380ms, and new engineers ship in week two.';
  if (/(offline|sync|room|sqlite|local)/.test(s))
    return 'Offline-first: the local database is the source of truth, the network is a sync mechanism. Mutations queue as idempotent ops with a client UUID; on reconnect they replay safely. Conflict merge is field-level last-write-wins with a server arbiter. Field result: 97% of work completes fully offline, zero data loss.';
  if (/(compose|ui|recompose|jetpack|material)/.test(s))
    return 'Compose: declarative UI as a pure function of state. Stable models + keyed lazy lists + deferred reads keep recomposition microscopic. Measured: scroll drops from 41 to 3 on a 2GB device; the UI layer never reaches into the data layer.';
  if (/(flutter|dart|kmp|cross.?platform|kmm)/.test(s))
    return 'Cross-platform: ~92% of the codebase is shared Kotlin/Flutter. Anything touching payments, biometrics, camera or OS policy stays a native escort behind one typed channel per feature. Flutter for product flows; native where the platform owns the contract.';
  if (/(performance|speed|fps|latency|battery|startup|cold)/.test(s))
    return 'Performance: baseline profiles kill JIT stutter (3.10s → 1.40s cold start). LeakCanary in every build → zero production leaks. Battery 11% → 4%/hr via batched sync windows. Everything measured on a 2019 mid-ranger, not a flagship in drydock.';
  if (/(ai|ml|genai|litert|tflite|model|on.?device)/.test(s))
    return 'On-device AI: LiteRT-LM on the handset — 96ms first token under a 150MB ceiling. ML Kit for captioning (<180ms). Cloud is an explicit, consented fallback, never silent egress. A 240-prompt nightly eval gates every release.';
  if (/(secur|passkey|biometric|auth|keystore|zero.?trust)/.test(s))
    return 'Security: passkeys with hardware-bound keys (Keystore / Secure Enclave), zero shared secrets on the server, single-use nonces, continuous behavioral auth. The degradation ladder ends in read-only containment — never a password.';
  if (/(ci|cd|pipeline|release|fastlane|deploy)/.test(s))
    return 'Delivery: GitHub Actions + Fastlane fan-out to four targets, 4m12s median PR cycle. API-surface dump and dependency-guard gates run first, so an architecture violation costs 8 seconds, not a review round-trip. Staged rollout with auto-halt.';
  return `I can trace any of these: architecture, offline sync, Compose, Flutter, performance, on-device AI, security, or delivery. Ask about one — or type "stats" for the full record.`;
};

let seq = 0;
const id = () => `${Date.now()}-${seq++}`;

export function SystemBot({ open, onClose, setTheme }: {
  open: boolean; onClose: () => void; setTheme: (t: 'dark' | 'light') => void;
}) {
  const now = useNow();
  const [lines, setLines] = useState<Line[]>([{
    id: 'boot', role: 'sys', header: true,
    text: `mka-os · system assistant v1.4 — root shell ready.\nType "help" for commands, or ask about the engineering.`,
  }]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) { setLines([{ id: id(), role: 'sys', header: true, text: `mka-os · system assistant v1.4 — root shell ready.\nType "help" for commands, or ask about the engineering.` }]); setTimeout(() => inputRef.current?.focus(), 120); }
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [lines, busy]);

  if (!open) return null;

  const push = (role: Role, text: string, header = false) => setLines((l) => [...l.slice(-40), { id: id(), role, text, header }]);

  const go = (section: string) => {
    const el = document.getElementById(section);
    if (el && readRoute() === '') { el.scrollIntoView({ behavior: 'smooth' }); return; }
    push('sys', `→ opening "${section}"`);
  };

  const run = (raw: string) => {
    const text = raw.trim();
    if (!text) return;
    push('user', text);
    setInput('');
    setBusy(true);

    const cmd = text.toLowerCase();
    let out = '';
    let themeApplied = false;

    if (cmd === 'clear') {
      setLines([{ id: id(), role: 'sys', text: 'terminal cleared.' }]);
      setBusy(false);
      return;
    } else if (cmd === 'help') {
      out = HELP;
    } else if (cmd === 'stats') {
      out = 'system telemetry\n' + STATS.map(([k, v]) => `  ${k.padEnd(13)} ${v}`).join('\n');
    } else if (cmd.startsWith('open')) {
      const target = cmd.replace('open', '').trim();
      if (['about', 'skills', 'projects', 'blueprints', 'pricing', 'contact'].includes(target)) { go(target); out = `→ routing to ${target}.desktop`; }
      else out = `unknown window: ${target}\ntry: open about | skills | projects | blueprints | pricing | contact`;
    } else if (cmd.startsWith('theme')) {
      const want = cmd.includes('light') ? 'light' : 'dark';
      setTheme(want); themeApplied = true;
      out = `theme → ${want}. the whole OS re-rendered.`;
    } else if (cmd === 'time') {
      out = `local time  ${now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}  · GMT+6:30`;
    } else if (cmd === 'about') {
      out = ABOUT;
    } else if (cmd === 'contact') {
      out = CONTACT;
    } else {
      out = qa(text);
    }

    setTimeout(() => { push('sys', out); setBusy(false); }, themeApplied ? 120 : 420);
  };

  const chips = ['help', 'stats', 'open projects', 'theme dark', 'about', 'contact'];

  return (
    <div className="fixed bottom-24 right-3 z-[70] w-[min(400px,94vw)] sm:right-6" style={{ perspective: '1500px' }} role="dialog" aria-label="System assistant terminal">
      <div className="os-window in os-max-enter">
        <div className="os-window-holo">
          <div className="os-window-card" style={{ transform: 'none' }}>
            <div className="os-titlebar">
              <div className="win-dots">
                <button onClick={onClose} aria-label="Close assistant" className="win-dot close cursor-pointer" />
                <span className="win-dot min" /><span className="win-dot max" />
              </div>
              <div className="flex min-w-0 items-center gap-2">
                <Bot size={14} className="text-[var(--ion)]" />
                <span className="truncate font-orbit text-[12.5px] text-[var(--txt)]">mka.ai — system assistant</span>
              </div>
              <div className="flex-1" />
              <span className="flex items-center gap-1.5 font-mono2 text-[8.5px] uppercase tracking-[0.14em] text-[var(--stable)]">
                <span className="led" /> online
              </span>
            </div>

            {/* terminal transcript */}
            <div ref={scrollRef} className="term term-scroll max-h-[340px] min-h-[220px] overflow-y-auto bg-[rgba(4,7,13,0.6)] p-4">
              {lines.map((l) => (
                <div key={l.id} className="mb-2.5">
                  {l.role === 'user' ? (
                    <div className="flex gap-2">
                      <span className="text-[var(--ion)]">$</span>
                      <span className="text-[var(--txt)]">{l.text}</span>
                    </div>
                  ) : (
                    <pre className={`whitespace-pre-wrap font-mono2 text-[11px] leading-[1.7] ${l.header ? 'text-[var(--ion)]' : 'text-[var(--dim)]'}`}>
                      {l.header && <span className="mb-1 block text-[var(--magenta)]">▍mka@os ~</span>}
                      {l.text}
                    </pre>
                  )}
                </div>
              ))}
              {busy && (
                <div className="flex items-center gap-2 text-[var(--faint)]">
                  <Cpu size={12} className="animate-pulse" /><span className="font-mono2 text-[10px]">processing…</span>
                </div>
              )}
            </div>

            {/* quick commands */}
            <div className="flex flex-wrap gap-1.5 border-t border-[var(--line-faint)] px-3 py-2.5">
              {chips.map((c) => (
                <button key={c} onClick={() => run(c)}
                  className="rounded border border-[var(--line)] bg-[var(--panel-soft)] px-2.5 py-1 font-mono2 text-[9.5px] text-[var(--dim)] transition-colors hover:border-[var(--ion)] hover:text-[var(--ion)]">
                  {c}
                </button>
              ))}
            </div>

            {/* prompt */}
            <div className="flex items-center gap-2 border-t border-[var(--line-faint)] bg-[var(--bg-2)] p-3">
              <Terminal size={14} className="text-[var(--ion)]" />
              <span className="font-mono2 text-[11px] text-[var(--faint)]">root@os:~$</span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && run(input)}
                placeholder="type a command or a question…"
                aria-label="System assistant input"
                className="flex-1 bg-transparent font-mono2 text-[12px] text-[var(--txt)] placeholder:text-[var(--faint)] focus:outline-none"
              />
              <button onClick={() => run(input)} aria-label="Run" className="win-btn !w-9 !h-9"><Send size={15} className="text-[var(--ion)]" /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function readRoute() {
  return window.location.hash.replace(/^#\/?/, '').split('?')[0].replace(/\/+$/, '');
}
