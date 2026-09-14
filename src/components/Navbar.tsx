import { useEffect, useState } from 'react';
import { Menu, X, Sun, Moon, Search, Wifi, BatteryFull, Radio } from 'lucide-react';
import { NAV_LINKS, I18N } from '../data';
import type { Lang } from '../data';
import { NAV_GROUPS } from '../content';
import { useScrollY, useLang } from '../hooks';
import { Link, useRoute } from '../lib/router';
import { useNow } from './OsChrome';

interface Props {
  theme: 'dark' | 'light';
  setTheme: (t: 'dark' | 'light') => void;
  setLang: (l: Lang) => void;
}

export default function Navbar({ theme, setTheme, setLang }: Props) {
  const y = useScrollY();
  const lang = useLang();
  const route = useRoute();
  const t = I18N[lang];
  const now = useNow();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('home');

  useEffect(() => {
    if (route !== '') return;
    const obs = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-38% 0px -55% 0px' },
    );
    NAV_LINKS.forEach((l) => { const el = document.getElementById(l.id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [route]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const time = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const date = now.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short' });
  const home = route === '';

  return (
    <>
      <header className={`nav-shell fixed top-0 inset-x-0 z-50 ${y > 40 ? 'scrolled' : ''}`}>
        <nav className="mx-auto flex h-[54px] max-w-[1600px] items-center gap-4 px-4 lg:px-8">
          {/* logo / app name */}
          <Link to="" className="flex items-center gap-2.5 shrink-0" ariaLabel="mka-os home">
            <span className="relative flex h-7 w-7 items-center justify-center rounded-md border border-[var(--line-strong)] bg-[var(--bg-2)]">
              <span className="font-display text-[13px] leading-none text-[var(--ion)]">M</span>
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-[12px] tracking-tight text-[var(--txt)]">mka<span className="text-[var(--ion)]">-os</span></span>
              <span className="mt-0.5 hidden font-mono2 text-[7.5px] uppercase tracking-[0.2em] text-[var(--faint)] sm:block">developer os 3.1</span>
            </span>
          </Link>

          {/* menu items */}
          <ul className="mx-auto hidden items-center gap-5 xl:flex">
            {NAV_LINKS.map((l) => {
              const isActive = home ? active === l.id : route === l.id;
              return (
                <li key={l.id}>
                  {home ? (
                    <a href={`#${l.id}`} className={`nav-link font-head text-[12px] ${isActive ? 'active' : ''}`}>{l.en}</a>
                  ) : (
                    <Link to={l.id === 'home' ? '' : l.id} className={`nav-link font-head text-[12px] ${isActive ? 'active' : ''}`}>{l.en}</Link>
                  )}
                </li>
              );
            })}
          </ul>

          {/* right cluster: clock · status · controls */}
          <div className="ml-auto flex items-center gap-3 xl:ml-0">
            <div className="hidden items-center gap-3 font-mono2 text-[10px] text-[var(--faint)] md:flex">
              <span className="flex items-center gap-1.5"><Wifi size={12} className="text-[var(--stable)]" /> online</span>
              <span className="flex items-center gap-1.5"><BatteryFull size={13} className="text-[var(--stable)]" /> 88%</span>
              <span className="tabular-nums text-[var(--dim)]">{time}</span>
              <span className="hidden lg:inline">{date}</span>
            </div>

            <span className="hidden h-4 w-px bg-[var(--line)] sm:block" />

            {/* language */}
            <div className="hidden items-center rounded-lg border border-[var(--line)] p-0.5 md:flex">
              {(['en', 'mm'] as Lang[]).map((l) => (
                <button key={l} onClick={() => setLang(l)} aria-pressed={lang === l}
                  className={`rounded-md px-2 py-1 font-mono2 text-[9px] uppercase tracking-wider transition-colors ${
                    lang === l ? 'bg-[var(--ion)] text-[#04121b]' : 'text-[var(--faint)] hover:text-[var(--txt)]'
                  }`}>{l}</button>
              ))}
            </div>

            {/* theme */}
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="Toggle theme"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--line)] text-[var(--faint)] transition-colors hover:border-[var(--ion)] hover:text-[var(--ion)]">
              {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            </button>

            {/* search */}
            <button onClick={() => document.dispatchEvent(new CustomEvent('open-palette'))} aria-label="Search"
              className="hidden h-8 w-8 items-center justify-center rounded-lg border border-[var(--line)] text-[var(--faint)] transition-colors hover:border-[var(--ion)] hover:text-[var(--ion)] sm:flex">
              <Search size={14} />
            </button>

            {/* mobile menu */}
            <button onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--line)] text-[var(--ion)] xl:hidden">
              <Menu size={16} />
            </button>
          </div>
        </nav>
      </header>

      {/* mobile drawer */}
      <div className={`fixed inset-0 z-[60] xl:hidden transition-all duration-400 ${open ? 'visible opacity-100' : 'invisible opacity-0'}`}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
        <aside className={`absolute right-0 top-0 flex h-full w-[86%] max-w-[340px] flex-col gap-6 overflow-y-auto border-l border-[var(--line)] bg-[var(--bg-2)] p-6 transition-transform duration-500 ${open ? 'translate-x-0' : 'translate-x-full'}`}
          role="dialog" aria-modal="true" aria-label="Menu">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 font-mono2 text-[10px] uppercase tracking-[0.2em] text-[var(--ion)]">
              <Radio size={11} /> mka-os menu
            </span>
            <button onClick={() => setOpen(false)} aria-label="Close menu"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--line)] text-[var(--faint)]"><X size={16} /></button>
          </div>

          <div className="space-y-7">
            {NAV_GROUPS.map((g) => (
              <div key={g.group}>
                <h3 className="mb-2 font-mono2 text-[9px] uppercase tracking-[0.2em] text-[var(--faint)]">{g.group}</h3>
                <ul className="space-y-1">
                  {g.items.map((it) => (
                    <li key={it.to}>
                      <Link to={it.to} className="flex items-center justify-between rounded-lg border border-transparent px-3 py-2 font-head text-[13px] text-[var(--dim)] transition-colors hover:border-[var(--line)] hover:bg-[var(--panel-soft)] hover:text-[var(--txt)]">
                        {it.label}
                        {it.mm && <span className="font-mm text-[10px] text-[var(--faint)]">{it.mm}</span>}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-auto flex flex-col gap-4 border-t border-[var(--line-faint)] pt-5">
            <div className="flex items-center gap-2">
              {(['en', 'mm'] as Lang[]).map((l) => (
                <button key={l} onClick={() => setLang(l)}
                  className={`rounded-lg border px-3 py-1.5 font-mono2 text-[10px] uppercase ${lang === l ? 'border-[var(--ion)] text-[var(--ion)]' : 'border-[var(--line)] text-[var(--faint)]'}`}>{l}</button>
              ))}
            </div>
            <Link to="contact" className="btn btn-primary justify-center">{t.contactMe}</Link>
          </div>
        </aside>
      </div>
    </>
  );
}
