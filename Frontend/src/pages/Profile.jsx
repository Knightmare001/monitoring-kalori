import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Save } from 'lucide-react'
import api from '../api/axios'
import Navbar from '../components/Navbar'

const ACTIVITY_OPTIONS = [
  { value: 'sedentary',   label: 'Tidak aktif (jarang olahraga)' },
  { value: 'light',       label: 'Ringan (1–3 hari/minggu)' },
  { value: 'moderate',    label: 'Sedang (3–5 hari/minggu)' },
  { value: 'active',      label: 'Aktif (6–7 hari/minggu)' },
  { value: 'very_active', label: 'Sangat aktif (intensitas tinggi)' },
]

export default function Profile() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '', email: '', age: '', gender: '', height: '', weight: '', activityLevel: 'moderate',
  })
  const [calc, setCalc]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [msg, setMsg]         = useState(null)

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const [profileRes, calcRes] = await Promise.all([
          api.get('/users/me'),
          api.get('/calculator/my').catch(() => null),
        ])
        const u = profileRes.data.data
        setForm({
          name:          u.name          || '',
          email:         u.email         || '',
          age:           u.age           || '',
          gender:        u.gender        || '',
          height:        u.height        || '',
          weight:        u.weight        || '',
          activityLevel: u.activityLevel || 'moderate',
        })
        if (calcRes) setCalc(calcRes.data.data)
      } catch { /* silent */ }
      finally { setLoading(false) }
    }
    fetchProfile()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMsg(null)
    try {
      await api.put('/users/me', {
        name:          form.name,
        email:         form.email,
        age:           Number(form.age)    || undefined,
        gender:        form.gender         || undefined,
        height:        Number(form.height) || undefined,
        weight:        Number(form.weight) || undefined,
        activityLevel: form.activityLevel,
      })
      // Refresh kalkulasi setelah update
      const calcRes = await api.get('/calculator/my').catch(() => null)
      if (calcRes) setCalc(calcRes.data.data)
      setMsg({ type: 'success', text: 'Profil berhasil diperbarui!' })
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Gagal memperbarui profil.' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
      <Navbar />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 py-8 flex flex-col gap-5">

        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')} className="btn-secondary px-3 py-1.5 text-sm">← Kembali</button>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white">Profil Saya</h1>
        </div>

        {/* Hasil kalkulasi TDEE */}
        {calc && (
          <div className="card p-5 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-200 dark:border-emerald-800">
            <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide mb-3">
              Hasil Kalkulasi Mifflin-St Jeor
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'BMR',     val: `${calc.bmr?.toLocaleString('id-ID')} kkal` },
                { label: 'TDEE',    val: `${calc.tdee?.toLocaleString('id-ID')} kkal` },
                { label: 'Karbo',   val: `${calc.recommendedMacros?.carbs} g` },
                { label: 'Protein', val: `${calc.recommendedMacros?.protein} g` },
              ].map((s) => (
                <div key={s.label} className="bg-white dark:bg-slate-800/60 rounded-xl p-3 text-center">
                  <p className="text-base font-bold text-emerald-700 dark:text-emerald-300">{s.val}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 italic">{calc.activityLabel}</p>
          </div>
        )}

        {/* Form profil */}
        <div className="card p-6">
          {msg && (
            <div className={`mb-4 px-3 py-2.5 rounded-xl border text-sm ${
              msg.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400'
                : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400'
            }`}>
              {msg.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-700 pb-2">Informasi Akun</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nama Lengkap</label>
                <input className="input-field" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Nama lengkap" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                <input type="email" className="input-field" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="email@contoh.com" />
              </div>
            </div>

            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-700 pb-2 mt-2">Data Fisik</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Usia</label>
                <input type="number" className="input-field" value={form.age} onChange={(e) => set('age', e.target.value)} placeholder="22" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Jenis Kelamin</label>
                <select className="input-field" value={form.gender} onChange={(e) => set('gender', e.target.value)}>
                  <option value="">Pilih</option>
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tinggi (cm)</label>
                <input type="number" className="input-field" value={form.height} onChange={(e) => set('height', e.target.value)} placeholder="170" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Berat (kg)</label>
                <input type="number" step="0.1" className="input-field" value={form.weight} onChange={(e) => set('weight', e.target.value)} placeholder="65" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Level Aktivitas Fisik</label>
              <select className="input-field" value={form.activityLevel} onChange={(e) => set('activityLevel', e.target.value)}>
                {ACTIVITY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            <button type="submit" className="btn-primary w-full mt-2 flex items-center justify-center gap-2" disabled={saving}>
              <Save size={15} strokeWidth={2} />
              {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
