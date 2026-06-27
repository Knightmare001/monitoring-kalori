import { useState, useEffect, useCallback } from "react";
import api from "../api/axios";

export default function FoodLogger({ todayLogs = [], onSaved, onDeleteLog }) {
  const [foods, setFoods] = useState([]);
  const [rows, setRows] = useState([{ foodId: "", serving: 1 }]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null); // { type: 'success'|'error', text }

  // Ambil semua daftar makanan (untuk dropdown)
  const fetchFoods = useCallback(async () => {
    try {
      const res = await api.get("/foods?limit=100");
      setFoods(res.data.data.foods);
    } catch {
      /* silent */
    }
  }, []);

  useEffect(() => {
    fetchFoods();
  }, [fetchFoods]);

  const addRow = () => setRows((r) => [...r, { foodId: "", serving: 1 }]);

  const removeRow = (i) => setRows((r) => r.filter((_, idx) => idx !== i));

  const updateRow = (i, key, val) => setRows((r) => r.map((row, idx) => (idx === i ? { ...row, [key]: val } : row)));

  const handleSave = async () => {
    const valid = rows.filter((r) => r.foodId && Number(r.serving) > 0);
    if (!valid.length) {
      setMsg({ type: "error", text: "Pilih minimal satu makanan dengan porsi yang valid." });
      return;
    }
    setLoading(true);
    setMsg(null);
    try {
      const payload = valid.map((r) => ({
        foodId: r.foodId,
        serving: Number(r.serving),
      }));

      // Kirim SATU request tunggal berisi seluruh Array data makanan (Bulk POST)
      await api.post("/logs", payload);
      setRows([{ foodId: "", serving: 1 }]);
      setMsg({ type: "success", text: `${valid.length} makanan berhasil dicatat!` });
      onSaved?.();
    } catch (err) {
      setMsg({ type: "error", text: err.response?.data?.message || "Gagal menyimpan log makanan." });
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="card p-5 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="section-title mb-0">🍽️ Input Makanan Hari Ini</h2>
        <span className="text-xs text-slate-400">
          {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" })}
        </span>
      </div>

      {/* Feedback */}
      {msg && (
        <div
          className={`text-sm px-3 py-2 rounded-xl border ${msg.type === "success" ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400" : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400"}`}
        >
          {msg.text}
        </div>
      )}

      {/* Bulk input rows */}
      <div className="flex flex-col gap-2">
        {rows.map((row, i) => (
          <div key={i} className="flex gap-2 items-center">
            <select
              className="input-field flex-1"
              value={row.foodId}
              onChange={(e) => updateRow(i, "foodId", e.target.value)}
            >
              <option value="">— Pilih makanan —</option>
              {foods.map((f) => (
                <option key={f._id} value={f._id}>
                  {f.name} ({f.calories} kkal/{f.servingSize}
                  {f.servingUnit})
                </option>
              ))}
            </select>
            <input
              type="number"
              min="1"
              step="10"
              className="input-field w-24"
              placeholder="Gram" // <-- Ubah dari Porsi ke Gram
              value={row.serving}
              onChange={(e) => updateRow(i, "serving", e.target.value)}
            />
            <span className="text-xs text-slate-400 whitespace-nowrap">gram</span>
            {rows.length > 1 && (
              <button
                onClick={() => removeRow(i)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-2 flex-wrap">
        <button onClick={addRow} className="btn-secondary text-sm flex items-center gap-1">
          <span>+</span> Tambah Baris
        </button>
        <button onClick={handleSave} className="btn-primary text-sm flex items-center gap-1" disabled={loading}>
          {loading ? "Menyimpan..." : "💾 Simpan Makanan"}
        </button>
      </div>

      {/* Today's logs */}
      {todayLogs.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
            Yang sudah dimakan
          </p>
          <div className="flex flex-col gap-1.5 max-h-52 overflow-y-auto pr-1">
            {todayLogs.map((log) => (
              <div
                key={log._id}
                className="flex items-center justify-between bg-slate-50 dark:bg-slate-900 rounded-xl px-3 py-2 gap-2"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
                    {log.snapshot?.name}
                  </p>
                  <p className="text-xs text-slate-400">
                    {log.serving} porsi · {Math.round(log.snapshot?.calories * log.serving)} kkal ·{" "}
                    {formatTime(log.date)}
                  </p>
                </div>
                <button
                  onClick={() => onDeleteLog?.(log._id)}
                  className="flex-shrink-0 text-slate-300 hover:text-red-500 dark:text-slate-600 dark:hover:text-red-400 transition-colors text-lg leading-none"
                  title="Hapus log"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {todayLogs.length === 0 && (
        <p className="text-sm text-slate-400 text-center py-3">Belum ada makanan yang dicatat hari ini.</p>
      )}
    </div>
  );
}
