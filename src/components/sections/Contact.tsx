import { useState, type FormEvent } from 'react';
import { links } from '@/data/portfolio';
import { GlassPanel } from '@/components/GlassPanel';
import { ScrambleText } from '@/components/ScrambleText';
import { useReveal } from '@/lib/hooks';
import { supabase } from '@/lib/supabase';
import { Mail, Github, Linkedin, Send, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

const linkIcons: Record<string, typeof Mail> = {
  Mail,
  Github,
  Linkedin,
};

interface ContactProps {
  active: boolean;
  reducedMotion: boolean;
}

type Status = 'idle' | 'loading' | 'success' | 'error';

export function Contact({ active, reducedMotion }: ContactProps) {
  const { ref, revealed } = useReveal();
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email address';
    if (!form.subject.trim()) e.subject = 'Subject is required';
    if (!form.message.trim()) e.message = 'Message is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setStatus('loading');
    try {
      const { error } = await supabase.from('contact_messages').insert({
        name: form.name,
        email: form.email,
        subject: form.subject,
        message: form.message,
      });
      if (error) throw error;
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  const fieldClass = (field: string) =>
    `w-full rounded-lg border bg-deep-navy/50 px-4 py-3 text-sm text-text placeholder-muted transition-all focus:outline-none ${
      errors[field]
        ? 'border-red-400/60 focus:border-red-400'
        : 'border-cyan/20 focus:border-cyan focus:shadow-[0_0_12px_rgba(34,228,255,0.2)]'
    }`;

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`reveal-up ${revealed ? 'revealed' : ''} relative z-10 flex min-h-screen items-center px-6 py-20 md:px-16 lg:px-24`}
    >
      <div className="w-full max-w-2xl">
        <div className="mb-6">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-cyan">07 / Contact</span>
        </div>

        <h2 className="mb-8 font-heading text-3xl font-bold text-text md:text-4xl">
          <ScrambleText text="Open Channel" active={active} reducedMotion={reducedMotion} as="span" />
        </h2>

        <GlassPanel className="p-6 md:p-10">
          <p className="mb-6 text-sm leading-relaxed text-muted">
            Have a project in mind or want to connect? Send a transmission and I'll get back to you.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-muted">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={fieldClass('name')}
                  placeholder="Your name"
                  disabled={status === 'loading'}
                />
                {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="email" className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-muted">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={fieldClass('email')}
                  placeholder="you@example.com"
                  disabled={status === 'loading'}
                />
                {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
              </div>
            </div>
            <div>
              <label htmlFor="subject" className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-muted">
                Subject
              </label>
              <input
                id="subject"
                type="text"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className={fieldClass('subject')}
                placeholder="What's this about?"
                disabled={status === 'loading'}
              />
              {errors.subject && <p className="mt-1 text-xs text-red-400">{errors.subject}</p>}
            </div>
            <div>
              <label htmlFor="message" className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-muted">
                Message
              </label>
              <textarea
                id="message"
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className={`${fieldClass('message')} resize-none`}
                placeholder="Your message..."
                disabled={status === 'loading'}
              />
              {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message}</p>}
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="gradient-border-btn flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 font-mono text-sm font-semibold text-cyan transition-transform hover:scale-[1.02] disabled:opacity-50"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Transmitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send Transmission
                </>
              )}
            </button>

            {status === 'success' && (
              <div className="flex items-center gap-2 rounded-lg border border-green-400/40 bg-green-400/10 px-4 py-3 text-sm text-green-300">
                <CheckCircle2 className="h-4 w-4" />
                Transmission received. I'll get back to you soon.
              </div>
            )}

            {status === 'error' && (
              <div className="flex items-center gap-2 rounded-lg border border-red-400/40 bg-red-400/10 px-4 py-3 text-sm text-red-300">
                <AlertCircle className="h-4 w-4" />
                Transmission failed. Please try again or email directly.
              </div>
            )}
          </form>

          <div className="mt-8 flex flex-wrap gap-3 border-t border-cyan/10 pt-6">
            {links.map((link) => {
              const Icon = linkIcons[link.icon] ?? Mail;
              return (
                <a
                  key={link.label}
                  href={link.url}
                  target={link.url.startsWith('mailto:') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg border border-cyan/20 bg-deep-navy/40 px-4 py-2.5 font-mono text-xs font-medium text-muted transition-all hover:border-cyan hover:text-cyan hover:shadow-[0_0_12px_rgba(34,228,255,0.2)]"
                  aria-label={link.label}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </a>
              );
            })}
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}
