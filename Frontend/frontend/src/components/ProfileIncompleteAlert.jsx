import { useNavigate } from 'react-router-dom'

export default function ProfileIncompleteAlert() {
  const navigate = useNavigate()
  return (
    <div className="card p-4 border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 flex items-start gap-3">
      <span className="text-2xl mt-0.5">⚠️</span>
      <div className="flex-1">
        <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">Profil belum lengkap</p>
        <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
          Isi data fisik (usia, jenis kelamin, tinggi, berat badan) agar target TDEE dan sisa kalori dapat dihitung.
        </p>
      </div>
      <button
        onClick={() => navigate('/profile')}
        className="flex-shrink-0 text-xs font-medium px-3 py-1.5 rounded-lg bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 hover:bg-amber-300 dark:hover:bg-amber-700 transition-colors"
      >
        Lengkapi →
      </button>
    </div>
  )
}
