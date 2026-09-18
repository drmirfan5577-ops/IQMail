import { Mail, CheckCircle2 } from 'lucide-react';
import { User } from '@/types';

interface Props {
  user: User;
}

const WelcomeEmailPreview = ({ user }: Props) => {
  const formattedDate = new Date(user.createdAt).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="glass-card rounded-2xl overflow-hidden border border-white/10">
      {/* Email client header */}
      <div className="bg-white/5 px-5 py-3 border-b border-white/10 flex items-center gap-3">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-400/60" />
          <span className="w-3 h-3 rounded-full bg-amber-400/60" />
          <span className="w-3 h-3 rounded-full bg-emerald-400/60" />
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Mail className="w-3.5 h-3.5" />
          <span>Welcome to IQMAIL – Your Core Social & Digital Partner</span>
        </div>
      </div>

      {/* Email content */}
      <div className="p-6 sm:p-8">
        {/* From header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
          <div className="w-9 h-9 rounded-full gradient-btn flex items-center justify-center flex-shrink-0">
            <Mail className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-semibold text-foreground">IQMAIL Team</div>
            <div className="text-xs text-muted-foreground">noreply@iqmail.app → {user.email}</div>
          </div>
          <div className="ml-auto text-xs text-muted-foreground hidden sm:block">{formattedDate}</div>
        </div>

        {/* Body */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: 'Syne, sans-serif' }}>
            Welcome to IQMAIL, {user.fullName.split(' ')[0]}! 🎉
          </h2>

          <p className="text-sm text-muted-foreground leading-relaxed">
            You've taken the first step toward transforming your digital communications. Your IQMAIL account
            is now active and ready to power your email automation journey.
          </p>

          <div className="glass-card rounded-xl p-4 space-y-2.5 border border-white/[0.06]">
            <p className="text-xs font-semibold text-foreground/70 uppercase tracking-wider mb-3">What's next</p>
            {[
              'Complete your sender profile',
              'Create your first automation sequence',
              'Import your contact list',
              'Launch your first campaign',
            ].map((item) => (
              <div key={item} className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="text-sm text-foreground/80">{item}</span>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <button className="gradient-btn text-white text-sm font-semibold px-6 py-3 rounded-xl">
              Get Started Now →
            </button>
          </div>

          <p className="text-xs text-muted-foreground pt-2 border-t border-white/10">
            IQMAIL · Your Core Social & Digital Partner · Unsubscribe
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeEmailPreview;
