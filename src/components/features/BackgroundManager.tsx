import { useState } from 'react';
import { Palette, X, Sliders, EyeOff, Eye, ChevronRight } from 'lucide-react';
import { useBgStore, BgTheme, FilterSettings } from '@/stores/backgroundStore';

const THEMES: { id: BgTheme; label: string; colors: string[] }[] = [
  { id: 'nebula',  label: 'Nebula',  colors: ['#1d4ed8', '#7c3aed', '#0891b2'] },
  { id: 'aurora',  label: 'Aurora',  colors: ['#065f46', '#0f766e', '#6d28d9'] },
  { id: 'matrix',  label: 'Matrix',  colors: ['#14532d', '#166534', '#4ade80'] },
  { id: 'ocean',   label: 'Ocean',   colors: ['#0369a1', '#0c4a6e', '#38bdf8'] },
  { id: 'neon',    label: 'Neon',    colors: ['#86198f', '#be185d', '#f0abfc'] },
];

const TINT_PRESETS = ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#EF4444'];

interface SliderProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}
const Slider = ({ label, value, onChange, min = 0, max = 100 }: SliderProps) => (
  <div className="space-y-1.5">
    <div className="flex justify-between text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground font-medium">{value}</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-white/10 accent-primary"
    />
  </div>
);

export default function BackgroundManager() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<'themes' | 'filters'>('themes');
  const store = useBgStore();

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed top-20 right-4 z-[60] w-10 h-10 glass-card-elevated rounded-xl flex items-center justify-center hover:border-primary/30 transition-all duration-200 shadow-lg"
        aria-label="Background Manager"
        title="Background Manager"
      >
        <Palette className="w-4.5 h-4.5 text-primary" style={{ width: 18, height: 18 }} />
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed top-20 right-16 z-[60] w-72 glass-card-elevated rounded-2xl shadow-2xl border border-white/[0.12] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.08]">
            <span className="text-sm font-semibold text-foreground">Background Manager</span>
            <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg hover:bg-white/5">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-white/[0.08]">
            {(['themes', 'filters'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-2.5 text-xs font-medium capitalize transition-all ${
                  tab === t ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t === 'themes' ? 'Themes' : 'Visual Filters'}
              </button>
            ))}
          </div>

          <div className="p-4 space-y-4 max-h-80 overflow-y-auto">
            {tab === 'themes' && (
              <>
                {/* Focus mode toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {store.focusMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>Focus Mode</span>
                  </div>
                  <button
                    onClick={() => store.setFocusMode(!store.focusMode)}
                    className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${
                      store.focusMode ? 'bg-primary' : 'bg-white/10'
                    }`}
                    role="switch"
                    aria-checked={store.focusMode}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                        store.focusMode ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Theme grid */}
                <div className="grid grid-cols-1 gap-2">
                  {THEMES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => store.setTheme(t.id)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 border ${
                        store.theme === t.id
                          ? 'border-primary/40 bg-primary/10'
                          : 'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05]'
                      }`}
                    >
                      {/* Color dots */}
                      <div className="flex gap-1 flex-shrink-0">
                        {t.colors.map((c) => (
                          <span
                            key={c}
                            className="w-3 h-3 rounded-full"
                            style={{ background: c }}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-medium text-foreground flex-1 text-left">{t.label}</span>
                      {store.theme === t.id && (
                        <span className="text-[9px] font-bold text-primary bg-primary/15 px-1.5 py-0.5 rounded-full">LIVE</span>
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}

            {tab === 'filters' && (
              <>
                {/* Enable filters toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Enable Filters</span>
                  </div>
                  <button
                    onClick={() => store.setFiltersEnabled(!store.filtersEnabled)}
                    className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${
                      store.filtersEnabled ? 'bg-primary' : 'bg-white/10'
                    }`}
                    role="switch"
                    aria-checked={store.filtersEnabled}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                        store.filtersEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className={`space-y-4 transition-opacity duration-200 ${store.filtersEnabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                  <Slider label="Glass Intensity" value={store.filters.glassIntensity} onChange={(v) => store.setFilter('glassIntensity', v)} />
                  <Slider label="Blur Level" value={store.filters.blurLevel} onChange={(v) => store.setFilter('blurLevel', v)} />
                  <Slider label="Tint Opacity" value={store.filters.tintOpacity} onChange={(v) => store.setFilter('tintOpacity', v)} />
                  <Slider label="Neon Glow" value={store.filters.neonGlow} onChange={(v) => store.setFilter('neonGlow', v)} />

                  {/* Color tint picker */}
                  <div className="space-y-1.5">
                    <span className="text-xs text-muted-foreground">Color Tint</span>
                    <div className="flex gap-2 flex-wrap">
                      {TINT_PRESETS.map((c) => (
                        <button
                          key={c}
                          onClick={() => store.setFilter('colorTint', c)}
                          className={`w-6 h-6 rounded-full transition-all duration-150 ${
                            store.filters.colorTint === c ? 'ring-2 ring-white ring-offset-1 ring-offset-background scale-110' : 'hover:scale-105'
                          }`}
                          style={{ background: c }}
                          aria-label={`Color tint ${c}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
