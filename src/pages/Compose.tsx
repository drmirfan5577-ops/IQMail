import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mail, Send, Bold, Italic, Link2, List, Image as ImageIcon,
  Smile, Paperclip, ChevronDown, X, Loader2, CheckCircle2, Save, Trash2
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

const TEMPLATES = [
  { label: 'Welcome Email',   subject: 'Welcome to IQMAIL!',        body: 'Hi {name},\n\nWelcome aboard! We\'re thrilled to have you.\n\nBest,\nThe IQMAIL Team' },
  { label: 'Follow-Up',       subject: 'Quick follow-up',            body: 'Hi {name},\n\nJust following up on our previous conversation.\n\nLet me know your thoughts!' },
  { label: 'Newsletter',      subject: 'This week\'s highlights',    body: 'Hi {name},\n\nHere\'s what\'s new this week:\n\n• Update 1\n• Update 2\n• Update 3\n\nStay tuned!' },
];

const EMOJI_SET = ['😊','🚀','💡','✨','🎉','📧','💌','🌟','🔥','👋'];

export default function Compose() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [to, setTo]         = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody]     = useState('');
  const [sending, setSending] = useState(false);
  const [saving, setSaving]   = useState(false);
  const [sent, setSent]       = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [ccVisible, setCcVisible] = useState(false);
  const [cc, setCc] = useState('');
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!loading && !user) navigate('/signup', { replace: true });
  }, [user, loading, navigate]);

  const applyFormat = (tag: string) => {
    const el = bodyRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = body.slice(start, end);
    let wrapped = '';
    if (tag === 'bold') wrapped = `**${selected || 'text'}**`;
    else if (tag === 'italic') wrapped = `_${selected || 'text'}_`;
    else if (tag === 'link') wrapped = `[${selected || 'Link text'}](https://example.com)`;
    else if (tag === 'list') wrapped = `\n• ${selected || 'Item'}`;
    const next = body.slice(0, start) + wrapped + body.slice(end);
    setBody(next);
    setTimeout(() => {
      el.focus();
      el.selectionStart = start + wrapped.length;
      el.selectionEnd = start + wrapped.length;
    }, 0);
  };

  const handleSend = async () => {
    if (!to.trim()) { toast.error('Please enter a recipient email.'); return; }
    if (!subject.trim()) { toast.error('Please enter a subject.'); return; }
    if (!body.trim()) { toast.error('Please add some content.'); return; }
    if (!user) return;

    setSending(true);
    const { error } = await supabase.from('email_drafts').insert({
      user_id: user.id,
      recipient: to.trim(),
      subject: subject.trim(),
      body: body.trim(),
      status: 'sent',
      sent_at: new Date().toISOString(),
    });
    setSending(false);

    if (error) { toast.error('Failed to send email. Please try again.'); return; }

    // Log analytics event
    await supabase.from('analytics_events').insert({
      user_id: user.id,
      event_type: 'sent',
      metadata: { recipient: to.trim(), subject: subject.trim() },
    });

    setSent(true);
    toast.success(`Email sent to ${to}!`, { description: subject });
    setTimeout(() => { setSent(false); setTo(''); setSubject(''); setBody(''); setCc(''); }, 2500);
  };

  const handleSaveDraft = async () => {
    if (!user || (!to && !subject && !body)) { toast.error('Nothing to save.'); return; }
    setSaving(true);
    const { error } = await supabase.from('email_drafts').insert({
      user_id: user.id,
      recipient: to.trim(),
      subject: subject.trim(),
      body: body.trim(),
      status: 'draft',
    });
    setSaving(false);
    if (error) { toast.error('Could not save draft.'); return; }
    toast.success('Draft saved!');
  };

  const applyTemplate = (t: typeof TEMPLATES[0]) => {
    setSubject(t.subject);
    setBody(t.body);
    setShowTemplates(false);
    toast.success(`Template "${t.label}" applied.`);
  };

  if (loading) return null;

  return (
    <div className="min-h-screen pt-16 pb-32">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'Syne, sans-serif' }}>
              Compose Email
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">Write and send emails directly from IQMAIL</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSaveDraft}
              disabled={saving}
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground glass-card px-4 py-2 rounded-xl transition-all hover:border-white/15"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              Save Draft
            </button>
            <button
              onClick={() => { setTo(''); setSubject(''); setBody(''); setCc(''); }}
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-destructive glass-card px-4 py-2 rounded-xl transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear
            </button>
          </div>
        </div>

        {/* Composer card */}
        <div className="glass-card-elevated rounded-2xl overflow-hidden shadow-2xl border border-white/[0.14]">
          {/* Email client header bar */}
          <div className="bg-white/[0.03] border-b border-white/[0.08] px-5 py-3 flex items-center gap-3">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-400/50" />
              <span className="w-3 h-3 rounded-full bg-amber-400/50" />
              <span className="w-3 h-3 rounded-full bg-emerald-400/50" />
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Mail className="w-3.5 h-3.5" />
              <span>New Message — IQMAIL Composer</span>
            </div>
            {/* Template picker */}
            <div className="ml-auto relative">
              <button
                onClick={() => setShowTemplates(v => !v)}
                className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors px-3 py-1.5 rounded-lg hover:bg-primary/10"
              >
                Templates <ChevronDown className="w-3 h-3" />
              </button>
              {showTemplates && (
                <div className="absolute right-0 top-full mt-1 glass-card-elevated rounded-xl border border-white/[0.12] shadow-xl w-48 z-10 py-1">
                  {TEMPLATES.map(t => (
                    <button
                      key={t.label}
                      onClick={() => applyTemplate(t)}
                      className="w-full text-left px-3 py-2.5 text-xs text-foreground/80 hover:text-foreground hover:bg-white/[0.05] transition-colors"
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Fields */}
          <div className="divide-y divide-white/[0.07]">
            {/* To */}
            <div className="flex items-center gap-3 px-5 py-3">
              <span className="text-xs font-semibold text-muted-foreground w-12 flex-shrink-0">To</span>
              <input
                type="email"
                value={to}
                onChange={e => setTo(e.target.value)}
                placeholder="recipient@example.com"
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 outline-none"
              />
              <button
                onClick={() => setCcVisible(v => !v)}
                className="text-xs text-muted-foreground hover:text-primary transition-colors px-2 py-1 rounded-lg hover:bg-primary/10"
              >
                CC
              </button>
            </div>

            {/* CC */}
            {ccVisible && (
              <div className="flex items-center gap-3 px-5 py-3">
                <span className="text-xs font-semibold text-muted-foreground w-12 flex-shrink-0">CC</span>
                <input
                  type="email"
                  value={cc}
                  onChange={e => setCc(e.target.value)}
                  placeholder="cc@example.com"
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 outline-none"
                />
                <button onClick={() => { setCcVisible(false); setCc(''); }}>
                  <X className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
                </button>
              </div>
            )}

            {/* Subject */}
            <div className="flex items-center gap-3 px-5 py-3">
              <span className="text-xs font-semibold text-muted-foreground w-12 flex-shrink-0">Subject</span>
              <input
                type="text"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="Email subject…"
                className="flex-1 bg-transparent text-sm text-foreground font-medium placeholder:text-muted-foreground/50 outline-none"
              />
              <span className={`text-[10px] ${subject.length > 80 ? 'text-red-400' : 'text-muted-foreground'}`}>
                {subject.length}/100
              </span>
            </div>
          </div>

          {/* Formatting toolbar */}
          <div className="flex items-center gap-1 px-4 py-2 border-b border-white/[0.07] bg-white/[0.02]">
            {[
              { icon: Bold,      tag: 'bold',  label: 'Bold' },
              { icon: Italic,    tag: 'italic', label: 'Italic' },
              { icon: Link2,     tag: 'link',  label: 'Link' },
              { icon: List,      tag: 'list',  label: 'List' },
            ].map(({ icon: Icon, tag, label }) => (
              <button
                key={tag}
                type="button"
                onClick={() => applyFormat(tag)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/[0.08] transition-all"
                title={label}
                aria-label={label}
              >
                <Icon className="w-3.5 h-3.5" />
              </button>
            ))}
            <div className="w-px h-4 bg-white/10 mx-1" />
            {/* Emoji picker */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowEmoji(v => !v)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/[0.08] transition-all"
                title="Emoji"
              >
                <Smile className="w-3.5 h-3.5" />
              </button>
              {showEmoji && (
                <div className="absolute top-full left-0 mt-1 glass-card-elevated rounded-xl border border-white/[0.12] shadow-xl p-2 flex flex-wrap gap-1 w-36 z-10">
                  {EMOJI_SET.map(e => (
                    <button
                      key={e}
                      onClick={() => { setBody(b => b + e); setShowEmoji(false); }}
                      className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/10 text-sm transition-colors"
                    >
                      {e}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              type="button"
              className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/[0.08] transition-all"
              title="Attach file"
            >
              <Paperclip className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/[0.08] transition-all"
              title="Insert image"
            >
              <ImageIcon className="w-3.5 h-3.5" />
            </button>
            <div className="ml-auto text-[10px] text-muted-foreground">{body.length} chars</div>
          </div>

          {/* Body */}
          <textarea
            ref={bodyRef}
            value={body}
            onChange={e => setBody(e.target.value)}
            placeholder="Write your email here… (Supports **bold**, _italic_, [link](url) syntax)"
            rows={14}
            className="w-full bg-transparent px-5 py-4 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none resize-none leading-relaxed"
          />

          {/* Footer actions */}
          <div className="flex items-center justify-between px-5 py-4 border-t border-white/[0.08] bg-white/[0.02]">
            <div className="text-xs text-muted-foreground">
              {sent
                ? <span className="flex items-center gap-1.5 text-emerald-400"><CheckCircle2 className="w-3.5 h-3.5" /> Sent successfully!</span>
                : 'Draft auto-saves every 30 seconds'}
            </div>
            <button
              onClick={handleSend}
              disabled={sending || sent}
              className="gradient-btn text-white font-semibold px-6 py-2.5 rounded-xl text-sm flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
            >
              {sending
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</>
                : sent
                ? <><CheckCircle2 className="w-4 h-4" /> Sent!</>
                : <><Send className="w-4 h-4" /> Send Email</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
