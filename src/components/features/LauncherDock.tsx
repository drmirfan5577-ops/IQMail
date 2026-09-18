import { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Mail,
  LayoutDashboard,
  Settings,
  Plug,
  BarChart3,
  Plus,
  X,
  GripVertical,
  Check,
  Palette,
  Lock,
} from 'lucide-react';
import { useBgStore } from '@/stores/backgroundStore';

interface LauncherItem {
  id: string;
  icon: React.ElementType;
  label: string;
  path?: string;
  action?: () => void;
  color: string;
  custom?: boolean;
}

const DEFAULT_LAUNCHERS: LauncherItem[] = [
  { id: 'compose',      icon: Mail,            label: 'Compose',     path: '/compose',      color: 'from-blue-500 to-cyan-500' },
  { id: 'dashboard',    icon: LayoutDashboard, label: 'Dashboard',   path: '/dashboard',    color: 'from-violet-500 to-purple-500' },
  { id: 'analytics',    icon: BarChart3,        label: 'Analytics',   path: '/analytics',    color: 'from-amber-500 to-orange-500' },
  { id: 'integrations', icon: Plug,             label: 'Integrations',path: '/integrations', color: 'from-emerald-500 to-teal-500' },
  { id: 'wallpapers',   icon: Palette,          label: 'Themes',      path: '/wallpapers',   color: 'from-pink-500 to-rose-500' },
  { id: 'admin',        icon: Lock,             label: 'Admin',       path: '/admin',        color: 'from-red-500 to-rose-600' },
];

const CUSTOM_ICON_OPTIONS = [Mail, LayoutDashboard, BarChart3, Plug, Settings];
const CUSTOM_COLORS = [
  'from-pink-500 to-rose-500',
  'from-indigo-500 to-blue-500',
  'from-teal-500 to-emerald-500',
  'from-orange-500 to-red-500',
  'from-purple-500 to-violet-500',
];

export default function LauncherDock() {
  const navigate = useNavigate();
  const location = useLocation();
  const { focusMode } = useBgStore();
  const [launchers, setLaunchers] = useState<LauncherItem[]>(DEFAULT_LAUNCHERS);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [addMode, setAddMode] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newPath, setNewPath] = useState('/');
  const [newColorIdx, setNewColorIdx] = useState(0);
  const [newIconIdx, setNewIconIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleLaunch = (item: LauncherItem) => {
    if (item.action) { item.action(); return; }
    if (item.path) navigate(item.path);
  };

  const handleAddCustom = () => {
    if (!newLabel.trim()) return;
    const NewIcon = CUSTOM_ICON_OPTIONS[newIconIdx];
    const custom: LauncherItem = {
      id: `custom_${Date.now()}`,
      icon: NewIcon,
      label: newLabel.trim(),
      path: newPath || '/',
      color: CUSTOM_COLORS[newColorIdx],
      custom: true,
    };
    setLaunchers((prev) => [...prev, custom]);
    setNewLabel('');
    setNewPath('/');
    setAddMode(false);
  };

  const handleRemove = (id: string) => {
    setLaunchers((prev) => prev.filter((l) => l.id !== id));
  };

  return (
    <div
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 transition-all duration-500"
      style={{ opacity: focusMode ? 0.25 : 1 }}
    >
      {/* Add custom launcher panel */}
      {addMode && (
        <div className="mb-3 glass-card-elevated rounded-2xl p-4 w-72 mx-auto shadow-2xl border border-white/[0.12]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-foreground">Add Launcher</span>
            <button onClick={() => setAddMode(false)} className="text-muted-foreground hover:text-foreground">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-3">
            <input
              ref={inputRef}
              type="text"
              placeholder="Label (e.g. Contacts)"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              className="w-full input-field rounded-lg px-3 py-2 text-xs text-foreground outline-none"
              maxLength={20}
              onKeyDown={(e) => e.key === 'Enter' && handleAddCustom()}
            />
            <input
              type="text"
              placeholder="Path (e.g. /dashboard)"
              value={newPath}
              onChange={(e) => setNewPath(e.target.value)}
              className="w-full input-field rounded-lg px-3 py-2 text-xs text-foreground outline-none"
            />
            <div className="flex gap-2">
              {CUSTOM_ICON_OPTIONS.map((Ic, i) => (
                <button
                  key={i}
                  onClick={() => setNewIconIdx(i)}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${newIconIdx === i ? 'bg-primary/30 ring-1 ring-primary' : 'bg-white/5 hover:bg-white/10'}`}
                >
                  <Ic className="w-3.5 h-3.5 text-foreground" />
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              {CUSTOM_COLORS.map((c, i) => (
                <button
                  key={i}
                  onClick={() => setNewColorIdx(i)}
                  className={`w-6 h-6 rounded-full bg-gradient-to-br ${c} transition-all ${newColorIdx === i ? 'ring-2 ring-white ring-offset-1 ring-offset-background scale-110' : 'hover:scale-105'}`}
                />
              ))}
            </div>
            <button
              onClick={handleAddCustom}
              disabled={!newLabel.trim()}
              className="w-full gradient-btn text-white text-xs font-semibold py-2 rounded-lg flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Check className="w-3.5 h-3.5" />
              Add Launcher
            </button>
          </div>
        </div>
      )}

      {/* Dock */}
      <div className="flex items-end gap-2 px-4 py-3 glass-card-elevated rounded-2xl shadow-2xl border border-white/[0.14]">
        {launchers.map((item) => {
          const Icon = item.icon;
          const isActive = item.path === location.pathname;
          const isHovered = hoveredId === item.id;

          return (
            <div key={item.id} className="relative flex flex-col items-center group">
              <div
                className={`absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-medium text-foreground bg-background/90 border border-white/10 px-2 py-1 rounded-lg pointer-events-none transition-all duration-150 ${
                  isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
                }`}
              >
                {item.label}
              </div>

              {editMode && item.custom && (
                <button
                  onClick={() => handleRemove(item.id)}
                  className="absolute -top-2 -right-2 w-4 h-4 bg-destructive rounded-full flex items-center justify-center z-10 shadow"
                  aria-label={`Remove ${item.label}`}
                >
                  <X className="w-2.5 h-2.5 text-white" />
                </button>
              )}

              <button
                onClick={() => handleLaunch(item)}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                aria-label={item.label}
                className={`relative w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${item.color} shadow-lg transition-all duration-200`}
                style={{
                  transform: isHovered ? 'translateY(-10px) scale(1.18)' : isActive ? 'translateY(-4px) scale(1.06)' : 'scale(1)',
                  boxShadow: isHovered ? '0 8px 32px rgba(0,0,0,0.4)' : undefined,
                }}
              >
                <Icon className="w-5 h-5 text-white" />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
                )}
              </button>
            </div>
          );
        })}

        <div className="w-px h-8 bg-white/10 mx-1" />

        <div className="flex flex-col items-center">
          <button
            onClick={() => { setAddMode((v) => !v); setEditMode(false); }}
            onMouseEnter={() => setHoveredId('add')}
            onMouseLeave={() => setHoveredId(null)}
            aria-label="Add launcher"
            className="w-12 h-12 rounded-xl border border-dashed border-white/20 flex items-center justify-center transition-all duration-200 hover:border-primary/40 hover:bg-primary/10"
            style={{ transform: hoveredId === 'add' ? 'translateY(-10px) scale(1.12)' : 'scale(1)' }}
          >
            <Plus className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="flex flex-col items-center">
          <button
            onClick={() => { setEditMode((v) => !v); setAddMode(false); }}
            onMouseEnter={() => setHoveredId('edit')}
            onMouseLeave={() => setHoveredId(null)}
            aria-label="Edit launchers"
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 hover:bg-white/5 ${editMode ? 'bg-amber-500/20 border border-amber-500/30' : 'border border-white/[0.06]'}`}
            style={{ transform: hoveredId === 'edit' ? 'translateY(-6px) scale(1.08)' : 'scale(1)' }}
          >
            <GripVertical className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
}
