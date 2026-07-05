import { Flame, Info, AlertTriangle } from "lucide-react";
import { useState } from "react";

export default function CalorieSummaryBar({ data }) {
  if (!data || !data.macroTargets) return null;

  const { tdee, caloriesBurned = 0, effectiveCalorieTarget, consumed, remaining } = data;
  const effective = effectiveCalorieTarget || tdee || 0;
  const consumedKal = consumed?.calories || 0;
  const remainingKal = remaining?.calories ?? effective - consumedKal;
  const pct = effective > 0 ? Math.min(Math.round((consumedKal / effective) * 100), 100) : 0;
  const over = remainingKal < 0;
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="card px-5 py-4">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
        {/* Kiri: Kalori Tersisa — sekarang jadi sorotan utama */}
        <div>
          <div className="flex items-center gap-1.5 mb-0.5">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
              {over ? "Kalori melebihi target" : "Kalori tersisa untuk dimakan"}
            </p>
            {caloriesBurned > 0 && (
              <button
                onClick={() => setShowInfo((v) => !v)}
                className="text-slate-300 hover:text-slate-500 dark:text-slate-600 dark:hover:text-slate-400 transition-colors"
                title="Lihat detail perhitungan"
              >
                <Info size={13} />
              </button>
            )}
          </div>
          <p
            className={`text-3xl font-bold tracking-tight ${over ? "text-red-500 dark:text-red-400" : "text-slate-800 dark:text-white"}`}
          >
            {over && "−"}
            {Math.abs(Math.round(remainingKal)).toLocaleString("id-ID")}
            <span className="text-base font-normal text-slate-400 ml-1">kkal</span>
          </p>

          {/* Breakdown formula — hanya muncul jika info diklik */}
          {showInfo && caloriesBurned > 0 && (
            <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/50 rounded-lg px-2.5 py-1.5 w-fit">
              <span>TDEE {Math.round(tdee).toLocaleString("id-ID")} kkal</span>
              <span className="text-slate-300 dark:text-slate-600">−</span>
              <Flame size={11} className="text-orange-400" />
              <span className="text-orange-500 dark:text-orange-400 font-medium">{caloriesBurned} kkal olahraga</span>
            </div>
          )}
        </div>

        {/* Kanan: Stats grid — Target dipindah ke sini, di samping Dikonsumsi & Terbakar */}
        <div className="flex gap-5 flex-wrap">
          <Stat
            label="Dikonsumsi"
            value={Math.round(consumedKal)}
            unit="kkal"
            colorClass="text-sky-600 dark:text-sky-400"
          />
          {caloriesBurned > 0 && (
            <Stat
              label="Terbakar"
              value={caloriesBurned}
              unit="kkal"
              colorClass="text-orange-500 dark:text-orange-400"
              icon={<Flame size={13} className="text-orange-400" />}
            />
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${over ? "bg-red-500" : "bg-emerald-500 dark:bg-emerald-400"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between mt-1.5">
        <span className="text-xs text-slate-400">{pct}% dari target</span>
        {over ? (
          <span className="text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
            <AlertTriangle size={11} />
            Kelebihan {Math.abs(Math.round(remainingKal)).toLocaleString("id-ID")} kkal
          </span>
        ) : (
          <span className="text-xs text-slate-400">{Math.round(remainingKal).toLocaleString("id-ID")} kkal lagi</span>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, unit, colorClass, prefix = "", icon }) {
  return (
    <div className="text-center min-w-[64px]">
      <p className={`text-lg font-bold ${colorClass} flex items-center justify-center gap-1`}>
        {icon}
        {prefix}
        {value.toLocaleString("id-ID")}
        <span className="text-xs font-normal text-slate-400 ml-0.5">{unit}</span>
      </p>
      <p className="text-xs text-slate-400 mt-0.5">{label}</p>
    </div>
  );
}
