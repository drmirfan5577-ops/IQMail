import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { signupSchema, SignupSchema } from '@/lib/validations';
import { supabase } from '@/lib/supabase';
import { mapSupabaseUser } from '@/contexts/AuthContext';
import PasswordStrength from '@/components/features/PasswordStrength';

const SignupForm = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
  });

  const passwordValue = watch('password', '');

  const onSubmit = async (data: SignupSchema) => {
    setIsLoading(true);

    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { full_name: data.fullName, username: data.fullName.split(' ')[0].toLowerCase() },
      },
    });

    if (error) {
      toast.error(error.message);
      setIsLoading(false);
      return;
    }

    if (authData.user) {
      toast.success('Account created! Welcome to IQMAIL.', {
        description: `Signed in as ${data.email}`,
        duration: 4000,
      });
      navigate('/dashboard');
    } else {
      toast.success('Check your email to confirm your account, then sign in.');
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {/* Full Name */}
      <div className="space-y-1.5">
        <label htmlFor="fullName" className="block text-sm font-medium text-foreground/80">Full Name</label>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
            <User className="w-4 h-4" />
          </span>
          <input
            id="fullName"
            type="text"
            autoComplete="name"
            placeholder="Jane Smith"
            className={`w-full input-field rounded-xl pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none ${errors.fullName ? 'border-red-500/60' : ''}`}
            {...register('fullName')}
          />
        </div>
        {errors.fullName && (
          <p className="flex items-center gap-1.5 text-xs text-red-400 mt-1">
            <span className="w-3.5 h-3.5 rounded-full bg-red-500/20 flex items-center justify-center text-[9px]">!</span>
            {errors.fullName.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <label htmlFor="email" className="block text-sm font-medium text-foreground/80">Email Address</label>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
            <Mail className="w-4 h-4" />
          </span>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="jane@example.com"
            className={`w-full input-field rounded-xl pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none ${errors.email ? 'border-red-500/60' : ''}`}
            {...register('email')}
          />
        </div>
        {errors.email && (
          <p className="flex items-center gap-1.5 text-xs text-red-400 mt-1">
            <span className="w-3.5 h-3.5 rounded-full bg-red-500/20 flex items-center justify-center text-[9px]">!</span>
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <label htmlFor="password" className="block text-sm font-medium text-foreground/80">Password</label>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
            <Lock className="w-4 h-4" />
          </span>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="Create a strong password"
            className={`w-full input-field rounded-xl pl-10 pr-12 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none ${errors.password ? 'border-red-500/60' : ''}`}
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.password && (
          <p className="flex items-center gap-1.5 text-xs text-red-400 mt-1">
            <span className="w-3.5 h-3.5 rounded-full bg-red-500/20 flex items-center justify-center text-[9px]">!</span>
            {errors.password.message}
          </p>
        )}
        <PasswordStrength password={passwordValue} />
      </div>

      <p className="text-xs text-muted-foreground text-center leading-relaxed">
        By creating an account, you agree to our{' '}
        <span className="text-primary cursor-pointer hover:underline">Terms of Service</span> and{' '}
        <span className="text-primary cursor-pointer hover:underline">Privacy Policy</span>.
      </p>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full gradient-btn text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2.5 text-sm disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isLoading ? (
          <><Loader2 className="w-4 h-4 animate-spin" /><span>Creating your account…</span></>
        ) : (
          <><span>Create My Account</span><ArrowRight className="w-4 h-4" /></>
        )}
      </button>
    </form>
  );
};

export default SignupForm;
