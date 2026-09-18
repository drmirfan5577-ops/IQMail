import { Link } from 'react-router-dom';
import { Mail, Zap, Shield, BarChart3, ArrowRight, ChevronRight, Star } from 'lucide-react';
const heroImg = 'https://images.unsplash.com/photo-1557200134-90327ee9fafa?w=1600&h=900&fit=crop&q=80&auto=format';
import FeatureCard from '@/components/features/FeatureCard';
import StatBadge from '@/components/features/StatBadge';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImg}
            alt="IQMAIL background"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/30 to-background" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-1.5 mb-8 text-xs font-medium text-accent border border-accent/20">
            <Zap className="w-3.5 h-3.5" />
            <span>Intelligent Email Automation Platform</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-foreground leading-tight mb-6" style={{ fontFamily: 'Syne, sans-serif' }}>
            Your Core{' '}
            <span className="gradient-text">Social &</span>
            <br />
            <span className="gradient-text">Digital</span> Partner
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10">
            IQMAIL automates your email communications so you can focus on what matters.
            Send smarter, reach further, grow faster — all from one intelligent platform.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {user ? (
              <Link
                to="/dashboard"
                className="gradient-btn text-white font-semibold px-8 py-4 rounded-xl flex items-center gap-2.5 text-sm w-full sm:w-auto justify-center"
              >
                Go to Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <Link
                to="/signup"
                className="gradient-btn text-white font-semibold px-8 py-4 rounded-xl flex items-center gap-2.5 text-sm w-full sm:w-auto justify-center"
              >
                Start for Free <ArrowRight className="w-4 h-4" />
              </Link>
            )}
            <button className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-4 py-4">
              See how it works <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-1.5 mt-8 text-xs text-muted-foreground">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            ))}
            <span className="ml-1">Trusted by 10,000+ professionals worldwide</span>
          </div>
        </div>
      </section>

      {/* Stats section */}
      <section className="py-16 border-y border-white/[0.06]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card rounded-2xl px-8 py-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatBadge value="10K+" label="Active Users" />
            <StatBadge value="98.7%" label="Deliverability" />
            <StatBadge value="2.4M+" label="Emails Sent" />
            <StatBadge value="< 2s" label="Avg. Send Time" />
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-4xl font-bold text-foreground mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>
              Everything you need to <span className="gradient-text">scale</span>
            </h2>
            <p className="text-muted-foreground text-sm max-w-xl mx-auto leading-relaxed">
              From automated welcome sequences to behavioral triggers — IQMAIL covers every touchpoint in your customer journey.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FeatureCard
              icon={Mail}
              title="Automated Welcome Sequences"
              description="Instantly send personalized welcome emails the moment someone signs up. No delay, no missed opportunities."
              accent
            />
            <FeatureCard
              icon={Zap}
              title="Behavioral Triggers"
              description="Send the right message at the right moment based on user actions, preferences, and engagement signals."
            />
            <FeatureCard
              icon={BarChart3}
              title="Real-time Analytics"
              description="Track open rates, click-throughs, and conversions in a live dashboard. Know what's working instantly."
            />
            <FeatureCard
              icon={Shield}
              title="Enterprise-Grade Security"
              description="SOC2-compliant infrastructure with end-to-end encryption. Your data stays yours, always."
            />
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="glass-card-elevated rounded-3xl p-10 sm:p-14 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 pointer-events-none" />
            <div className="relative z-10">
              <div className="w-14 h-14 gradient-btn rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                <Mail className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl sm:text-4xl font-bold text-foreground mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>
                Ready to automate your<br />
                <span className="gradient-text">email strategy?</span>
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-8 max-w-md mx-auto">
                Join thousands of professionals using IQMAIL to build better relationships through intelligent automation.
              </p>
              {user ? (
                <Link
                  to="/dashboard"
                  className="gradient-btn text-white font-semibold px-10 py-4 rounded-xl inline-flex items-center gap-2.5 text-sm"
                >
                  Open Dashboard <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <Link
                  to="/signup"
                  className="gradient-btn text-white font-semibold px-10 py-4 rounded-xl inline-flex items-center gap-2.5 text-sm"
                >
                  Create Free Account <ArrowRight className="w-4 h-4" />
                </Link>
              )}
              <p className="text-xs text-muted-foreground mt-4">No credit card required · Setup in 60 seconds</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md gradient-btn flex items-center justify-center">
              <Mail className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-bold gradient-text" style={{ fontFamily: 'Syne, sans-serif' }}>IQMAIL</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 IQMAIL. Your Core Social & Digital Partner.</p>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <span className="cursor-pointer hover:text-foreground transition-colors">Privacy</span>
            <span className="cursor-pointer hover:text-foreground transition-colors">Terms</span>
            <span className="cursor-pointer hover:text-foreground transition-colors">Contact</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
