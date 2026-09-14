import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { ArrowUpRight, X } from 'lucide-react';

export function Mark({ small = false }: { small?: boolean }) {
  return <svg width={small ? 26 : 35} height={small ? 26 : 35} viewBox="0 0 40 40" fill="none" aria-hidden="true">
    <path d="M20 2 35.6 11v18L20 38 4.4 29V11Z" stroke="currentColor" strokeWidth="1.4" />
    <path d="m11 26 4.5-15L20 21l4.5-10L29 26M11 26h7m4 0h7" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
    <circle cx="20" cy="29" r="1.5" fill="currentColor" />
  </svg>;
}

export function GithubIcon({ size = 18 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.55.1.76-.24.76-.53v-2.07c-3.08.67-3.73-1.31-3.73-1.31-.5-1.28-1.23-1.62-1.23-1.62-1.01-.69.08-.68.08-.68 1.12.08 1.7 1.14 1.7 1.14 1 1.69 2.6 1.2 3.23.91.1-.71.39-1.2.7-1.48-2.46-.28-5.05-1.23-5.05-5.49 0-1.21.43-2.2 1.14-2.98-.12-.28-.49-1.41.11-2.93 0 0 .93-.3 3.06 1.14a10.6 10.6 0 0 1 5.57 0c2.12-1.44 3.05-1.14 3.05-1.14.6 1.52.22 2.65.11 2.93.71.78 1.14 1.77 1.14 2.98 0 4.27-2.59 5.21-5.06 5.49.4.34.75 1.02.75 2.06V22c0 .29.2.64.76.53A11.1 11.1 0 0 0 12 .9Z" /></svg>;
}

export function ExternalLink({ href, children, className = '' }: { href: string; children: ReactNode; className?: string }) {
  return <a href={href} target="_blank" rel="noopener noreferrer" className={className}>{children}<ArrowUpRight size={15} aria-hidden="true" /></a>;
}

export function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const target = ref.current;
    if (!target) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) { setShown(true); return; }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setShown(true); observer.disconnect(); }
    }, { threshold: 0.06, rootMargin: '0px 0px 20px 0px' });
    observer.observe(target);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={`studio-reveal ${shown ? 'is-visible' : ''} ${className}`} style={{ '--delay': `${delay}ms` } as CSSProperties}>{children}</div>;
}

export function SectionTitle({ number, eyebrow, title, accent, description }: { number: string; eyebrow: string; title: string; accent?: string; description?: string }) {
  return <div className="studio-section-title">
    <span className="studio-eyebrow"><span>{number}</span><i />{eyebrow}</span>
    <h2>{title}{accent && <> <span>{accent}</span></>}</h2>
    {description && <p>{description}</p>}
  </div>;
}

// A native dialog provides modal focus containment, Escape handling, and
// return-to-trigger focus without rebuilding those behaviors in JavaScript.
export function Modal({ title, children, onClose, wide = false }: { title: string; children: ReactNode; onClose: () => void; wide?: boolean }) {
  const ref = useRef<HTMLDialogElement>(null);
  const id = useId();
  useEffect(() => {
    const dialog = ref.current;
    const savedOverflow = document.body.style.overflow;
    const trigger = document.activeElement as HTMLElement | null;
    dialog?.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      dialog?.close();
      document.body.style.overflow = savedOverflow;
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    };
  }, []);
  return createPortal(<dialog ref={ref} aria-labelledby={id} className={`studio-dialog ${wide ? 'is-wide' : ''}`}
    onCancel={(event) => { event.preventDefault(); onClose(); }}
    onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <div className="dialog-surface">
      <header className="dialog-header"><span id={id}>{title}</span><button type="button" className="studio-icon-button" aria-label="Close dialog" onClick={onClose}><X size={19} /></button></header>
      {children}
    </div>
  </dialog>, document.body);
}

export function ProfileImage({ src, className = '' }: { src: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  return failed
    ? <div className={`profile-fallback ${className}`} aria-label="Moe Kyaw Aung">MKA</div>
    : <img className={className} src={src} alt="Moe Kyaw Aung" loading="lazy" decoding="async" onError={() => setFailed(true)} />;
}