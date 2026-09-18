import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Mail, Send, Users, BarChart3, CheckCircle2,
  ArrowUpRight, Plus, Bell, Settings, Zap,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import WelcomeEmailPreview from '@/components/features/WelcomeEmailPreview';

const quickActions = [
  { icon: Plus,     label: 'New Campaign',   path: '/compose',       color: 'text-primary bg-primary/10' },
  { icon: Users,    label: 'Integrations',   path: '/integrations',  color: 'text-accent bg-accent/10' },
  { icon: Zap,      label: 'Analytics',      path: '/analytics',     color: 'text-amber-400 bg-amber-400/10' },
  { icon: Settings, label: 'Admin Panel',    path: '/admin',         color: 'text-muted-foreground bg-white/5' },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) navigate('/', { replace: true });
  }, [user, loading, navigate]);

  if (loading) return (
    <div className="min-h-screen pt-16 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!user) return null;

  const firstName = user.fullName.split(' ')[0];
  const joinDate = new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const recentActivity = [
    { action: 'Account created', time: 'Just now', icon: CheckCircle2, status: 'success' },
    { action: 'Welcome email sent', time: '1 min ago', icon: Mail, status: 'success' },
  ];

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-accent bg-accent/10 px-2.5 py-1 rounded-full">🎉 Welcome aboard!</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground" style={{ fontFamily: 'Syne, sans-serif' }}>
              Hello, {firstName}!
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Member since {joinDate} · ID: <span className="font-mono text-xs text-foreground/50">{user.id.slice(0, 12)}…</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative glass-card rounded-xl p-2.5 hover:border-primary/20 transition-all" aria-label="Notifications">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-primary rounded-full text-[9px] flex items-center justify-center text-white font-bold">1</span>
            </button>
            <Link to="/compose" className="gradient-btn text-white text-sm font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Campaign
            </Link>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Emails Sent', value: '1', change: 'Welcome email', icon: Send, color: 'text-primary' },
            { label: 'Contacts', value: '0', change: 'Import to start', icon: Users, color: 'text-accent' },
            { label: 'Open Rate', value: '—', change: 'Awaiting data', icon: BarChart3, color: 'text-amber-400' },
            { label: 'Campaigns', value: '0', change: 'Create first', icon: Zap, color: 'text-emerald-400' },
          ].map(({ label, value, change, icon: Icon, color }) => (
            <div key={label} className="glass-card rounded-2xl p-5 hover:border-primary/15 transition-all duration-300 group">
              <div className="flex items-start justify-between mb-3">
                <Icon className={`w-5 h-5 ${color}`} />
                <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="text-2xl font-bold text-foreground mb-0.5" style={{ fontFamily: 'Syne, sans-serif' }}>{value}</div>
              <div className="text-xs font-medium text-foreground/70">{label}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{change}</div>
            </div>
          ))}
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Welcome email preview */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-foreground">Your Welcome Email</h2>
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                Delivered
              </span>
            </div>
            <WelcomeEmailPreview user={{ id: user.id, fullName: user.fullName, email: user.email, createdAt: user.createdAt }} />
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            {/* Quick actions */}
            <div>
              <h2 className="text-base font-semibold text-foreground mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map(({ icon: Icon, label, path, color }) => (
                  <Link
                    key={label}
                    to={path}
                    className="glass-card rounded-xl p-4 flex flex-col items-center gap-2 hover:border-primary/20 transition-all duration-200 group"
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color} transition-transform duration-200 group-hover:scale-110`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-medium text-foreground/80 text-center">{label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent activity */}
            <div>
              <h2 className="text-base font-semibold text-foreground mb-4">Recent Activity</h2>
              <div className="glass-card rounded-2xl divide-y divide-white/[0.06]">
                {recentActivity.map(({ action, time, icon: Icon, status }) => (
                  <div key={action} className="flex items-center gap-3 p-4">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${status === 'success' ? 'bg-emerald-500/10' : 'bg-border'}`}>
                      <Icon className={`w-4 h-4 ${status === 'success' ? 'text-emerald-400' : 'text-muted-foreground'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-foreground">{action}</div>
                      <div className="text-xs text-muted-foreground">{time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Getting started checklist */}
            <div>
              <h2 className="text-base font-semibold text-foreground mb-4">Getting Started</h2>
              <div className="glass-card rounded-2xl p-4 space-y-3">
                {[
                  { label: 'Create account', done: true },
                  { label: 'Receive welcome email', done: true },
                  { label: 'Complete profile', done: false },
                  { label: 'Import contacts', done: false },
                  { label: 'Launch first campaign', done: false },
                ].map(({ label, done }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${done ? 'bg-emerald-500/20' : 'border border-white/10'}`}>
                      {done && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                    </div>
                    <span className={`text-xs ${done ? 'text-foreground/50 line-through' : 'text-foreground/80'}`}>{label}</span>
                  </div>
                ))}
                <div className="pt-2">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                    <span>Progress</span><span>2/5</span>
                  </div>
                  <div className="h-1.5 bg-border rounded-full overflow-hidden">
                    <div className="h-full w-[40%] gradient-btn rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
