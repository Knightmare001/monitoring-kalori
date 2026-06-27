/**
 * Toast notification — muncul 3 detik lalu otomatis hilang.
 * Menggantikan alert box statis yang generik.
 */
import { useEffect, useState } from 'react'
import { CheckCircle, AlertCircle, X } from 'lucide-react'

export default function Toast({ message, type = 'success', onDismiss }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Trigger masuk
    const showTimer = setTimeout(() => setVisible(true), 10)
    // Auto dismiss setelah 3 detik
    const hideTimer = setTimeout(() => {
      setVisible(false)
      setTimeout(onDismiss, 300)
    }, 3000)
    return () => { clearTimeout(showTimer); clearTimeout(hideTimer) }
  }, [onDismiss])

  const isSuccess = type === 'success'

  return (
    <div
      className={`
        fixed bottom-6 right-6 z-50 flex items-center gap-3
        px-4 py-3 rounded-2xl shadow-xl border max-w-sm
        transition-all duration-300
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}
        ${isSuccess
          ? 'bg-white dark:bg-slate-800 border-emerald-200 dark:border-emerald-800'
          : 'bg-white dark:bg-slate-800 border-red-200 dark:border-red-800'}
      `}
    >
      {isSuccess
        ? <CheckCircle size={18} className="text-emerald-500 flex-shrink-0" />
        : <AlertCircle size={18} className="text-red-500 flex-shrink-0" />
      }
      <p className="text-sm font-medium text-slate-700 dark:text-slate-200 flex-1">{message}</p>
      <button
        onClick={() => { setVisible(false); setTimeout(onDismiss, 300) }}
        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
      >
        <X size={15} />
      </button>
    </div>
  )
}
