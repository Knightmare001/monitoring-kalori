import { useState, useEffect, useCallback } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import api from "../api/axios";

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short" });
};

// Custom tooltip untuk chart
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 shadow-lg text-sm">
      <p className="font-semibold text-slate-700 dark:text-slate-200">{label}</p>
      <p className="text-emerald-600 dark:text-emerald-400 font-bold">{payload[0].value} kg</p>
    </div>
  );
};

export default function WeightTrackerModule() {
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({ weight: "", note: "", recordedAt: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const fetchHistory = useCallback(async () => {
    try {
      const res = await api.get("/weight-tracker?limit=30");
      setRecords(res.data.data.records || []);
    } catch {
      /* silent */
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.weight || Number(form.weight) <= 0) {
      return setMsg({ type: "error", text: "Masukkan berat badan yang valid." });
    }
    setLoading(true);
    setMsg(null);
    try {
      await api.post("/weight-tracker", {
        weight: Number(form.weight),
        note: form.note,
        recordedAt: form.recordedAt || undefined,
      });
      setForm({ weight: "", note: "", recordedAt: "" });
      setMsg({ type: "success", text: "Berat badan berhasil dicatat!" });
      await fetchHistory();
    } catch (err) {
      setMsg({ type: "error", text: err.response?.data?.message || "Gagal menyimpan." });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/weight-tracker/${id}`);
      await fetchHistory();
    } catch {
      /* silent */
    }
  };

  const chartData = records.map((r) => ({
    date: formatDate(r.recordedAt),
    weight: r.weight,
    id: r._id,
  }));

  const weights = records.map((r) => r.weight);
  const latest = weights[weights.length - 1];
  const first = weights[0];
  const diff = latest != null && first != null ? latest - first : null;
  const minW = weights.length ? Math.min(...weights) : null;
  const maxW = weights.length ? Math.max(...weights) : null;

  return (
    // Menambahkan class dasar bg-white dan dark:bg-slate-900 agar modul ini
    // memiliki warna card kontainer yang seragam dan solid di mana pun dia dipasang
    <div className="card p-5 flex flex-col gap-5">
      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
        ⚖️ Progres Berat Badan
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Form Input ── */}
        <div className="flex flex-col gap-4">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Catat Berat Badan
          </p>

          {msg && (
            <div
              className={`text-sm px-3 py-2 rounded-xl border ${
                msg.type === "success"
                  ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-400"
                  : "bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800/60 text-red-600 dark:text-red-400"
              }`}
            >
              {msg.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Berat Badan (kg) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                step="0.1"
                min="1"
                className="input-field w-full bg-slate-50 border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
                placeholder="Contoh: 63.5"
                value={form.weight}
                onChange={(e) => setForm({ ...form, weight: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Tanggal <span className="text-slate-400 text-xs">(kosongkan = sekarang)</span>
              </label>
              <input
                type="date"
                className="input-field w-full bg-slate-50 border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
                value={form.recordedAt}
                max={new Date().toISOString().split("T")[0]}
                onChange={(e) => setForm({ ...form, recordedAt: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Catatan <span className="text-slate-400 text-xs">(opsional)</span>
              </label>
              <input
                type="text"
                className="input-field w-full bg-slate-50 border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
                placeholder="Sebelum makan, setelah olahraga..."
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl shadow-md shadow-emerald-900/10 transition-colors"
              disabled={loading}
            >
              {loading ? "Menyimpan..." : "+ Simpan Berat"}
            </button>
          </form>

          {/* Stat ringkas - Menggunakan bg-slate-50 (light) dan bg-slate-950 (dark) untuk kontras kedalaman */}
          {records.length >= 2 && (
            <div className="grid grid-cols-3 gap-2 mt-1">
              {[
                { label: "Terendah", val: `${minW} kg`, color: "text-sky-600 dark:text-sky-400" },
                { label: "Tertinggi", val: `${maxW} kg`, color: "text-orange-500 dark:text-orange-400" },
                {
                  label: "Perubahan",
                  val: diff !== null ? `${diff > 0 ? "+" : ""}${diff.toFixed(1)} kg` : "-",
                  color:
                    diff > 0 ? "text-red-500" : diff < 0 ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500",
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/50 rounded-xl p-2.5 text-center"
                >
                  <p className={`text-sm font-bold ${s.color}`}>{s.val}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Daftar riwayat terbaru */}
          {records.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                Riwayat Terbaru
              </p>
              <div className="flex flex-col gap-1.5 max-h-40 overflow-y-auto pr-1">
                {[...records]
                  .reverse()
                  .slice(0, 8)
                  .map((r) => (
                    <div
                      key={r._id}
                      className="flex items-center justify-between bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/40 rounded-xl px-3 py-2"
                    >
                      <div>
                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">{r.weight} kg</span>
                        {r.note && <span className="ml-2 text-xs text-slate-400 italic">{r.note}</span>}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">{formatDate(r.recordedAt)}</span>
                        <button
                          onClick={() => handleDelete(r._id)}
                          className="text-slate-300 hover:text-red-500 dark:text-slate-600 dark:hover:text-red-400 transition-colors text-lg leading-none"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Line Chart ── */}
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Grafik Tren Berat Badan
            <span className="ml-2 text-xs text-slate-400 font-normal">({records.length} catatan)</span>
          </p>

          {chartData.length >= 2 ? (
            <div className="h-64 w-full bg-slate-50/50 dark:bg-slate-950/30 border border-slate-100 dark:border-slate-800/50 rounded-2xl p-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 15, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10, fill: "currentColor" }}
                    className="text-slate-400 dark:text-slate-500"
                    tickLine={false}
                    axisLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: "currentColor" }}
                    className="text-slate-400 dark:text-slate-500"
                    tickLine={false}
                    axisLine={false}
                    domain={["dataMin - 1", "dataMax + 1"]}
                    unit="kg"
                  />
                  <Tooltip content={<CustomTooltip />} />
                  {weights.length > 0 && (
                    <ReferenceLine
                      y={Math.round((weights.reduce((a, b) => a + b, 0) / weights.length) * 10) / 10}
                      stroke="rgba(16,185,129,0.3)"
                      strokeDasharray="4 3"
                      label={{
                        value: "rata-rata",
                        position: "insideTopRight",
                        fontSize: 10,
                        fill: "rgba(16,185,129,0.5)",
                      }}
                    />
                  )}
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="#10B981"
                    strokeWidth={2.5}
                    dot={{ fill: "#10B981", r: 3.5, strokeWidth: 0 }}
                    activeDot={{ r: 5, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-center gap-2 bg-slate-50 dark:bg-slate-950 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800">
              <span className="text-3xl">📉</span>
              <p className="text-sm text-slate-400 px-4">
                {records.length === 0
                  ? "Belum ada data. Mulai catat berat badan untuk melihat grafik."
                  : "Butuh minimal 2 catatan untuk menampilkan grafik."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
