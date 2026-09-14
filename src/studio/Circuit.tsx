import { useId } from 'react';
import { ArrowRight, Code2, Database, Layers, Network, Smartphone } from 'lucide-react';
import { useStudio } from './context';

export type CircuitNodeId = 'ui' | 'state' | 'domain' | 'local' | 'remote';
export const CIRCUIT_NODES = [
  { id: 'ui' as const, name: 'Interface', label: 'UI', icon: Smartphone, x: 56, y: 100,
    summary: 'Render state. Capture intent.',
    detail: 'The screen renders a state snapshot and emits user actions. It does not fetch data or calculate business rules. That separation keeps the UI predictable and easier to test.' },
  { id: 'state' as const, name: 'State', label: 'STATE', icon: Layers, x: 156, y: 100,
    summary: 'One direction. Clear ownership.',
    detail: 'A state holder turns actions and repository updates into immutable UI state. Lifecycle-aware collection prevents unnecessary work when the screen is not visible. Process-death recovery still needs explicitly saved state.' },
  { id: 'domain' as const, name: 'Domain', label: 'DOMAIN', icon: Code2, x: 260, y: 100,
    summary: 'Business rules without UI dependencies.',
    detail: 'Use cases express product behavior using repository contracts. The domain should not know about Compose, Retrofit, or database implementations. Rules can then be tested independently.' },
  { id: 'local' as const, name: 'Local data', label: 'LOCAL', icon: Database, x: 375, y: 48,
    summary: 'Useful, even offline.',
    detail: 'A repository can expose locally stored data as the source of truth. Writes should be transactional. Queued changes need stable identifiers so a retry cannot apply the same operation twice.' },
  { id: 'remote' as const, name: 'Remote API', label: 'REMOTE', icon: Network, x: 375, y: 155,
    summary: 'Network failures are part of the design.',
    detail: 'Remote data sources handle transport, timeouts, and response parsing. A repository coordinates remote updates with local storage and defines retry and conflict rules explicitly.' },
];

export function CircuitDiagram({ selected, onSelect, compact = false }: { selected: CircuitNodeId; onSelect: (id: CircuitNodeId) => void; compact?: boolean }) {
  const { mode } = useStudio();
  const gradient = useId().replace(/:/g, '');
  const links: [CircuitNodeId, CircuitNodeId][] = [['ui', 'state'], ['state', 'domain'], ['domain', 'local'], ['domain', 'remote']];
  return <div className={`circuit-diagram ${compact ? 'compact' : ''}`}>
    <div className="circuit-grid" aria-hidden="true" />
    <svg viewBox="0 0 432 205" role="img" aria-label="Conceptual data flow from interface through state and domain to local and remote data sources">
      <defs><linearGradient id={gradient}><stop stopColor="var(--accent)" /><stop offset="1" stopColor="var(--cyan)" /></linearGradient></defs>
      {links.map(([from, to]) => {
        const a = CIRCUIT_NODES.find((n) => n.id === from)!;
        const b = CIRCUIT_NODES.find((n) => n.id === to)!;
        const active = selected === from || selected === to;
        const path = `M${a.x},${a.y} C${a.x + 60},${a.y} ${b.x - 60},${b.y} ${b.x},${b.y}`;
        return <g key={`${from}-${to}`}>
          <path d={path} fill="none" stroke="var(--line-strong)" strokeWidth="1.2" />
          <path d={path} fill="none" stroke={`url(#${gradient})`} className={`circuit-flow ${active ? 'active' : ''}`} strokeWidth={active ? 2.5 : 1.5} opacity={active ? 1 : 0.22} />
        </g>;
      })}
      {CIRCUIT_NODES.map((node) => <g key={node.id} transform={`translate(${node.x},${node.y})`}>
        <circle r={selected === node.id ? 23 : 20} fill="var(--surface)" stroke={selected === node.id ? 'var(--accent)' : 'var(--line-strong)'} />
        {selected === node.id && <circle r="29" fill="none" stroke="var(--accent)" opacity="0.24" className="circuit-node-ring" />}
        {mode === 'plasma' ? <circle r="4" fill={selected === node.id ? 'var(--accent)' : 'var(--muted)'} /> : <rect x="-4" y="-4" width="8" height="8" fill={selected === node.id ? 'var(--accent)' : 'var(--muted)'} />}
        <text y="42" textAnchor="middle" fill={selected === node.id ? 'var(--text)' : 'var(--muted)'}>{node.label}</text>
      </g>)}
    </svg>
    <div className="circuit-buttons" role="group" aria-label="Inspect an architecture layer">{CIRCUIT_NODES.map((node) => <button type="button" key={node.id} aria-pressed={selected === node.id} onClick={() => onSelect(node.id)} title={node.name}><node.icon size={13} /><span>{node.name}</span></button>)}</div>
    {!compact && <div className="circuit-selection"><span><ArrowRight size={14} /> {CIRCUIT_NODES.find((n) => n.id === selected)?.summary}</span><p>{CIRCUIT_NODES.find((n) => n.id === selected)?.detail}</p></div>}
  </div>;
}