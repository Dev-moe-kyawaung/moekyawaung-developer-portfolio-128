import { useCallback, useEffect, useState } from 'react';
import type { ReactNode, MouseEvent } from 'react';

/* ============================================================
   MICRO ROUTER — hash based, zero dependency
   Routes look like:  #/  ·  #/resume  ·  #/project/video-player
   ============================================================ */

/** Read the current route segments from the location hash. */
function readHash(): string {
  // Only #/ denotes a page route. Plain hashes remain native section anchors.
  if (!window.location.hash.startsWith('#/')) return '';
  const raw = window.location.hash.slice(2);
  return raw.split('?')[0].replace(/\/+$/, '');
}

/** Subscribe to hash changes. */
export function useRoute(): string {
  const [route, setRoute] = useState<string>(() =>
    typeof window === 'undefined' ? '' : readHash()
  );

  useEffect(() => {
    const onHash = () => setRoute(readHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  return route;
}

/** Programmatic navigation that also resets scroll position. */
export function navigate(to: string) {
  const clean = to.replace(/^#?\/?/, '');
  if (readHash() === clean) {
    history.replaceState(null, '', clean ? `#/${clean}` : '#/');
    window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    return;
  }
  window.location.hash = clean ? `#/${clean}` : '#/';
  window.scrollTo({ top: 0, behavior: 'auto' });
}

/** Anchor that plays nicely with the router (resets scroll, no full reload). */
export function Link({
  to, children, className, ariaLabel,
}: { to: string; children: ReactNode; className?: string; ariaLabel?: string }) {
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    navigate(to);
  };
  return (
    <a href={`#/${to.replace(/^#?\/?/, '')}`} onClick={onClick} className={className} aria-label={ariaLabel}>
      {children}
    </a>
  );
}

/** In-page anchor that keeps smooth-scroll behaviour for `#section` links. */
export function useSectionNav() {
  return useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);
}

/** True when the route matches the given path prefix. */
export const isRoute = (route: string, path: string) =>
  path === '' ? route === '' : route === path || route.startsWith(`${path}/`);

/** Preserve a section destination when navigating back from a sub-page. */
export function scrollToSection(id: string) {
  if (readHash() !== '') {
    window.location.hash = `#/?section=${encodeURIComponent(id)}`;
    return;
  }
  const el = document.getElementById(id);
  if (el) {
    history.replaceState(null, '', `#${id}`);
    el.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  }
}
