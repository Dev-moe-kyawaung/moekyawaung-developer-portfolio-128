import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowUp, ArrowUpRight, CircuitBoard, Code2, Gamepad2, RotateCcw, Sparkles, X } from 'lucide-react';
import { scrollToSection } from '../lib/router';
import { MODULES, OWNER } from './content';
import { useStudio, type AssistantRequest } from './context';
import { CIRCUIT_NODES, CircuitDiagram, type CircuitNodeId } from './Circuit';

type ChatMessage = { id: number; role: 'user' | 'assistant'; text: string; link?: { href: string; label: string } };
const INITIAL: ChatMessage[] = [{ id: 0, role: 'assistant', text: 'Hi, I\'m NOVA. I can walk you through Moe\'s projects, explain the engineering layers, or help you get in touch. Where would you like to start?' }];
const ENDPOINT = (import.meta.env.VITE_ASSISTANT_ENDPOINT as string | undefined)?.trim();

function getLocalReply(question: string, projectId?: string): { text: string; node?: CircuitNodeId; link?: ChatMessage['link'] } {
  const q = question.toLowerCase();
  const namedProject = MODULES.find((p) => q.includes(p.name.toLowerCase()));
  const project = namedProject ?? (/this project|this module|its architecture/.test(q) ? MODULES.find((p) => p.id === projectId) : undefined);
  if (/contact|hire|email|availability|collaborat/.test(q)) return { text: `The best place to start is a short note about your product, the work you need, and your timeline. You can reach Moe at ${OWNER.email} or ${OWNER.phone}.`, link: { href: `mailto:${OWNER.email}`, label: 'Write an email' } };
  if (project) return { node: 'domain', text: `${project.name}\n\n${project.description}\n\nA useful engineering approach: ${project.decisions.join(' ')}\n\nThis is a design discussion, not an automated repository audit. The source is available below.`, link: { href: project.repository, label: 'Explore the repository' } };
  if (/offline|room|cach|local|sync/.test(q)) return { node: 'local', text: 'Offline-first starts with a useful local source of truth. The UI observes stored data, while a repository synchronizes changes in the background.\n\nQueued mutations need stable identifiers, bounded retries, and an explicit conflict policy. A retry alone does not guarantee that a write is safe.' };
  if (/perform|frame|startup|fps|fast/.test(q)) return { node: 'ui', text: 'Start with a release-build trace on representative hardware. Measure startup, frame timing, memory, and battery separately.\n\nFor a 60 Hz display, the frame budget is about 16.7 ms. Stable state, smaller updates, and deferred initialization help, but improvements should be measured rather than assumed. The module numbers on this site are targets, not measured results.' };
  if (/flutter|dart|multiplatform|cross-platform/.test(q)) return { node: 'domain', text: 'Share code where behavior is genuinely shared. Flutter provides a shared Dart UI; Kotlin Multiplatform can share business logic while keeping platform-specific interfaces.\n\nPayments, biometrics, notifications, and platform policies deserve explicit native boundaries. The right choice depends on the product and the team.' };
  if (/state|viewmodel|mvvm|mvi/.test(q)) return { node: 'state', text: CIRCUIT_NODES[1].detail };
  if (/firebase|retrofit|api|remote/.test(q)) return { node: 'remote', text: CIRCUIT_NODES[4].detail };
  if (/compose|interface|ui/.test(q)) return { node: 'ui', text: 'Jetpack Compose describes UI from state rather than manually mutating views. Keep state ownership clear and collect it with the screen lifecycle.\n\nIn the diagram, the interface emits an action, the state holder coordinates behavior, and the domain defines the rule. Updates flow back to the UI through observable state.' };
  if (/project|work|portfolio|repository/.test(q)) return { text: 'Start with Video Player, Social Dashboard, or POS Ultimate. Each module includes a short objective, architecture considerations, engineering targets, and a direct repository link.\n\nUse “Explore module” to inspect the details. The full workshop includes travel, games, planning tools, and more.', link: { href: OWNER.github, label: 'Moe on GitHub' } };
  if (/architect|circuit|layer|clean|engineer/.test(q)) return { node: 'domain', text: 'Think of the circuit as five responsibilities: interface, state, domain, local data, and remote data.\n\nThe domain defines the rules and repository contracts. The data layer implements those contracts. Dependencies should point toward stable abstractions, not from the domain into a specific framework. Tap a node to explore its role.' };
  if (/hello|hi\b|hey|help/.test(q)) return { text: 'Hello! Ask about a project, clean architecture, offline data, Compose, performance, or working with Moe. You can also say “switch to synthwave” to change the experience.' };
  return { text: 'I can help with Moe\'s listed projects and general mobile-engineering decisions. I don\'t have access to private code, project analytics, or unlisted career details.\n\nTry “Explain clean architecture” or “Tell me about Video Player”.', link: { href: OWNER.bio, label: 'Read the supplied bio' } };
}

export default function Assistant() {
  const { assistant, openAssistant, closeAssistant, mode, setMode } = useStudio();
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [selected, setSelected] = useState<CircuitNodeId>('domain');
  const [showCircuit, setShowCircuit] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const processed = useRef<AssistantRequest | null>(null);
  const abort = useRef<AbortController | null>(null);
  const conversationVersion = useRef(0);
  const counter = useRef(1);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const send = useCallback(async (raw: string, projectId?: string) => {
    const question = raw.trim().slice(0, 1200);
    if (!question || busy) return;
    const version = conversationVersion.current;
    const user: ChatMessage = { id: counter.current++, role: 'user', text: question };
    setMessages((m) => [...m.slice(-38), user]); setInput('');
    const respond = (reply: Omit<ChatMessage, 'id' | 'role'>) => {
      if (version !== conversationVersion.current) return;
      setMessages((m) => [...m.slice(-38), { id: counter.current++, role: 'assistant', ...reply }]);
    };
    if (/switch.*synthwave|synthwave mode/i.test(question)) { setMode('synthwave'); respond({ text: 'Synthwave engaged. Sunset gradients, chrome type, and cartridge modules. Same engineer, different frequency.' }); return; }
    if (/switch.*plasma|plasma mode/i.test(question)) { setMode('plasma'); respond({ text: 'Plasma reactor engaged. The core is back online.' }); return; }
    if (/^(open|show) (the )?(projects|work|contact|about|playground)$/i.test(question)) {
      const match = question.toLowerCase().split(' ').pop()!;
      scrollToSection(match === 'work' ? 'projects' : match); closeAssistant(); return;
    }

    const local = getLocalReply(question, projectId ?? assistant?.project);
    if (local.node) setSelected(local.node);
    if (!ENDPOINT) { respond(local); return; }

    // A deployment may supply its own same-origin AI proxy. Provider secrets
    // stay on that server; the default guide works entirely in this browser.
    const controller = new AbortController(); abort.current = controller;
    const timeout = setTimeout(() => controller.abort(), 18000);
    setBusy(true);
    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: controller.signal,
        body: JSON.stringify({ messages: [...messages.slice(-10), user].map((m) => ({ role: m.role, content: m.text })), context: { owner: OWNER.name, project: projectId ?? assistant?.project, mode } }),
      });
      if (!response.ok) throw new Error('Assistant endpoint unavailable');
      const body: unknown = await response.json();
      if (!body || typeof body !== 'object' || !('reply' in body) || typeof body.reply !== 'string') throw new Error('Invalid response');
      respond({ text: body.reply.slice(0, 8000) });
    } catch {
      respond({ ...local, text: `The connected assistant is unavailable. Here is a local portfolio-guide answer instead:\n\n${local.text}` });
    } finally { clearTimeout(timeout); setBusy(false); abort.current = null; }
  }, [assistant?.project, busy, closeAssistant, messages, mode, setMode]);

  useEffect(() => {
    if (!assistant) return;
    const raf = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(raf);
  }, [assistant]);

  useEffect(() => {
    if (assistant?.question && processed.current !== assistant) {
      processed.current = assistant;
      void send(assistant.question, assistant.project);
    }
  }, [assistant, send]);

  useEffect(() => {
    if (!assistant) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !document.querySelector('dialog[open]')) { closeAssistant(); triggerRef.current?.focus(); }
    };
    addEventListener('keydown', close);
    return () => removeEventListener('keydown', close);
  }, [assistant, closeAssistant]);
  useEffect(() => { const el = scrollRef.current; if (el) el.scrollTop = el.scrollHeight; }, [messages, busy]);
  useEffect(() => () => abort.current?.abort(), []);

  return <>
    <button type="button" ref={triggerRef} className={`assistant-trigger ${assistant ? 'is-open' : ''}`} aria-expanded={!!assistant} aria-controls="nova-panel" onClick={() => assistant ? closeAssistant() : openAssistant()}>
      <span className="nova-face"><i /><i /></span><span><strong>{mode === 'plasma' ? 'Meet NOVA' : 'PLAYER 02'}</strong><small>{mode === 'plasma' ? 'Your engineering companion' : 'YOUR ARCADE HELPER'}</small></span><span className="assistant-status" />
    </button>
    {assistant && <aside id="nova-panel" className="nova-panel" role="dialog" aria-modal="false" aria-labelledby="nova-title">
      <header className="nova-header"><span className="nova-face"><i /><i /></span><div><h2 id="nova-title">{mode === 'plasma' ? 'NOVA / Engineering companion' : 'PLAYER 02 / Arcade helper'}</h2><p>{ENDPOINT ? 'SERVER ASSISTANT' : 'LOCAL PORTFOLIO GUIDE'}</p></div><button type="button" className="studio-icon-button" onClick={() => { closeAssistant(); triggerRef.current?.focus(); }} aria-label="Close assistant"><X size={17} /></button></header>
      <div className="nova-tools"><button type="button" aria-expanded={showCircuit} onClick={() => setShowCircuit(!showCircuit)}>{mode === 'plasma' ? <CircuitBoard size={14} /> : <Gamepad2 size={14} />}{mode === 'plasma' ? 'Energy circuit' : 'Architecture map'}<span>{showCircuit ? 'HIDE' : 'SHOW'}</span></button><button type="button" onClick={() => { conversationVersion.current++; abort.current?.abort(); setMessages(INITIAL); setInput(''); }} aria-label="Reset conversation" title="Reset conversation"><RotateCcw size={13} /></button></div>
      {showCircuit && <div className="nova-circuit"><CircuitDiagram selected={selected} onSelect={(node) => { setSelected(node); void send(`Explain the ${CIRCUIT_NODES.find((n) => n.id === node)?.name} layer`); }} compact /></div>}
      <div ref={scrollRef} className="nova-messages" role="log" aria-live="polite" aria-relevant="additions">
        {messages.map((message) => <div key={message.id} className={`nova-message ${message.role}`}><span>{message.role === 'assistant' ? mode === 'synthwave' ? 'PLAYER 02' : 'NOVA' : 'YOU'}</span><p>{message.id === 0 && mode === 'synthwave' ? 'READY, PLAYER ONE. I\'m your engineering co-op partner. Pick a project, explore the architecture map, or ask for your next move. Same knowledge, a different era.' : message.text}</p>{message.link && <a href={message.link.href} target={message.link.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">{message.link.label}<ArrowUpRight size={12} /></a>}</div>)}
        {busy && <div className="nova-thinking" role="status"><i /><i /><i /><span>Preparing a response...</span></div>}
      </div>
      <div className="nova-suggestions">{['Explore projects', 'Explain offline-first', mode === 'plasma' ? 'Switch to synthwave' : 'Switch to plasma'].map((q) => <button type="button" key={q} disabled={busy} onClick={() => void send(q)}>{q}</button>)}</div>
      <form className="nova-composer" onSubmit={(event) => { event.preventDefault(); void send(input); }}><label htmlFor="nova-input" className="sr-only">Ask the portfolio assistant</label><input ref={inputRef} id="nova-input" maxLength={1200} value={input} onChange={(e) => setInput(e.target.value)} placeholder={mode === 'plasma' ? 'Ask about the code, or the person.' : 'Insert question. Continue the adventure.'} autoComplete="off" /><button type="submit" disabled={!input.trim() || busy} aria-label="Send message"><ArrowUp size={18} /></button></form>
      <p className="nova-disclosure"><Code2 size={10} />{ENDPOINT ? 'AI responses can be inaccurate. Verify technical details.' : 'Curated local answers. No AI service connected.'}<Sparkles size={10} /></p>
    </aside>}
  </>;
}