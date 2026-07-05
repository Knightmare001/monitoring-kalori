/**
 * MacroCard — perbaikan:
 * 1. Ganti emoji dengan ikon lucide-react (SVG, controllable via CSS)
 * 2. Kalori dibuat "dominant" — ukuran angka lebih besar, tidak rata dengan 3 lainnya
 */
import { Zap, Wheat, Beef, Droplets } from "lucide-react";

const ICON_MAP = {
  Kalori: Zap,
  Karbohidrat: Wheat,
  Protein: Beef,
  Lemak: Droplets,
};

const colorMap = {
  emerald: {
    bar: "bg-emerald-500",
    text: "text-emerald-600 dark:text-emerald-400",
    light: "bg-emerald-50 dark:bg-emerald-900/20",
    icon: "text-emerald-500 dark:text-emerald-400",
    badge: "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300",
  },
  sky: {
    bar: "bg-sky-500",
    text: "text-sky-600 dark:text-sky-400",
    light: "bg-sky-50 dark:bg-sky-900/20",
    icon: "text-sky-500 dark:text-sky-400",
    badge: "bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300",
  },
  violet: {
    bar: "bg-violet-500",
    text: "text-violet-600 dark:text-violet-400",
    light: "bg-violet-50 dark:bg-violet-900/20",
    icon: "text-violet-500 dark:text-violet-400",
    badge: "bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300",
  },
  amber: {
    bar: "bg-amber-500",
    text: "text-amber-600 dark:text-amber-400",
    light: "bg-amber-50 dark:bg-amber-900/20",
    icon: "text-amber-500 dark:text-amber-400",
    badge: "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300",
  },
};

export default function MacroCard({ label, consumed = 0, target = 0, unit = "g", color = "emerald" }) {
  const isCalori = label === "Kalori";

  // Untuk Kalori: tidak ada konsep "batas/over" — murni jumlah yang sudah dikonsumsi
  // Untuk makro lain (karbo/protein/lemak): tetap pakai progress bar + status sisa/over seperti biasa
  const pct = !isCalori && target > 0 ? Math.min(Math.round((consumed / target) * 100), 100) : 0;
  const over = !isCalori && target > 0 && consumed > target;
  const remaining = target - consumed;
  const c = colorMap[color] || colorMap.emerald;
  const Icon = ICON_MAP[label] || Zap;

  return (
    <div className={`card flex flex-col gap-3 ${isCalori ? "p-5" : "p-4"}`}>
      {/* Header: ikon + label + badge persen (badge persen disembunyikan untuk Kalori) */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`p-1.5 rounded-lg ${c.light}`}>
            <Icon size={isCalori ? 16 : 14} className={c.icon} strokeWidth={2.2} />
          </span>
          <span className={`font-medium text-slate-600 dark:text-slate-400 ${isCalori ? "text-sm" : "text-xs"}`}>
            {label}
          </span>
        </div>
        {!isCalori && (
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              over ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400" : c.badge
            }`}
          >
            {pct}%
          </span>
        )}
      </div>

      {/* Angka utama */}
      <div>
        <div className="flex items-end justify-between mb-1.5">
          <span className={`font-bold text-slate-800 dark:text-slate-100 ${isCalori ? "text-3xl" : "text-2xl"}`}>
            {Math.round(consumed).toLocaleString("id-ID")}
            <span className="text-sm font-normal text-slate-400 ml-0.5">{unit}</span>
          </span>
          {/* Kalori tidak menampilkan "/ target" karena tidak ada batas yang ditekankan di sini */}
          {!isCalori && (
            <span className="text-xs text-slate-400">
              / {Math.round(target).toLocaleString("id-ID")}
              {unit}
            </span>
          )}
        </div>

        {/* Progress bar — disembunyikan untuk Kalori */}
        {!isCalori && (
          <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${over ? "bg-red-500" : c.bar}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        )}
      </div>

      {/* Status sisa / melebihi — disembunyikan untuk Kalori */}
      {!isCalori && (
        <p
          className={`text-xs font-medium ${over ? "text-red-500 dark:text-red-400" : "text-slate-400 dark:text-slate-500"}`}
        >
          {over
            ? `Melebihi ${Math.abs(Math.round(remaining)).toLocaleString("id-ID")}${unit}`
            : `Sisa ${Math.round(remaining).toLocaleString("id-ID")}${unit}`}
        </p>
      )}
    </div>
  );
}
