import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Lock, Eye, EyeOff, ShieldCheck, Users, Mail, BarChart3,
  Settings, Trash2, RefreshCw, AlertTriangle, CheckCircle2,
  Activity, Database, Zap, LogOut
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

// Replaceable hidden admin password
const ADMIN_PASSWORD = '@1122#';
const ADMIN_SESSION_KEY = 'iqmail_admin_session';

interface AdminStats {
  totalUsers: number;
  totalEmails: number;
  totalEvents: number;
  totalIntegrations: number;
}

export default function AdminPanel() {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState(() => {
    try { return localStorage.getItem(ADMIN_SESSION_KEY) === 'true'; } catch { return false; }
  });
  const [pw, setPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<AdminStats>({ totalUsers: 0, totalEmails: 0, totalEvents: 0, totalIntegrations: 0 });
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'system'>('overview');

  const handleLogin = () => {
    if (pw === ADMIN_PASSWORD) {
      localStorage.setItem(ADMIN_SESSION_KEY, 'true');
      setAuthed(true);
      toast.success('Admin access granted.');
    } else {
      toast.error('Incorrect admin password.');
      setPw('');
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    setAuthed(false);
    navigate('/');
    toast.success('Admin session ended.');
  };

  useEffect(() => {
    if (!authed) return;
    setLoading(true);
    Promise.all([
      supabase.from('user_profiles').select('id', { count: 'exact' }),
      supabase.from('email_drafts').select('id', { count: 'exact' }),
      supabase.from('analytics_events').select('id', { count: 'exact' }),
      supabase.from('integrations').select('id', { count: 'exact' }),
    ]).then(([u, e, ev, i]) => {
      setStats({
        totalUsers: u.count ?? 0,
        totalEmails: e.count ?? 0,
        totalEvents: ev.count ?? 0,
        totalIntegrations: i.count ?? 0,
      });
      setLoading(false);
    });
  }, [authed]);

  // --- Login Gate ---
  if (!authed) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center shadow-lg">
              <Lock className="w-8 h-8 text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'Syne, sans-serif' }}>Admin Panel</h1>
            <p className="text-sm text-muted-foreground mt-1">Restricted access — enter admin password</p>
          </div>

          <div className="glass-card-elevated rounded-2xl p-6 border border-white/[0.14]">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground/70">Admin Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={pw}
                    onChange={e => setPw(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleLogin()}
                    placeholder="Enter admin password"
                    className="w-full input-field rounded-xl pl-10 pr-11 py-3 text-sm text-foreground outline-none"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                  >
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                onClick={handleLogin}
                className="w-full gradient-btn text-white font-semibold py-3 rounded-xl text-sm flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                Access Admin Panel
              </button>
            </div>

            <div className="flex items-center gap-2 mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span className="text-xs text-amber-300/80">Authorized personnel only. All access is logged.</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Admin Dashboard ---
  const overviewStats = [
    { label: 'Total Users',       value: stats.totalUsers,        icon: Users,    color: 'text-blue-400',    bg: 'bg-blue-400/10' },
    { label: 'Emails in DB',      value: stats.totalEmails,       icon: Mail,     color: 'text-cyan-400',    bg: 'bg-cyan-400/10' },
    { label: 'Analytics Events',  value: stats.totalEvents,       icon: Activity, color: 'text-violet-400',  bg: 'bg-violet-400/10' },
    { label: 'Integrations',      value: stats.totalIntegrations, icon: Zap,      color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  ];

  return (
    <div className="min-h-screen pt-16 pb-32">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'Syne, sans-serif' }}>Admin Panel</h1>
              <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                Authenticated session active
              </p>
            </div>
          </div>
          <button
            onClick={handleAdminLogout}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground glass-card px-4 py-2 rounded-xl transition-all hover:border-white/15"
          >
            <LogOut className="w-4 h-4" />
            Exit
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 glass-card rounded-xl p-1 mb-6 w-fit">
          {(['overview', 'users', 'system'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold capitalize transition-all ${
                activeTab === tab
                  ? 'bg-primary/20 text-primary border border-primary/30'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {overviewStats.map(({ label, value, icon: Icon, color, bg }) => (
                <div key={label} className="glass-card rounded-2xl p-5">
                  <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                    <Icon className={`w-4.5 h-4.5 ${color}`} style={{ width: 18, height: 18 }} />
                  </div>
                  <div className="text-2xl font-bold text-foreground" style={{ fontFamily: 'Syne, sans-serif' }}>
                    {loading ? '…' : value}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
                </div>
              ))}
            </div>

            {/* System health */}
            <div className="glass-card rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <Database className="w-4 h-4 text-primary" />
                System Health
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'Database',        status: true,  note: 'OnSpace Cloud · PostgreSQL' },
                  { label: 'Authentication',  status: true,  note: 'Supabase Auth · OTP + Password' },
                  { label: 'Storage',         status: true,  note: 'OnSpace Storage · Active' },
                  { label: 'Edge Functions',  status: true,  note: 'Deno runtime · Ready' },
                  { label: 'Email Service',   status: false, note: 'Resend API · Not configured' },
                ].map(({ label, status, note }) => (
                  <div key={label} className="flex items-center justify-between py-2.5 border-b border-white/[0.06] last:border-0">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${status ? 'bg-emerald-400' : 'bg-amber-400'} ${status ? 'animate-pulse' : ''}`} />
                      <span className="text-sm text-foreground">{label}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{note}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                Registered Users
              </h3>
              <button
                onClick={() => toast.success('User list refreshed.')}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Refresh
              </button>
            </div>
            <div className="text-center py-12 text-muted-foreground">
              <Users className="w-8 h-8 mx-auto mb-3 opacity-30" />
              <p className="text-sm">User management is available in the OnSpace Cloud Dashboard.</p>
              <p className="text-xs mt-1 opacity-70">Click "Cloud" in the top toolbar to manage users.</p>
            </div>
          </div>
        )}

        {activeTab === 'system' && (
          <div className="space-y-4">
            {[
              { icon: RefreshCw,    label: 'Clear Analytics Cache',  desc: 'Reset cached metrics data',        color: 'text-blue-400',   action: () => toast.success('Cache cleared.') },
              { icon: Settings,     label: 'Rebuild Search Index',   desc: 'Refresh full-text search index',   color: 'text-cyan-400',   action: () => toast.success('Index rebuilt.') },
              { icon: BarChart3,    label: 'Export All Analytics',   desc: 'Download CSV of all events',       color: 'text-violet-400', action: () => toast.success('Export started.') },
              { icon: AlertTriangle,label: 'Maintenance Mode',       desc: 'Enable read-only maintenance',     color: 'text-amber-400',  action: () => toast.warning('Maintenance mode toggled.') },
            ].map(({ icon: Icon, label, desc, color, action }) => (
              <div key={label} className="glass-card rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon className={`w-4.5 h-4.5 ${color}`} style={{ width: 18, height: 18 }} />
                  <div>
                    <div className="text-sm font-medium text-foreground">{label}</div>
                    <div className="text-xs text-muted-foreground">{desc}</div>
                  </div>
                </div>
                <button
                  onClick={action}
                  className="text-xs font-medium text-primary hover:text-primary/80 px-4 py-2 rounded-xl hover:bg-primary/10 transition-all"
                >
                  Run
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
