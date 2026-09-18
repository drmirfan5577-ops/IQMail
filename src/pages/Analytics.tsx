import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { TrendingUp, Mail, MousePointer, Users, ArrowUpRight, ArrowDownRight, BarChart3, Activity, Target } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

// Mock data generators
const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const mockTrend = () => DAYS.map(day => ({
  day,
  sent:    Math.floor(Math.random() * 80 + 20),
  opened:  Math.floor(Math.random() * 50 + 10),
  clicked: Math.floor(Math.random() * 25 + 5),
}));
const mockHourly = () => Array.from({ length: 24 }, (_, h) => ({
  hour: `${h.toString().padStart(2,'0')}:00`,
  emails: Math.floor(Math.random() * 30 + (h > 6 && h < 20 ? 15 : 2)),
}));
const PIE_DATA = [
  { name: 'Opened',  value: 68, color: '#34d399' },
  { name: 'Clicked', value: 24, color: '#60a5fa' },
  { name: 'Bounced', value: 5,  color: '#f87171' },
  { name: 'Other',   value: 3,  color: '#94a3b8' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card-elevated rounded-xl px-3 py-2.5 text-xs border border-white/[0.12] shadow-xl">
      <p className="text-foreground font-semibold mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }} className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          {p.name}: <span className="font-bold text-foreground">{p.value}</span>
        </p>
      ))}
    </div>
  );
};

export default function Analytics() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [trendData] = useState(mockTrend);
  const [hourlyData] = useState(mockHourly);
  const [totalSent, setTotalSent] = useState(0);

  useEffect(() => {
    if (!loading && !user) navigate('/signup', { replace: true });
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('email_drafts')
      .select('id', { count: 'exact' })
      .eq('user_id', user.id)
      .eq('status', 'sent')
      .then(({ count }) => setTotalSent(count ?? 0));
  }, [user]);

  if (loading) return null;

  const stats = [
    { label: 'Total Sent',    value: totalSent.toString(), change: '+12%', up: true,  icon: Mail,          color: 'text-blue-400',    bg: 'bg-blue-400/10' },
    { label: 'Open Rate',     value: '68.4%',              change: '+4.2%', up: true,  icon: TrendingUp,    color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { label: 'Click Rate',    value: '24.1%',              change: '+1.8%', up: true,  icon: MousePointer,  color: 'text-cyan-400',    bg: 'bg-cyan-400/10' },
    { label: 'Bounce Rate',   value: '1.3%',               change: '-0.4%', up: false, icon: Activity,      color: 'text-amber-400',   bg: 'bg-amber-400/10' },
    { label: 'Subscribers',   value: '0',                  change: '—',     up: true,  icon: Users,         color: 'text-violet-400',  bg: 'bg-violet-400/10' },
    { label: 'Conversions',   value: '8.7%',               change: '+2.1%', up: true,  icon: Target,        color: 'text-pink-400',    bg: 'bg-pink-400/10' },
  ];

  return (
    <div className="min-h-screen pt-16 pb-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'Syne, sans-serif' }}>
            Analytics Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Real-time email performance insights</p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 mb-8">
          {stats.map(({ label, value, change, up, icon: Icon, color, bg }) => (
            <div key={label} className="glass-card rounded-2xl p-4 hover:border-primary/15 transition-all group">
              <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center mb-3`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <div className="text-xl font-bold text-foreground" style={{ fontFamily: 'Syne, sans-serif' }}>{value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
              <div className={`flex items-center gap-1 mt-1.5 text-[10px] font-medium ${up ? 'text-emerald-400' : 'text-red-400'}`}>
                {change !== '—' && (up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />)}
                {change}
              </div>
            </div>
          ))}
        </div>

        {/* Charts row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Area chart */}
          <div className="lg:col-span-2 glass-card rounded-2xl p-5">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Email Activity (7 Days)</h3>
                <p className="text-xs text-muted-foreground">Sent · Opened · Clicked</p>
              </div>
              <BarChart3 className="w-4 h-4 text-muted-foreground" />
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={trendData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="gSent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gOpened" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gClicked" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f0abfc" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f0abfc" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="sent"    name="Sent"    stroke="#60a5fa" fill="url(#gSent)"    strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="opened"  name="Opened"  stroke="#34d399" fill="url(#gOpened)"  strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="clicked" name="Clicked" stroke="#f0abfc" fill="url(#gClicked)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Pie chart */}
          <div className="glass-card rounded-2xl p-5">
            <div className="mb-5">
              <h3 className="text-sm font-semibold text-foreground">Engagement Breakdown</h3>
              <p className="text-xs text-muted-foreground">Overall email status</p>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                  {PIE_DATA.map((e) => (
                    <Cell key={e.name} fill={e.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-1.5 mt-2">
              {PIE_DATA.map(d => (
                <div key={d.name} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.color }} />
                  <span className="text-[10px] text-muted-foreground">{d.name}</span>
                  <span className="text-[10px] font-bold text-foreground ml-auto">{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Charts row 2 */}
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Hourly Send Volume</h3>
              <p className="text-xs text-muted-foreground">Best times to send</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={hourlyData} margin={{ top: 0, right: 5, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="hour" tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false}
                interval={3} />
              <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="emails" name="Emails" fill="#60a5fa" radius={[3, 3, 0, 0]} opacity={0.8} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
