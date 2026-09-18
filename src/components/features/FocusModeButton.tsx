import { EyeOff, Eye } from 'lucide-react';
import { useBgStore } from '@/stores/backgroundStore';

export default function FocusModeButton() {
  const { focusMode, setFocusMode } = useBgStore();

  return (
    <button
      onClick={() => setFocusMode(!focusMode)}
      className={`fixed top-20 right-16 z-[60] w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 shadow-lg border ${
        focusMode
          ? 'bg-primary/20 border-primary/40 text-primary'
          : 'glass-card-elevated border-white/[0.12] text-muted-foreground hover:text-foreground hover:border-primary/20'
      }`}
      aria-label={focusMode ? 'Disable Focus Mode' : 'Enable Focus Mode'}
      title={focusMode ? 'Exit Focus Mode' : 'Focus Mode'}
    >
      {focusMode ? <Eye className="w-4 h-4" style={{ width: 17, height: 17 }} /> : <EyeOff className="w-4 h-4" style={{ width: 17, height: 17 }} />}
    </button>
  );
}
