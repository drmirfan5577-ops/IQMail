import { useState, useEffect } from 'react';
import { Clock, ChevronDown, ChevronUp } from 'lucide-react';

// Hijri date calculation (simplified Islamic calendar algorithm)
function toHijri(date: Date): { year: number; month: number; day: number; monthName: string } {
  const HIJRI_MONTHS = [
    'Muharram','Safar','Rabi al-Awwal','Rabi al-Thani',
    'Jumada al-Awwal','Jumada al-Thani','Rajab','Shaban',
    'Ramadan','Shawwal','Dhul Qadah','Dhul Hijjah'
  ];
  // Julian Day Number
  const jdn = Math.floor((date.getTime() / 86400000) + 2440587.5);
  const l = jdn - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  const l2 = l - 10631 * n + 354;
  const j = Math.floor((10985 - l2) / 5316) * Math.floor((50 * l2) / 17719)
    + Math.floor(l2 / 5670) * Math.floor((43 * l2) / 15238);
  const l3 = l2 - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50)
    - Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
  const month = Math.floor((24 * l3) / 709);
  const day = l3 - Math.floor((709 * month) / 24);
  const year = 30 * n + j - 30;
  return { year, month, day, monthName: HIJRI_MONTHS[month - 1] };
}

// Aeswee calendar: a fictional aesthetic variant — we label it as "Aeswee" for display
// Using Gregorian base with custom era offset (year - 579) and renamed months
const AESWEE_MONTHS = [
  'Solaris','Lunara','Vernal','Azura','Floryn','Solstice',
  'Aurelius','Harvest','Ember','Frost','Crystallis','Luminae'
];
function toAeswee(date: Date) {
  return {
    day: date.getDate(),
    month: date.getMonth() + 1,
    year: date.getFullYear() - 579,
    monthName: AESWEE_MONTHS[date.getMonth()],
  };
}

const TIME_ZONES = [
  { label: 'UTC',     tz: 'UTC' },
  { label: 'NY',      tz: 'America/New_York' },
  { label: 'London',  tz: 'Europe/London' },
  { label: 'Dubai',   tz: 'Asia/Dubai' },
  { label: 'Karachi', tz: 'Asia/Karachi' },
  { label: 'Tokyo',   tz: 'Asia/Tokyo' },
];

export default function WorldClock() {
  const [now, setNow] = useState(new Date());
  const [expanded, setExpanded] = useState(false);
  const [tzIdx, setTzIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const tz = TIME_ZONES[tzIdx];
  const timeStr = now.toLocaleTimeString('en-US', {
    timeZone: tz.tz,
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false,
  });
  const dateStr = now.toLocaleDateString('en-US', {
    timeZone: tz.tz,
    month: 'short', day: 'numeric', year: 'numeric',
  });

  const hijri = toHijri(now);
  const aeswee = toAeswee(now);

  return (
    <div className="fixed bottom-24 right-4 z-[55]">
      {/* Compact clock */}
      <div
        className="glass-card-elevated rounded-xl border border-white/[0.12] shadow-lg cursor-pointer select-none"
        onClick={() => setExpanded(v => !v)}
      >
        <div className="flex items-center gap-2 px-3 py-1.5">
          <Clock className="w-3 h-3 text-cyan-400 flex-shrink-0" />
          <span className="text-[11px] font-mono font-bold text-foreground tracking-wider">{timeStr}</span>
          <span className="text-[9px] text-muted-foreground font-medium">{tz.label}</span>
          {expanded
            ? <ChevronDown className="w-3 h-3 text-muted-foreground" />
            : <ChevronUp className="w-3 h-3 text-muted-foreground" />}
        </div>
      </div>

      {/* Expanded panel */}
      {expanded && (
        <div className="absolute bottom-full right-0 mb-2 glass-card-elevated rounded-2xl border border-white/[0.14] shadow-2xl p-3 w-52 space-y-3">
          {/* Timezone selector */}
          <div className="grid grid-cols-3 gap-1">
            {TIME_ZONES.map((z, i) => (
              <button
                key={z.tz}
                onClick={() => setTzIdx(i)}
                className={`text-[9px] font-medium py-1 px-1.5 rounded-lg transition-all ${
                  tzIdx === i
                    ? 'bg-primary/20 text-primary border border-primary/30'
                    : 'bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10'
                }`}
              >
                {z.label}
              </button>
            ))}
          </div>

          {/* Main time */}
          <div className="text-center border-b border-white/10 pb-3">
            <div className="text-2xl font-mono font-bold text-foreground tracking-widest">{timeStr}</div>
            <div className="text-[10px] text-muted-foreground mt-0.5">{dateStr} · {tz.label}</div>
          </div>

          {/* Hijri calendar */}
          <div className="space-y-1">
            <div className="text-[9px] font-semibold text-amber-400 uppercase tracking-wider">Hijri Calendar</div>
            <div className="text-[11px] text-foreground font-medium">
              {hijri.day} {hijri.monthName} {hijri.year} AH
            </div>
          </div>

          {/* Aeswee calendar */}
          <div className="space-y-1">
            <div className="text-[9px] font-semibold text-violet-400 uppercase tracking-wider">Aeswee Calendar</div>
            <div className="text-[11px] text-foreground font-medium">
              {aeswee.day} {aeswee.monthName} {aeswee.year} AE
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
