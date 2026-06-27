/**
 * Menampilkan satu kartu ringkasan gizi dengan progress bar horizontal.
 * Props: label, consumed, target, unit, color (tailwind color name)
 */
export default function MacroCard({ label, consumed = 0, target = 0, unit = 'g', color = 'emerald', icon }) {
  const pct = target > 0 ? Math.min(Math.round((consumed / target) * 100), 100) : 0
  const over = target > 0 && consumed > target
  const remaining = target - consumed

  const colorMap = {
    emerald: { bar: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400', light: 'bg-emerald-50 dark:bg-emerald-900/20' },
    sky:     { bar: 'bg-sky-500',     text: 'text-sky-600 dark:text-sky-400',         light: 'bg-sky-50 dark:bg-sky-900/20' },
    violet:  { bar: 'bg-violet-500',  text: 'text-violet-600 dark:text-violet-400',   light: 'bg-violet-50 dark:bg-violet-900/20' },
    amber:   { bar: 'bg-amber-500',   text: 'text-amber-600 dark:text-amber-400',     light: 'bg-amber-50 dark:bg-amber-900/20' },
  }
  const c = colorMap[color] || colorMap.emerald

  return (
    <div className="card p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`text-lg leading-none p-1.5 rounded-lg ${c.light}`}>{icon}</span>
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{label}</span>
        </div>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${over ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : `${c.light} ${c.text}`}`}>
          {pct}%
        </span>
      </div>

      <div>
        <div className="flex items-end justify-between mb-1.5">
          <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            {Math.round(consumed)}<span className="text-sm font-normal text-slate-400 ml-0.5">{unit}</span>
          </span>
          <span className="text-xs text-slate-400">dari {Math.round(target)}{unit}</span>
        </div>

        {/* Progress bar */}
        <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${over ? 'bg-red-500' : c.bar}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className={`text-xs font-medium ${over ? 'text-red-500 dark:text-red-400' : 'text-slate-500 dark:text-slate-400'}`}>
        {over
          ? `⚠ Melebihi target ${Math.abs(Math.round(remaining))}${unit}`
          : `Sisa ${Math.round(remaining)}${unit}`}
      </div>
    </div>
  )
}
