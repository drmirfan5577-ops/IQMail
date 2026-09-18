import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plug, Check, X, ExternalLink, RefreshCw, Zap, Search,
  ChevronRight, Info, CheckCircle2, Clock
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

interface Integration {
  id: string;
  service_id: string;
  connected: boolean;
  connected_at: string | null;
}

interface ServiceDef {
  id: string;
  name: string;
  desc: string;
  logo: string;
  category: string;
  color: string;
  features: string[];
  docs: string;
}

const SERVICES: ServiceDef[] = [
  {
    id: 'slack',       name: 'Slack',       logo: '💬',
    desc: 'Get notified in Slack when campaigns are sent or open-rate milestones are hit.',
    category: 'Communication', color: 'from-purple-500/20 to-violet-500/10',
    features: ['Campaign alerts', 'Weekly reports', 'Error notifications'],
    docs: 'https://slack.com',
  },
  {
    id: 'zapier',      name: 'Zapier',      logo: '⚡',
    desc: 'Connect IQMAIL to 5,000+ apps with no-code automation workflows.',
    category: 'Automation', color: 'from-orange-500/20 to-amber-500/10',
    features: ['Trigger on send', 'Multi-step Zaps', 'Webhook support'],
    docs: 'https://zapier.com',
  },
  {
    id: 'hubspot',     name: 'HubSpot',     logo: '🟠',
    desc: 'Sync contacts and track email engagement in your HubSpot CRM.',
    category: 'CRM', color: 'from-orange-600/20 to-red-500/10',
    features: ['Contact sync', 'Deal tracking', 'Email logging'],
    docs: 'https://hubspot.com',
  },
  {
    id: 'mailchimp',   name: 'Mailchimp',   logo: '🐒',
    desc: 'Import Mailchimp audiences and migrate campaigns to IQMAIL.',
    category: 'Email', color: 'from-yellow-500/20 to-amber-400/10',
    features: ['List import', 'Template sync', 'Analytics merge'],
    docs: 'https://mailchimp.com',
  },
  {
    id: 'notion',      name: 'Notion',      logo: '📝',
    desc: 'Log campaign performance data directly to Notion databases.',
    category: 'Productivity', color: 'from-slate-500/20 to-gray-400/10',
    features: ['Auto-logging', 'Dashboard pages', 'Team visibility'],
    docs: 'https://notion.so',
  },
  {
    id: 'salesforce',  name: 'Salesforce',  logo: '☁️',
    desc: 'Bidirectional sync with Salesforce for enterprise email orchestration.',
    category: 'CRM', color: 'from-blue-600/20 to-sky-400/10',
    features: ['Lead sync', 'Activity history', 'Campaign attribution'],
    docs: 'https://salesforce.com',
  },
  {
    id: 'google_analytics', name: 'Google Analytics', logo: '📊',
    desc: 'Track email-driven traffic and conversions in Google Analytics 4.',
    category: 'Analytics', color: 'from-blue-500/20 to-indigo-400/10',
    features: ['UTM tracking', 'Goal funnels', 'Audience segments'],
    docs: 'https://analytics.google.com',
  },
  {
    id: 'stripe',      name: 'Stripe',      logo: '💳',
    desc: 'Trigger transactional emails based on Stripe payment events.',
    category: 'Payments', color: 'from-violet-500/20 to-purple-400/10',
    features: ['Payment confirmations', 'Subscription emails', 'Invoice delivery'],
    docs: 'https://stripe.com',
  },
  {
    id: 'airtable',    name: 'Airtable',    logo: '🗄️',
    desc: 'Use Airtable bases as email list sources and campaign trackers.',
    category: 'Database', color: 'from-teal-500/20 to-emerald-400/10',
    features: ['Base sync', 'Row triggers', 'Field mapping'],
    docs: 'https://airtable.com',
  },
];

const CATEGORIES = ['All', 'CRM', 'Communication', 'Automation', 'Email', 'Analytics', 'Payments', 'Productivity', 'Database'];

export default function Integrations() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [toggling, setToggling] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) navigate('/signup', { replace: true });
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('integrations')
      .select('*')
      .eq('user_id', user.id)
      .then(({ data }) => setIntegrations(data ?? []));
  }, [user]);

  const isConnected = (sid: string) => integrations.some(i => i.service_id === sid && i.connected);

  const toggle = async (sid: string) => {
    if (!user) return;
    setToggling(sid);
    const existing = integrations.find(i => i.service_id === sid);
    const nowConnected = !isConnected(sid);

    if (existing) {
      const { error } = await supabase
        .from('integrations')
        .update({ connected: nowConnected, connected_at: nowConnected ? new Date().toISOString() : null })
        .eq('user_id', user.id)
        .eq('service_id', sid);
      if (!error) {
        setIntegrations(prev => prev.map(i => i.service_id === sid ? { ...i, connected: nowConnected, connected_at: nowConnected ? new Date().toISOString() : null } : i));
        toast.success(nowConnected ? `${sid} connected!` : `${sid} disconnected.`);
      }
    } else {
      const { data, error } = await supabase
        .from('integrations')
        .insert({ user_id: user.id, service_id: sid, connected: true, connected_at: new Date().toISOString() })
        .select()
        .single();
      if (!error && data) {
        setIntegrations(prev => [...prev, data]);
        toast.success(`${sid} connected!`);
      }
    }
    setToggling(null);
  };

  const filtered = SERVICES
    .filter(s => activeCategory === 'All' || s.category === activeCategory)
    .filter(s => !query || s.name.toLowerCase().includes(query.toLowerCase()) || s.desc.toLowerCase().includes(query.toLowerCase()));

  const connectedCount = SERVICES.filter(s => isConnected(s.id)).length;

  if (loading) return null;

  return (
    <div className="min-h-screen pt-16 pb-32">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'Syne, sans-serif' }}>
              Integrations
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {connectedCount} of {SERVICES.length} connected
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <CheckCircle2 className="w-3 h-3" />
              {connectedCount} Active
            </span>
          </div>
        </div>

        {/* Search + filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              type="search"
              placeholder="Search integrations…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full input-field rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground outline-none"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.slice(0, 5).map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-xs font-medium px-3 py-2.5 rounded-xl transition-all ${
                  activeCategory === cat
                    ? 'bg-primary/20 text-primary border border-primary/30'
                    : 'glass-card text-muted-foreground hover:text-foreground hover:border-white/15'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(service => {
            const connected = isConnected(service.id);
            const isToggling = toggling === service.id;
            const isExpanded = expanded === service.id;

            return (
              <div
                key={service.id}
                className={`glass-card rounded-2xl overflow-hidden transition-all duration-200 ${
                  connected ? 'border-emerald-500/25 shadow-[0_0_15px_rgba(52,211,153,0.08)]' : 'hover:border-white/15'
                }`}
              >
                <div className={`h-1.5 w-full bg-gradient-to-r ${service.color.split(' ')[0].replace('/20', '')} ${service.color.split(' ')[1].replace('/10', '')}`}
                  style={{ background: connected ? 'linear-gradient(90deg, #34d399, #059669)' : undefined }}
                />
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{service.logo}</span>
                      <div>
                        <div className="text-sm font-semibold text-foreground">{service.name}</div>
                        <div className="text-[10px] text-muted-foreground">{service.category}</div>
                      </div>
                    </div>
                    {connected && (
                      <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-full">
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                        LIVE
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-2">{service.desc}</p>

                  {/* Features collapse */}
                  {isExpanded && (
                    <div className="mb-4 space-y-1.5 animate-fade-in-up">
                      {service.features.map(f => (
                        <div key={f} className="flex items-center gap-2 text-xs text-foreground/70">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                          {f}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggle(service.id)}
                      disabled={isToggling}
                      className={`flex-1 flex items-center justify-center gap-2 text-xs font-semibold py-2.5 rounded-xl transition-all ${
                        connected
                          ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20'
                          : 'gradient-btn text-white'
                      } disabled:opacity-50`}
                    >
                      {isToggling
                        ? <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        : connected
                        ? <><X className="w-3.5 h-3.5" />Disconnect</>
                        : <><Zap className="w-3.5 h-3.5" />Connect</>}
                    </button>
                    <button
                      onClick={() => setExpanded(v => v === service.id ? null : service.id)}
                      className="w-9 h-9 glass-card rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground transition-all hover:border-white/15"
                      title="Details"
                    >
                      <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                    </button>
                    <a
                      href={service.docs}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 glass-card rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground transition-all hover:border-white/15"
                      title="Docs"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {connected && (
                    <div className="flex items-center gap-1.5 mt-2.5 text-[10px] text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      Connected {integrations.find(i => i.service_id === service.id)?.connected_at
                        ? new Date(integrations.find(i => i.service_id === service.id)!.connected_at!).toLocaleDateString()
                        : 'recently'}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <Plug className="w-8 h-8 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No integrations match your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
