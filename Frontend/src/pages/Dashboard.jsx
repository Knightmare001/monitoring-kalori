import { useState, useEffect, useCallback } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import MacroCard from "../components/MacroCard";
import CalorieSummaryBar from "../components/CalorieSummaryBar";
import FoodLogger from "../components/FoodLogger";
import ActivityTracker from "../components/ActivityTracker";
import WeightTrackerModule from "../components/WeightTrackerModule";
import ProfileIncompleteAlert from "../components/ProfileIncompleteAlert";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Satu fungsi fetch untuk seluruh halaman — dipanggil ulang setiap ada perubahan
  const fetchSummary = useCallback(async () => {
    try {
      const res = await api.get("/dashboard/summary");
      setSummary(res.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal memuat data dasbor.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  // Hapus log makanan lalu refresh
  const handleDeleteLog = async (logId) => {
    try {
      await api.delete(`/logs/${logId}`);
      await fetchSummary();
    } catch {
      /* silent */
    }
  };

  // label saja — MacroCard memilih ikon lucide-react sendiri berdasarkan label
  const macroCards = summary
    ? [
        {
          label: "Kalori",
          consumed: summary.consumed?.calories,
          target: summary.effectiveCalorieTarget || summary.macroTargets?.calories,
          unit: "kkal",
          color: "emerald",
        },
        {
          label: "Karbohidrat",
          consumed: summary.consumed?.carbs,
          target: summary.macroTargets?.carbs,
          unit: "g",
          color: "amber",
        },
        {
          label: "Protein",
          consumed: summary.consumed?.protein,
          target: summary.macroTargets?.protein,
          unit: "g",
          color: "sky",
        },
        {
          label: "Lemak",
          consumed: summary.consumed?.fat,
          target: summary.macroTargets?.fat,
          unit: "g",
          color: "violet",
        },
      ]
    : [];

  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-slate-400">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm">Memuat data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex flex-col gap-5">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-white">
              Selamat datang, {summary?.user?.name || "Pengguna"}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 capitalize">{today}</p>
          </div>
          {summary?.bmr && (
            <div className="flex gap-3 text-center">
              <div className="bg-white dark:bg-slate-800 rounded-xl px-3 py-2 border border-slate-100 dark:border-slate-700">
                <p className="text-xs text-slate-400">Kebutuhan Kalori Harian</p>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                  {summary.tdee?.toLocaleString("id-ID")} kkal
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Error global */}
        {error && (
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
            <AlertTriangle size={15} strokeWidth={2} className="flex-shrink-0" />
            {error}
            <button onClick={fetchSummary} className="ml-auto flex items-center gap-1 underline text-xs">
              <RefreshCw size={12} />
              Coba lagi
            </button>
          </div>
        )}

        {/* Profil belum lengkap */}
        {summary && !summary.user?.profileComplete && <ProfileIncompleteAlert />}

        {/* Kalori summary bar */}
        {summary?.macroTargets && <CalorieSummaryBar data={summary} />}

        {/* 4 Macro Cards — Kalori dibuat dominan (2 kolom) dibanding 3 makro lain */}
        {summary?.macroTargets && (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            {macroCards.map((m) => (
              <div key={m.label} className={m.label === "Kalori" ? "col-span-2 lg:col-span-2" : "lg:col-span-1"}>
                <MacroCard {...m} />
              </div>
            ))}
          </div>
        )}

        {/* Main content grid: Food + Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <FoodLogger todayLogs={summary?.todayLogs || []} onSaved={fetchSummary} onDeleteLog={handleDeleteLog} />
          <ActivityTracker onSaved={fetchSummary} />
        </div>

        {/* Footer info */}
        <div className="text-center text-xs text-slate-400 dark:text-slate-600 pb-4">
          NutriTrack — Monitoring Kalori & Gizi Harian
        </div>
      </main>
    </div>
  );
}
