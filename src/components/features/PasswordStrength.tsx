import { useMemo } from 'react';
import { PasswordStrength as PasswordStrengthType } from '@/types';

interface Props {
  password: string;
}

function evaluateStrength(password: string): PasswordStrengthType {
  if (!password) return 'none';
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return 'weak';
  if (score === 3) return 'fair';
  if (score === 4) return 'good';
  return 'strong';
}

const strengthConfig: Record<PasswordStrengthType, { label: string; bars: number; color: string; textColor: string }> = {
  none:   { label: '',        bars: 0, color: 'bg-border',                textColor: 'text-muted-foreground' },
  weak:   { label: 'Weak',   bars: 1, color: 'bg-red-500',               textColor: 'text-red-400' },
  fair:   { label: 'Fair',   bars: 2, color: 'bg-amber-400',             textColor: 'text-amber-400' },
  good:   { label: 'Good',   bars: 3, color: 'bg-teal-400',              textColor: 'text-teal-400' },
  strong: { label: 'Strong', bars: 4, color: 'bg-emerald-400',           textColor: 'text-emerald-400' },
};

const PasswordStrength = ({ password }: Props) => {
  const strength = useMemo(() => evaluateStrength(password), [password]);
  const config = strengthConfig[strength];

  const requirements = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'One uppercase letter (A-Z)', met: /[A-Z]/.test(password) },
    { label: 'One lowercase letter (a-z)', met: /[a-z]/.test(password) },
    { label: 'One number (0-9)', met: /[0-9]/.test(password) },
  ];

  return (
    <div className="mt-2 space-y-3">
      {/* Strength bars */}
      <div className="flex items-center gap-2">
        <div className="flex gap-1.5 flex-1">
          {[1, 2, 3, 4].map((bar) => (
            <div
              key={bar}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                strength !== 'none' && bar <= config.bars ? config.color : 'bg-border'
              }`}
            />
          ))}
        </div>
        {strength !== 'none' && (
          <span className={`text-xs font-semibold ${config.textColor} min-w-[42px] text-right`}>
            {config.label}
          </span>
        )}
      </div>

      {/* Requirements list */}
      {password.length > 0 && (
        <ul className="space-y-1">
          {requirements.map((req) => (
            <li key={req.label} className="flex items-center gap-2 text-xs">
              <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-bold transition-all duration-200 ${
                req.met ? 'bg-emerald-500/20 text-emerald-400' : 'bg-border text-muted-foreground'
              }`}>
                {req.met ? '✓' : '·'}
              </span>
              <span className={`transition-colors duration-200 ${req.met ? 'text-foreground/70' : 'text-muted-foreground'}`}>
                {req.label}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PasswordStrength;
