import type { ReactNode } from 'react';
import { ArrowUpRight, Info } from 'lucide-react';
import { Link } from '../lib/router';
import { PageShell } from '../components/pageshell';
import { Collections } from '../components/Collections';
import { Pricing, Testimonials, Faq } from '../components/Engage';
import Services from '../components/Services';
import { CaseStudiesPage, CaseStudyPage, ProjectPage } from '../pages/Work';
import BlueprintsPage from '../pages/Blueprints';
import {
  ExperiencePage, TechStackPage, ArchitecturePage, FlutterArchPage,
  PerformancePage, OpenSourcePage, GitHubPage, WritingPage, TalksPage,
  MentorshipPage, LabsPage, DesignSystemPage, AccessibilityPage, LocalizationPage,
} from '../pages/Craft';
import { OWNER } from './content';

/** The earlier architecture workshop remains available, but illustrative
 *  numbers and draft content must not masquerade as verified client results. */
export default function ReferencePages({ route }: { route: string }) {
  const pages: Record<string, ReactNode> = {
    'blueprints': <BlueprintsPage />,
    'case-studies': <CaseStudiesPage />,
    'experience': <ExperiencePage />,
    'tech-stack': <TechStackPage />,
    'architecture': <ArchitecturePage />,
    'flutter-architecture': <FlutterArchPage />,
    'performance': <PerformancePage />,
    'open-source': <OpenSourcePage />,
    'github': <GitHubPage />,
    'writing': <WritingPage />,
    'talks': <TalksPage />,
    'mentorship': <MentorshipPage />,
    'labs': <LabsPage />,
    'design-system': <DesignSystemPage />,
    'accessibility': <AccessibilityPage />,
    'localization': <LocalizationPage />,
    'collections': <Collections />,
    'pricing': <Pricing />,
    'testimonials': <Testimonials />,
    'faq': <Faq />,
    'services': <Services />,
  };
  if (route === 'legal') return <PageShell route="legal"><div className="resume-content">
    <h2>Privacy</h2><p>The site stores your visual-theme and motion preferences in your browser. It does not set advertising cookies. Images and fonts load from external asset providers, which may receive standard connection information.</p>
    <h2>Contact</h2><p>Without a configured contact endpoint, the form opens an email draft in your email application. It does not submit a message silently. With an endpoint configured, only the entered form details are sent to that endpoint.</p>
    <h2>Assistant</h2><p>NOVA uses curated local responses by default. If a server assistant is configured, submitted chat messages and the current project context are sent to that server. Do not enter confidential information.</p>
    <h2>Content and attribution</h2><p>Project links and profile material were supplied by the owner. UI previews and simulated targets are illustrative, not measurements of the linked repositories. The reference workshop preserves earlier draft content that has not been independently verified. New scene artwork was generated for this site; icons are from Lucide and typography from Google Fonts.</p>
  </div></PageShell>;

  if (route === 'certificates' || route === 'awards') return <PageShell route="certificates"><div className="resume-content">
    <h2>Continuous learning, documented.</h2><p>Moe supplied a Programming Hub certificate reference for C Programming. The larger credential collection can be requested directly; additional certificate IDs are not fabricated here.</p>
    <a href="https://www.programminghub.io/certificate?id=1720080366600" target="_blank" rel="noopener noreferrer" className="studio-button ghost" style={{ marginTop: 24 }}>View supplied certificate<ArrowUpRight size={15} /></a>
    <p style={{ marginTop: 24 }}>For the full collection: <a href={`mailto:${OWNER.email}`}>{OWNER.email}</a>.</p>
  </div></PageShell>;

  const content = route.startsWith('project/') ? <ProjectPage slug={route.slice(8)} />
    : route.startsWith('case-study/') ? <CaseStudyPage slug={route.slice(11)} /> : pages[route];
  if (!content) return <section className="studio-container studio-section resume-page"><span className="studio-eyebrow">404 / OFF THE GRID</span><h1 className="font-display text-5xl mt-5">This page isn&apos;t here.</h1><p className="text-[var(--muted)] mt-5">Let&apos;s get you back to the work.</p><Link to="" className="studio-button primary mt-8">Return home<ArrowUpRight size={15} /></Link></section>;
  return <div className="legacy-page"><aside className="reference-note"><Info size={16} className="shrink-0 mt-1" /><span>Reference workshop: these earlier architecture examples and draft profiles include illustrative metrics and sample content. They are not independently verified production benchmarks or credentials.</span></aside>{content}</div>;
}