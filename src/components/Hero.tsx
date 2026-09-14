import { useEffect, useState } from 'react';
import { ArrowRight, Download, Maximize2, Sparkles, FolderOpen, Activity } from 'lucide-react';
import { PROFILE, ROLES, STATS, SOCIALS, I18N, IMAGES } from '../data';
import { useTyping, useLang } from '../hooks';
import { SocialIcon, StatCounter, Reveal } from './ui';
import { OsWindow, SystemWidgets } from './OsChrome';

function downloadResume() {
  const txt = [
    'MOE KYAW AUNG — Senior Android / Flutter Engineer',
    `${PROFILE.location} | ${PROFILE.phones[0]} | ${PROFILE.primaryEmail}`,
    `GitHub: ${PROFILE.githubMain}`,
    '', 'Kotlin · Jetpack Compose · Flutter · Clean Architecture · Firebase · CI/CD',
    'Record: 12 years · 3,000+ deployments · 600+ repositories · 99.9% crash-free',
  ].join('\n');
  const url = URL.createObjectURL(new Blob([txt], { type: 'text/plain;charset=utf-8' }));
  const a = document.createElement('a'); a.href = url; a.download = 'Moe-Kyaw-Aung-Resume.txt'; a.click();
  URL.revokeObjectURL(url);
}

export default function Hero() {
  const lang = useLang();
  const t = I18N[lang];
  const typed = useTyping(ROLES, 46, 22, 2200);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const id = setTimeout(() => setMounted(true), 80); return () => clearTimeout(id); }, []);
  const enter = (d: number) => ({
    transitionDelay: `${d}ms`,
    opacity: mounted ? 1 : 0,
    transform: mounted ? 'none' : 'translateY(20px)',
    transition: 'opacity 0.9s cubic-bezier(0.2,0.8,0.2,1), transform 0.9s cubic-bezier(0.2,0.8,0.2,1)',
  } as React.CSSProperties);

  return (
    <section id="home" className="relative mx-auto flex min-h-screen max-w-[1440px] flex-col justify-center px-5 pb-16 pt-32 lg:px-10">
      <div className="relative w-full">
        <SystemWidgets />

        {/* ================= MAIN WELCOME WINDOW ================= */}
        <div style={enter(120)}>
          <OsWindow
            title="home.desktop"
            subtitle="welcome"
            icon={<FolderOpen size={14} />}
            toolbar="workspace / home"
            actions={
              <div className="flex items-center gap-1">
                <span className="win-btn" title="Minimize" /><span className="win-btn" title="Zoom" /><span className="win-btn active"><Maximize2 size={12} /></span>
              </div>
            }
            bodyClass="p-6 sm:p-10"
          >
            <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
              {/* statement */}
              <div>
                <p style={enter(60)} className={`mb-5 flex flex-wrap items-center gap-3 font-mono2 text-[10px] uppercase tracking-[0.24em] text-[var(--ion)] ${lang === 'mm' ? 'font-mm' : ''}`}>
                  <span className="h-px w-8 bg-gradient-to-r from-[var(--ion)] to-transparent" />
                  developer os · mka-os 3.1 · <span className="font-mm text-[var(--amber)]">{PROFILE.mmName}</span>
                </p>

                <h1 style={enter(140)} className="font-display text-[clamp(2.3rem,5.4vw,4.2rem)] leading-[1.0] tracking-[-0.03em] text-[var(--txt)]">
                  One engineer,
                  <br />
                  a whole <span className="grad-text">operating</span>
                  <br />
                  system for <span className="text-[var(--arc)]">mobile.</span>
                </h1>

                <p style={enter(240)} className={`mt-6 max-w-[52ch] text-[15px] leading-[1.8] text-[var(--dim)] ${lang === 'mm' ? 'font-mm' : ''}`}>
                  Twelve years building Android and Flutter systems that boot fast, hold their shape,
                  and stay legible to the team that inherits them — Kotlin, Jetpack Compose, clean
                  architecture and on-device AI, measured on hardware people actually own.
                </p>

                <div style={enter(320)} className="mt-6 inline-flex items-center gap-3 rounded-xl border border-[var(--line)] bg-[var(--panel-soft)] py-2.5 pl-4 pr-5">
                  <Activity size={14} className="text-[var(--ion)]" />
                  <p className="font-mono2 text-[11.5px] text-[var(--txt-soft)] sm:text-[12px]">
                    {typed}<span className="type-caret" />
                  </p>
                </div>

                <div style={enter(400)} className="mt-8 flex flex-wrap gap-3">
                  <a href="#projects" className="btn btn-primary">Open project windows <ArrowRight size={15} /></a>
                  <button onClick={downloadResume} className="btn btn-ghost"><Download size={15} /> Resume</button>
                </div>

                <div style={enter(480)} className="mt-8 flex flex-wrap items-center gap-2">
                  <span className="mr-2 font-mono2 text-[9px] uppercase tracking-[0.2em] text-[var(--fainter)]">relays</span>
                  {SOCIALS.slice(0, 8).map((s) => (
                    <a key={s.key} href={s.href} target={s.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
                      aria-label={s.label} title={`${s.label} · ${s.handle}`}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--line)] bg-[var(--panel-soft)] text-[var(--dim)] transition-all hover:-translate-y-0.5 hover:border-[var(--ion)] hover:text-[var(--ion)] hover:shadow-[var(--glow-ion)]">
                      <SocialIcon name={s.key} size={14} />
                    </a>
                  ))}
                  <span className={`ml-2 flex items-center gap-2 font-mono2 text-[9px] uppercase tracking-[0.14em] text-[var(--faint)] ${lang === 'mm' ? 'font-mm' : ''}`}>
                    <span className="pulse-dot" /> {t.available}
                  </span>
                </div>
              </div>

              {/* portrait window */}
              <div style={enter(300)} className="mx-auto w-full max-w-[300px]">
                <OsWindow title="profile.user" subtitle="root" icon={<Sparkles size={13} />} tilt
                  actions={<span className="win-btn"><Maximize2 size={12} /></span>}>
                  <div className="p-3">
                    <div className="relative overflow-hidden rounded-xl border border-[var(--line)]">
                      <img src={IMAGES.avatar} alt="Moe Kyaw Aung — portrait" loading="eager"
                        className="aspect-[4/4.6] w-full object-cover" style={{ filter: 'saturate(0.96) contrast(1.02)' }} />
                      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(7,11,18,0.85), transparent 46%)' }} />
                      <div className="absolute inset-x-3 bottom-3">
                        <div className="font-display text-[15px] text-[var(--txt)]">Moe Kyaw Aung</div>
                        <div className="mt-0.5 font-mono2 text-[8.5px] uppercase tracking-[0.16em] text-[var(--ion)]">sr. android engineer</div>
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      {[
                        { k: 'uptime', v: '12y' },
                        { k: 'shipped', v: '3k+' },
                        { k: 'crash-free', v: '99.9%' },
                      ].map((x) => (
                        <div key={x.k} className="rounded-lg border border-[var(--line-faint)] bg-[var(--panel-soft)] px-2 py-2 text-center">
                          <div className="font-display text-[15px] text-[var(--arc)]">{x.v}</div>
                          <div className="mt-0.5 font-mono2 text-[7.5px] uppercase tracking-[0.12em] text-[var(--faint)]">{x.k}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </OsWindow>
              </div>
            </div>
          </OsWindow>
        </div>

        {/* record window */}
        <Reveal delay={120}>
          <div className="mt-6">
            <div className="os-window in">
              <div className="os-window-holo" style={{ opacity: 0.55 }}>
                <div className="os-window-card" style={{ transform: 'none' }}>
                  <div className="hud-strip">
                    <span>signal log · twelve seasons</span>
                    <span className="flex items-center gap-2 text-[var(--stable)]"><span className="led" /> verified in production</span>
                  </div>
                  <div className="grid grid-cols-2 divide-[var(--line-faint)] md:grid-cols-4 md:divide-x">
                    {STATS.map((s) => <StatCounter key={s.label} stat={s} />)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
