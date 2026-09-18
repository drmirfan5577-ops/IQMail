import { useState, useRef, useEffect } from 'react';
import { Star, Mail, BarChart3, Settings, Plug, LayoutDashboard, Palette, Globe, Lock, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SidebarItem {
  icon: React.ElementType;
  label: string;
  path?: string;
  color: string;
}

const LEFT_ITEMS: SidebarItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard',   path: '/dashboard',    color: 'text-violet-400' },
  { icon: Mail,            label: 'Compose',      path: '/compose',      color: 'text-blue-400' },
  { icon: BarChart3,       label: 'Analytics',    path: '/analytics',    color: 'text-amber-400' },
  { icon: Layers,          label: 'Campaigns',    path: '/dashboard',    color: 'text-cyan-400' },
  { icon: Palette,         label: 'Themes',       path: '/wallpapers',   color: 'text-pink-400' },
];

const RIGHT_ITEMS: SidebarItem[] = [
  { icon: Plug,     label: 'Integrations', path: '/integrations', color: 'text-emerald-400' },
  { icon: Globe,    label: 'World Clock',  path: '/',             color: 'text-sky-400' },
  { icon: Lock,     label: 'Admin Panel',  path: '/admin',        color: 'text-red-400' },
  { icon: Settings, label: 'Settings',     path: '/',             color: 'text-slate-400' },
  { icon: Star,     label: 'Favourites',   path: '/',             color: 'text-yellow-400' },
];

interface StarSidebarProps {
  side: 'left' | 'right';
}

export default function StarSidebar({ side }: StarSidebarProps) {
  const [open, setOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();
  const items = side === 'left' ? LEFT_ITEMS : RIGHT_ITEMS;

  // Auto-hide after 4s of inactivity
  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setOpen(false), 4000);
  };

  const handleStarClick = () => {
    const next = !open;
    setOpen(next);
    if (next) resetTimer();
    else if (timerRef.current) clearTimeout(timerRef.current);
  };

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const cornerClass = side === 'left'
    ? 'top-[62px] left-0'
    : 'top-[62px] right-0';

  const slideClass = side === 'left'
    ? `origin-left ${open ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`
    : `origin-right ${open ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`;

  const dirClass = side === 'left' ? 'left-10' : 'right-10';

  return (
    <div className={`fixed ${cornerClass} z-[55] flex items-start`}>
      {/* Star trigger button */}
      <button
        onClick={handleStarClick}
        onMouseEnter={() => open && resetTimer()}
        className={`
          w-8 h-8 flex items-center justify-center rounded-br-xl rounded-tr-xl
          transition-all duration-300
          ${open
            ? 'bg-amber-500/30 border border-amber-400/40 shadow-[0_0_12px_rgba(251,191,36,0.4)]'
            : 'bg-white/5 border border-white/10 hover:bg-amber-500/15 hover:border-amber-400/30'}
          ${side === 'right' ? 'rounded-bl-xl rounded-tl-xl rounded-br-none rounded-tr-none' : ''}
        `}
        aria-label={`${side} sidebar`}
        style={{ marginTop: 12 }}
      >
        <Star
          className={`w-4 h-4 transition-all duration-300 ${
            open ? 'fill-amber-400 text-amber-400 scale-110' : 'text-amber-300/60'
          }`}
        />
      </button>

      {/* Slide-out panel */}
      <div
        className={`
          absolute ${dirClass} top-0
          transition-all duration-300 ease-out
          ${slideClass}
        `}
        onMouseEnter={() => open && resetTimer()}
      >
        <div className="glass-card-elevated rounded-2xl shadow-2xl border border-white/[0.14] overflow-hidden py-2 min-w-[160px]">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={() => {
                  if (item.path) navigate(item.path);
                  setOpen(false);
                  if (timerRef.current) clearTimeout(timerRef.current);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.06] transition-colors duration-150 group"
              >
                <Icon className={`w-4 h-4 ${item.color} flex-shrink-0 group-hover:scale-110 transition-transform`} />
                <span className="text-xs font-medium text-foreground/80 group-hover:text-foreground whitespace-nowrap">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
