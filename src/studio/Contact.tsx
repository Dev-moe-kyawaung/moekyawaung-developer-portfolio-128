import { useState, type FormEvent } from 'react';
import { ArrowUpRight, Check, Copy, Mail, Phone, Send } from 'lucide-react';
import { OWNER } from './content';
import { GithubIcon, Reveal, SectionTitle } from './ui';

type Fields = { name: string; email: string; subject: string; message: string };
type Errors = Partial<Record<keyof Fields, string>>;
const EMPTY: Fields = { name: '', email: '', subject: 'Mobile app development', message: '' };
const ENDPOINT = (import.meta.env.VITE_CONTACT_ENDPOINT as string | undefined)?.trim();

export default function Contact() {
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState('');
  const [pending, setPending] = useState(false);
  const [copied, setCopied] = useState(false);

  const update = (key: keyof Fields, value: string) => {
    setFields((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined })); setStatus('');
  };
  const copyEmail = async () => {
    try { await navigator.clipboard.writeText(OWNER.email); setCopied(true); }
    catch { setStatus(`Email: ${OWNER.email}. Select the address above to copy it.`); }
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next: Errors = {};
    if (fields.name.trim().length < 2) next.name = 'Please enter your name (at least 2 characters).';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) next.email = 'Please enter a valid email address.';
    if (fields.message.trim().length < 12) next.message = 'Please tell me a little more (at least 12 characters).';
    setErrors(next);
    if (Object.keys(next).length) {
      document.getElementById(`contact-${Object.keys(next)[0]}`)?.focus(); return;
    }
    if (!ENDPOINT) {
      const body = `Hi Moe,\n\n${fields.message.trim()}\n\n${fields.name.trim()}\nReply to: ${fields.email.trim()}`;
      window.location.href = `mailto:${OWNER.email}?subject=${encodeURIComponent(fields.subject)}&body=${encodeURIComponent(body)}`;
      setStatus('Your email draft is ready. Please send it from your email app. If no app opened, use the email address on the left.');
      return;
    }
    setPending(true);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(fields), signal: controller.signal });
      if (!response.ok) throw new Error('Send failed');
      setStatus('Your message was sent. Thank you for reaching out.'); setFields(EMPTY);
    } catch { setStatus('The message could not be sent. Please try again or email me directly. Your draft is still here.'); }
    finally { clearTimeout(timeout); setPending(false); }
  };

  return <section className="studio-section contact-section" id="contact"><div className="studio-container contact-layout">
    <Reveal><SectionTitle number="05" eyebrow="LET'S CONNECT" title="Your next idea." accent="Our next build." description="Have a product in mind, an engineering challenge, or just a good question? Let's start a conversation." />
      <div className="contact-address"><span>DROP ME A LINE</span><div><a href={`mailto:${OWNER.email}`}>{OWNER.email}</a><button type="button" className="studio-icon-button" onClick={() => void copyEmail()} aria-label={copied ? 'Email address copied' : 'Copy email address'} title={copied ? 'Copied' : 'Copy email'}>{copied ? <Check size={15} /> : <Copy size={15} />}</button></div></div>
      <a className="contact-phone" href="tel:+959889000889"><Phone size={14} />{OWNER.phone}<ArrowUpRight size={13} /></a>
      <div className="contact-socials"><a href={OWNER.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub"><GithubIcon size={18} /></a><a href={OWNER.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><span className="linkedin-mark">in</span></a><a href={OWNER.gravatar} target="_blank" rel="noopener noreferrer" aria-label="Gravatar"><span className="gravatar-mark">G</span></a><a href={`mailto:${OWNER.email}`} aria-label="Email"><Mail size={17} /></a></div>
      <p className="contact-status"><span className="status-dot" />Open to select projects &amp; engineering roles.</p>
    </Reveal>
    <Reveal delay={90}><form className="studio-contact-form" noValidate onSubmit={(event) => void submit(event)}>
      <div className="form-row">
        <div className="field-group"><label htmlFor="contact-name">Your name <span>*</span></label><input id="contact-name" name="name" autoComplete="name" required maxLength={100} value={fields.name} onChange={(e) => update('name', e.target.value)} placeholder="What should I call you?" aria-invalid={!!errors.name} aria-describedby={errors.name ? 'error-name' : undefined} />{errors.name && <p id="error-name" role="alert">{errors.name}</p>}</div>
        <div className="field-group"><label htmlFor="contact-email">Email address <span>*</span></label><input id="contact-email" name="email" type="email" autoComplete="email" required maxLength={200} value={fields.email} onChange={(e) => update('email', e.target.value)} placeholder="you@company.com" aria-invalid={!!errors.email} aria-describedby={errors.email ? 'error-email' : undefined} />{errors.email && <p id="error-email" role="alert">{errors.email}</p>}</div>
      </div>
      <div className="field-group"><label htmlFor="contact-subject">What are you thinking?</label><select id="contact-subject" name="subject" value={fields.subject} onChange={(e) => update('subject', e.target.value)}>{['Mobile app development', 'Architecture review', 'Performance audit', 'Engineering role', 'Open-source collaboration', 'Something else'].map((s) => <option key={s}>{s}</option>)}</select></div>
      <div className="field-group"><label htmlFor="contact-message">A little about your idea <span>*</span></label><textarea id="contact-message" name="message" rows={5} required maxLength={3000} value={fields.message} onChange={(e) => update('message', e.target.value)} placeholder="The vision, the challenge, the possibilities..." aria-invalid={!!errors.message} aria-describedby={errors.message ? 'error-message' : undefined} />{errors.message && <p id="error-message" role="alert">{errors.message}</p>}</div>
      <div className="form-submit-row"><small>{ENDPOINT ? 'Your details are only used to reply.' : 'Opens a draft in your email app.'}</small><button className="studio-button primary" type="submit" disabled={pending}>{pending ? 'Sending...' : ENDPOINT ? 'Send message' : 'Compose message'}<Send size={15} /></button></div>
      {status && <p className="form-status" role="status">{status}</p>}
    </form></Reveal>
  </div></section>;
}