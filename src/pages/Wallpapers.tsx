import { useState } from 'react';
import { Image as ImageIcon, Check, Sparkles, Palette, RefreshCw } from 'lucide-react';
import { useBgStore, BgTheme } from '@/stores/backgroundStore';
import { toast } from 'sonner';

interface Wallpaper {
  id: string;
  url: string;
  label: string;
  category: 'nature' | 'abstract' | 'space' | 'city' | 'minimal';
}

const WALLPAPERS: Wallpaper[] = [
  { id: 'w1',  url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=75', label: 'Mountain Dawn',    category: 'nature' },
  { id: 'w2',  url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=75', label: 'Forest Light',     category: 'nature' },
  { id: 'w3',  url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&q=75', label: 'Ocean Waves',      category: 'nature' },
  { id: 'w4',  url: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&q=75', label: 'Nebula',           category: 'space' },
  { id: 'w5',  url: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&q=75', label: 'Galaxy',           category: 'space' },
  { id: 'w6',  url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=75', label: 'Earth View',       category: 'space' },
  { id: 'w7',  url: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=800&q=75', label: 'Neon Gradient',    category: 'abstract' },
  { id: 'w8',  url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=75', label: 'Aurora Flow',       category: 'abstract' },
  { id: 'w9',  url: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=800&q=75', label: 'Electric Blue',   category: 'abstract' },
  { id: 'w10', url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=75', label: 'City Lights',     category: 'city' },
  { id: 'w11', url: 'https://images.unsplash.com/photo-1514565131-fce0801e6173?w=800&q=75', label: 'Night Skyline',    category: 'city' },
  { id: 'w12', url: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=75', label: 'Urban Fog',       category: 'city' },
  { id: 'w13', url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&q=75', label: 'Clean White',     category: 'minimal' },
  { id: 'w14', url: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&q=75', label: 'Soft Waves',       category: 'minimal' },
  { id: 'w15', url: 'https://images.unsplash.com/photo-1532767153582-b1a0e5145009?w=800&q=75', label: 'Pastel Dream',   category: 'minimal' },
];

const THEME_PRESETS: { id: BgTheme; label: string; emoji: string; desc: string }[] = [
  { id: 'nebula', label: 'Nebula',  emoji: '🌌', desc: 'Deep blues & violets' },
  { id: 'aurora', label: 'Aurora',  emoji: '🌿', desc: 'Greens & teals' },
  { id: 'matrix', label: 'Matrix',  emoji: '💚', desc: 'Green cyber grid' },
  { id: 'ocean',  label: 'Ocean',   emoji: '🌊', desc: 'Blues & cyan' },
  { id: 'neon',   label: 'Neon',    emoji: '💜', desc: 'Purples & pinks' },
];

const CATEGORIES = ['all', 'nature', 'space', 'abstract', 'city', 'minimal'] as const;
type Category = typeof CATEGORIES[number];

export default function Wallpapers() {
  const { theme, setTheme } = useBgStore();
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [selectedWallpaper, setSelectedWallpaper] = useState<string | null>(null);
  const [wallpaperOverlay, setWallpaperOverlay] = useState(false);

  const filtered = activeCategory === 'all'
    ? WALLPAPERS
    : WALLPAPERS.filter(w => w.category === activeCategory);

  const handleSetWallpaper = (w: Wallpaper) => {
    setSelectedWallpaper(w.id);
    setWallpaperOverlay(true);
    // Apply wallpaper as CSS custom property on body
    document.documentElement.style.setProperty('--wallpaper-url', `url(${w.url})`);
    document.body.style.backgroundImage = `url(${w.url})`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundAttachment = 'fixed';
    toast.success(`Wallpaper "${w.label}" applied!`);
  };

  const handleClearWallpaper = () => {
    setSelectedWallpaper(null);
    setWallpaperOverlay(false);
    document.body.style.backgroundImage = '';
    toast.success('Wallpaper cleared.');
  };

  return (
    <div className="min-h-screen pt-16 pb-32">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'Syne, sans-serif' }}>
            Theme & Wallpaper Gallery
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Customize your IQMAIL visual experience</p>
        </div>

        {/* Animated theme presets */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            Animated Background Themes
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {THEME_PRESETS.map(t => (
              <button
                key={t.id}
                onClick={() => { setTheme(t.id); toast.success(`Theme "${t.label}" applied!`); }}
                className={`glass-card rounded-2xl p-4 transition-all duration-200 border-2 ${
                  theme === t.id
                    ? 'border-primary/60 bg-primary/10 shadow-[0_0_20px_rgba(59,130,246,0.2)]'
                    : 'border-transparent hover:border-white/15'
                }`}
              >
                <div className="text-2xl mb-2">{t.emoji}</div>
                <div className="text-xs font-semibold text-foreground">{t.label}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">{t.desc}</div>
                {theme === t.id && (
                  <div className="flex items-center gap-1 mt-2">
                    <Check className="w-3 h-3 text-primary" />
                    <span className="text-[9px] font-bold text-primary">ACTIVE</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Wallpaper gallery */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-primary" />
              Photo Wallpapers
            </h2>
            {selectedWallpaper && (
              <button
                onClick={handleClearWallpaper}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground glass-card px-3 py-1.5 rounded-xl transition-all"
              >
                <RefreshCw className="w-3 h-3" />
                Clear
              </button>
            )}
          </div>

          {/* Category filter */}
          <div className="flex gap-2 flex-wrap mb-4">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-xs font-medium px-3 py-1.5 rounded-full transition-all capitalize ${
                  activeCategory === cat
                    ? 'bg-primary/20 text-primary border border-primary/30'
                    : 'glass-card text-muted-foreground hover:text-foreground hover:border-white/15'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {filtered.map(w => (
              <button
                key={w.id}
                onClick={() => handleSetWallpaper(w)}
                className={`relative group rounded-2xl overflow-hidden aspect-video transition-all duration-200 border-2 ${
                  selectedWallpaper === w.id
                    ? 'border-primary/70 shadow-[0_0_20px_rgba(59,130,246,0.3)]'
                    : 'border-transparent hover:border-white/25'
                }`}
              >
                <img
                  src={w.url}
                  alt={w.label}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-2 translate-y-2 group-hover:translate-y-0 transition-transform">
                  <span className="text-[10px] font-medium text-white">{w.label}</span>
                </div>
                {selectedWallpaper === w.id && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-lg">
                    <Check className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="glass-card rounded-2xl p-4 flex items-start gap-3">
          <Palette className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-foreground">Pro Tips</p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              Combine animated background themes with photo wallpapers for layered depth.
              Use the Background Manager (palette icon, top right) to add glass filters, neon glow, and blur effects on top of any wallpaper.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
