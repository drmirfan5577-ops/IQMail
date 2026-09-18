import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Zap, Shield, Star } from 'lucide-react';
import SignupForm from '@/components/features/SignupForm';
import { useAuth } from '@/contexts/AuthContext';

const Signup = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true });
  }, [user, navigate]);

  const benefits = [
    { icon: Zap, text: 'Instant welcome email automation' },
    { icon: Shield, text: 'Enterprise-grade security & compliance' },
    { icon: Star, text: 'Trusted by 10,000+ professionals' },
  ];

  return (
    <div className="min-h-screen pt-16 flex">
      {/* Left panel – branding (desktop only) */}
      <div className="hidden lg:flex flex-col justify-center flex-1 px-16 xl:px-24 bg-gradient-to-br from-primary/5 to-accent/5 border-r border-white/[0.06]">
        <div className="max-w-md">
          <div className="w-12 h-12 gradient-btn rounded-2xl flex items-center justify-center mb-8 shadow-xl animate-pulse-glow">
            <Mail className="w-6 h-6 text-white" />
          </div>

          <h2 className="text-3xl xl:text-4xl font-bold text-foreground mb-4 leading-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
            Automate your<br />
            <span className="gradient-text">email strategy</span><br />
            in minutes.
          </h2>

          <p className="text-muted-foreground text-sm leading-relaxed mb-10">
            Sign up and let IQMAIL handle the heavy lifting — from welcome sequences to behavioral campaigns.
          </p>

          <div className="space-y-4">
            {benefits.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm text-foreground/80">{text}</span>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="mt-12 glass-card rounded-2xl p-5 border border-white/[0.08]">
            <div className="flex gap-0.5 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed italic mb-3">
              "IQMAIL transformed our onboarding. Our welcome email open rates jumped from 22% to 71% in the first week."
            </p>
            <div className="flex items-center gap-2.5">
              <img
                src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=40&h=40&fit=crop&crop=face&q=80"
                alt="Sarah Chen"
                className="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <div className="text-xs font-semibold text-foreground">Sarah Chen</div>
                <div className="text-xs text-muted-foreground">Head of Growth, TechCorp</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel – form */}
      <div className="flex-1 lg:max-w-[560px] flex items-center justify-center px-4 sm:px-8 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 gradient-btn rounded-lg flex items-center justify-center">
              <Mail className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold gradient-text" style={{ fontFamily: 'Syne, sans-serif' }}>IQMAIL</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>
              Create your account
            </h1>
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>

          {/* The actual form */}
          <div className="glass-card-elevated rounded-2xl p-6 sm:p-8">
            <SignupForm />
          </div>

          {/* Security note */}
          <div className="flex items-center justify-center gap-2 mt-6 text-xs text-muted-foreground">
            <Shield className="w-3.5 h-3.5" />
            <span>256-bit SSL encryption · GDPR compliant · SOC2 certified</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
