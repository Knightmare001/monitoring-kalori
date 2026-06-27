import { useState, useEffect, useRef, useCallback } from "react";
import { Activity, Flame, Search, Check, Trash2, Timer } from "lucide-react";
import api from "../api/axios";
import Toast from "./Toast";

export default function ActivityTracker({ onSaved }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggs] = useState([]);
  const [selected, setSelected] = useState(null);
  const [duration, setDuration] = useState("");
  const [todayLogs, setTodayLogs] = useState([]);
  const [totalBurned, setTotalBurned] = useState(0);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const debounceRef = useRef(null);

  const showToast = (message, type = "success") => setToast({ message, type });

  const fetchToday = useCallback(async () => {
    try {
      const res = await api.get("/activities/logs/today");
      setTodayLogs(res.data.data.logs || []);
      setTotalBurned(res.data.data.totalCaloriesBurned || 0);
    } catch {
      /* silent */
    }
  }, []);

  useEffect(() => {
    fetchToday();
  }, [fetchToday]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) {
      setSuggs([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await api.get(`/activities/types?search=${encodeURIComponent(query)}`);
        setSuggs(res.data.data || []);
      } catch {
        setSuggs([]);
      }
    }, 350);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const selectActivity = (act) => {
    setSelected(act);
    setQuery(act.name);
    setSuggs([]);
  };

  const handleLog = async () => {
    if (!selected) return showToast("Pilih jenis olahraga terlebih dahulu.", "error");
    if (!duration || Number(duration) < 1) return showToast("Isi durasi minimal 1 menit.", "error");
    setLoading(true);
    try {
      await api.post("/activities/logs", {
        activityTypeId: selected._id,
        durationMinutes: Number(duration),
      });
      setSelected(null);
      setQuery("");
      setDuration("");
      showToast("Olahraga berhasil dicatat");
      await fetchToday();
      onSaved?.();
    } catch (err) {
      showToast(err.response?.data?.message || "Gagal mencatat olahraga.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/activities/logs/${id}`);
      await fetchToday();
      onSaved?.();
    } catch {
      /* silent */
    }
  };

  const formatTime = (d) => new Date(d).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

  return (
    <>
      <div className="card p-5 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="section-title mb-0 flex items-center gap-2">
            <Activity size={16} className="text-orange-500" strokeWidth={2} />
            Aktivitas Olahraga
          </h2>
          {totalBurned > 0 && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800 flex items-center gap-1">
              <Flame size={11} strokeWidth={2} />
              {totalBurned} kkal terbakar
            </span>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" strokeWidth={2} />
            <input
              className="input-field pl-8"
              placeholder="Cari olahraga (lari, renang, yoga...)"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (!e.target.value) setSelected(null);
              }}
            />
            {selected && (
              <Check
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500"
                strokeWidth={2.5}
              />
            )}
          </div>

          {/* Dropdown suggestions */}
          {suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 z-20 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg overflow-hidden max-h-48 overflow-y-auto">
              {suggestions.map((act) => (
                <button
                  key={act._id}
                  className="w-full text-left px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  onClick={() => selectActivity(act)}
                >
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{act.name}</p>
                  <p className="text-xs text-slate-400">
                    {act.category} · MET {act.metValue}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Duration + log button */}
        {selected && (
          <div className="flex gap-2 items-center p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
            <div className="flex-1">
              <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">{selected.name}</p>
              <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70">
                MET {selected.metValue} · {selected.category}
              </p>
            </div>
            <div className="relative">
              <Timer size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="number"
                min="1"
                className="input-field w-28 pl-7 text-center"
                placeholder="Menit"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
            <button onClick={handleLog} className="btn-primary text-sm whitespace-nowrap" disabled={loading}>
              {loading ? "..." : "Catat"}
            </button>
          </div>
        )}

        {/* Today's logs */}
        {todayLogs.length > 0 ? (
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
              Olahraga hari ini
            </p>
            <div className="flex flex-col gap-1.5 max-h-44 overflow-y-auto pr-1">
              {todayLogs.map((log) => (
                <div
                  key={log._id}
                  className="flex items-center justify-between bg-slate-50 dark:bg-slate-900 rounded-xl px-3 py-2 gap-2"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
                      {log.snapshot?.name || log.activityTypeId?.name}
                    </p>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      {log.durationMinutes} menit
                      <span className="text-slate-200 dark:text-slate-700">·</span>
                      <Flame size={10} className="text-orange-400" />
                      {log.caloriesBurned} kkal
                      <span className="text-slate-200 dark:text-slate-700">·</span>
                      {formatTime(log.date)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(log._id)}
                    className="flex-shrink-0 text-slate-300 hover:text-red-500 dark:text-slate-600 dark:hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-400 text-center py-2">Belum ada olahraga yang dicatat hari ini.</p>
        )}

        {/* Catatan Kaki (Disclaimer) Referensi MET Standar Kompendium */}
        <div className="border-t border-slate-100 dark:border-slate-800/60 pt-3 mt-1">
          <p className="text-[11px] text-slate-400 dark:text-slate-500 italic text-center leading-relaxed">
            * Perhitungan kalori olahraga merupakan estimasi menggunakan nilai MET (Metabolic Equivalent of Task)
            berdasarkan 2011 Compendium of Physical Activities.
          </p>
        </div>
      </div>

      {/* Toast notification */}
      {toast && <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />}
    </>
  );
}
