import { LucideIcon } from 'lucide-react';

interface Props {
  icon: LucideIcon;
  title: string;
  description: string;
  accent?: boolean;
}

const FeatureCard = ({ icon: Icon, title, description, accent = false }: Props) => (
  <div className={`glass-card rounded-2xl p-6 flex gap-4 group hover:border-primary/20 transition-all duration-300 ${accent ? 'glass-card-elevated animate-pulse-glow' : ''}`}>
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
      accent ? 'gradient-btn' : 'bg-primary/10'
    }`}>
      <Icon className={`w-5 h-5 ${accent ? 'text-white' : 'text-primary'}`} />
    </div>
    <div>
      <h3 className="font-semibold text-sm text-foreground mb-1">{title}</h3>
      <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
    </div>
  </div>
);

export default FeatureCard;
