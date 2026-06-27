/**
 * Bar ringkasan kalori di bagian atas dashboard.
 * Menampilkan: Target Efektif (TDEE + olahraga), Dikonsumsi, Terbakar, dan Sisa.
 */
export default function CalorieSummaryBar({ data }) {
  if (!data || !data.macroTargets) return null

  const { tdee, caloriesBurned = 0, effectiveCalorieTarget, consumed, remaining } = data
  const effective = effectiveCalorieTarget || tdee || 0
  const consumedKal = consumed?.calories || 0
  const remainingKal = remaining?.calories ?? (effective - consumedKal)
  const pct = effective > 0 ? Math.min(Math.round((consumedKal / effective) * 100), 100) : 0
  const over = remainingKal < 0

  return (
    <div className="card px-5 py-4">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wide">Kuota Kalori Hari Ini</p>
          <p className="text-2xl font-bold text-slate-800 dark:text-white mt-0.5">
            {Math.round(effective).toLocaleString('id-ID')}
            <span className="text-sm font-normal text-slate-400 ml-1">kkal</span>
          </p>
          {caloriesBurned > 0 && (
            <p className="text-xs text-orange-500 dark:text-orange-400 mt-0.5">
              TDEE {Math.round(tdee).toLocaleString('id-ID')} + 🔥 {caloriesBurned} kkal olahraga
            </p>
          )}
        </div>

        <div className="flex gap-4 flex-wrap">
          <Stat label="Dikonsumsi" value={Math.round(consumedKal)} unit="kkal" color="text-sky-600 dark:text-sky-400" />
          {caloriesBurned > 0 && (
            <Stat label="Terbakar" value={caloriesBurned} unit="kkal" color="text-orange-500 dark:text-orange-400" icon="🔥" />
          )}
          <Stat
            label="Sisa"
            value={Math.abs(Math.round(remainingKal))}
            unit="kkal"
            color={over ? 'text-red-500 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}
            prefix={over ? '−' : '+'}
            note={over ? 'melebihi target' : 'tersisa'}
          />
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-3 w-full rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${over ? 'bg-red-500' : 'bg-emerald-500 dark:bg-emerald-400'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between mt-1.5">
        <span className="text-xs text-slate-400">{pct}% dari target harian</span>
        <span className="text-xs text-slate-400">
          {over ? `⚠ Kelebihan ${Math.abs(Math.round(remainingKal))} kkal` : `${Math.round(remainingKal)} kkal lagi`}
        </span>
      </div>
    </div>
  )
}

function Stat({ label, value, unit, color, prefix = '', icon = '', note }) {
  return (
    <div className="text-center">
      <p className={`text-lg font-bold ${color}`}>{icon}{prefix}{value.toLocaleString('id-ID')}<span className="text-xs font-normal ml-0.5">{unit}</span></p>
      <p className="text-xs text-slate-400">{note || label}</p>
    </div>
  )
}
