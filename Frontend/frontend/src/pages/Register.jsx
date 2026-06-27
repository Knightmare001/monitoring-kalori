import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar"; // <-- Import Navbar di sini

const ACTIVITY_OPTIONS = [
  { value: "sedentary", label: "Tidak aktif (jarang olahraga)" },
  { value: "light", label: "Ringan (1–3 hari/minggu)" },
  { value: "moderate", label: "Sedang (3–5 hari/minggu)" },
  { value: "active", label: "Aktif (6–7 hari/minggu)" },
  { value: "very_active", label: "Sangat aktif (intensitas tinggi)" },
];

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
    activityLevel: "moderate",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/register", {
        ...form,
        age: Number(form.age),
        height: Number(form.height),
        weight: Number(form.weight),
      });
      navigate("/login", { state: { registered: true } });
    } catch (err) {
      setError(err.response?.data?.message || "Registrasi gagal.");
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 transition-colors">
      {/* Navbar Global Adaptif */}
      <Navbar />

      {/* Konten Utama */}
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500 dark:bg-emerald-400 mb-4 shadow-lg shadow-emerald-500/20">
              <span className="text-2xl">🥗</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">NutriTrack</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Buat akun baru</p>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-6">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step >= s ? "bg-emerald-500 dark:bg-emerald-400 text-white dark:text-slate-900" : "bg-slate-200 dark:bg-slate-700 text-slate-500"}`}
                >
                  {s}
                </div>
                <span
                  className={`text-xs ${step >= s ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-slate-400"}`}
                >
                  {s === 1 ? "Akun" : "Data Fisik"}
                </span>
                {s < 2 && <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />}
              </div>
            ))}
          </div>

          <div className="card p-6">
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-1">Informasi Akun</h2>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Nama Lengkap
                  </label>
                  <input
                    className="input-field"
                    placeholder="Nama Lengkap"
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                  <input
                    type="email"
                    className="input-field"
                    placeholder="nama@email.com"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
                  <input
                    type="password"
                    className="input-field"
                    placeholder="Min. 6 karakter"
                    value={form.password}
                    onChange={(e) => set("password", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Konfirmasi Password
                  </label>
                  <input
                    type="password"
                    className="input-field"
                    placeholder="Ulangi password"
                    value={form.confirmPassword}
                    onChange={(e) => set("confirmPassword", e.target.value)}
                    required
                  />
                </div>
                <button
                  className="btn-primary w-full mt-2"
                  onClick={() => {
                    if (!form.name || !form.email || !form.password) return setError("Semua field wajib diisi.");
                    if (form.password !== form.confirmPassword) return setError("Password tidak cocok.");
                    if (form.password.length < 6) return setError("Password minimal 6 karakter.");
                    setError("");
                    setStep(2);
                  }}
                >
                  Lanjut →
                </button>
              </div>
            )}

            {step === 2 && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-1">
                  Data Fisik <span className="text-xs font-normal text-slate-400">(untuk kalkulasi TDEE)</span>
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Usia</label>
                    <input
                      type="number"
                      className="input-field"
                      placeholder="22"
                      value={form.age}
                      onChange={(e) => set("age", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Jenis Kelamin
                    </label>
                    <select
                      className="input-field"
                      value={form.gender}
                      onChange={(e) => set("gender", e.target.value)}
                      required
                    >
                      <option value="">Pilih</option>
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Tinggi (cm)
                    </label>
                    <input
                      type="number"
                      className="input-field"
                      placeholder="170"
                      value={form.height}
                      onChange={(e) => set("height", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Berat (kg)
                    </label>
                    <input
                      type="number"
                      className="input-field"
                      placeholder="65"
                      value={form.weight}
                      onChange={(e) => set("weight", e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Level Aktivitas
                  </label>
                  <select
                    className="input-field"
                    value={form.activityLevel}
                    onChange={(e) => set("activityLevel", e.target.value)}
                  >
                    {ACTIVITY_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2 mt-2">
                  <button type="button" className="btn-secondary flex-1" onClick={() => setStep(1)}>
                    ← Kembali
                  </button>
                  <button type="submit" className="btn-primary flex-1" disabled={loading}>
                    {loading ? "Mendaftar..." : "Daftar"}
                  </button>
                </div>
              </form>
            )}

            <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-4">
              Sudah punya akun?{" "}
              <Link to="/login" className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline">
                Masuk
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
