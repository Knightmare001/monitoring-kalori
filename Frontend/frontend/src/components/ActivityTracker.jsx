import { useState, useEffect, useRef, useCallback } from 'react'
import api from '../api/axios'

export default function ActivityTracker({ onSaved }) {
  const [query, setQuery]         = useState('')
  const [suggestions, setSuggs]   = useState([])
  const [selected, setSelected]   = useState(null)
  const [duration, setDuration]   = useState('')
  const [todayLogs, setTodayLogs] = useState([])
  const [totalBurned, setTotalBurned] = useState(0)
  const [loading, setLoading]     = useState(false)
  const [msg, setMsg]             = useState(null)
  const debounceRef = useRef(null)

  const fetchToday = useCallback(async () => {
    try {
      const res = await api.get('/activities/logs/today')
      setTodayLogs(res.data.data.logs || [])
      setTotalBurned(res.data.data.totalCaloriesBurned || 0)
    } catch { /* silent */ }
  }, [])

  useEffect(() => { fetchToday() }, [fetchToday])

  // Debounce search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!query.trim()) { setSuggs([]); return }
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await api.get(`/activities/types?search=${encodeURIComponent(query)}`)
        setSuggs(res.data.data || [])
      } catch { setSuggs([]) }
    }, 350)
    return () => clearTimeout(debounceRef.current)
  }, [query])

  const selectActivity = (act) => {
    setSelected(act)
    setQuery(act.name)
    setSuggs([])
  }

  const handleLog = async () => {
    if (!selected) return setMsg({ type: 'error', text: 'Pilih jenis olahraga terlebih dahulu.' })
    if (!duration || Number(duration) < 1) return setMsg({ type: 'error', text: 'Isi durasi minimal 1 menit.' })
    setLoading(true)
    setMsg(null)
    try {
      await api.post('/activities/logs', {
        activityTypeId: selected._id,
        durationMinutes: Number(duration),
      })
      setSelected(null)
      setQuery('')
      setDuration('')
      setMsg({ type: 'success', text: 'Olahraga berhasil dicatat!' })
      await fetchToday()
      onSaved?.()
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Gagal mencatat olahraga.' })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/activities/logs/${id}`)
      await fetchToday()
      onSaved?.()
    } catch { /* silent */ }
  }

  const formatTime = (d) => new Date(d).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="card p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="section-title mb-0">🏃 Aktivitas Olahraga</h2>
        {totalBurned > 0 && (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800">
            🔥 {totalBurned} kkal terbakar
          </span>
        )}
      </div>

      {msg && (
        <div className={`text-sm px-3 py-2 rounded-xl border ${msg.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400' : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400'}`}>
          {msg.text}
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
          <input
            className="input-field pl-8"
            placeholder="Cari olahraga (lari, renang, yoga...)"
            value={query}
            onChange={(e) => { setQuery(e.target.value); if (!e.target.value) setSelected(null) }}
          />
          {selected && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500 text-sm">✓</span>
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
                <p className="text-xs text-slate-400">{act.category} · MET {act.metValue}</p>
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
            <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70">MET {selected.metValue} · {selected.category}</p>
          </div>
          <input
            type="number"
            min="1"
            className="input-field w-24 text-center"
            placeholder="Menit"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
          <button onClick={handleLog} className="btn-primary text-sm whitespace-nowrap" disabled={loading}>
            {loading ? '...' : 'Catat'}
          </button>
        </div>
      )}

      {/* Today's activity logs */}
      {todayLogs.length > 0 ? (
        <div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Olahraga hari ini</p>
          <div className="flex flex-col gap-1.5 max-h-44 overflow-y-auto pr-1">
            {todayLogs.map((log) => (
              <div key={log._id} className="flex items-center justify-between bg-slate-50 dark:bg-slate-900 rounded-xl px-3 py-2 gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
                    {log.snapshot?.name || log.activityTypeId?.name}
                  </p>
                  <p className="text-xs text-slate-400">
                    {log.durationMinutes} menit · 🔥 {log.caloriesBurned} kkal · {formatTime(log.date)}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(log._id)}
                  className="flex-shrink-0 text-slate-300 hover:text-red-500 dark:text-slate-600 dark:hover:text-red-400 transition-colors text-lg leading-none"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-sm text-slate-400 text-center py-2">Belum ada olahraga yang dicatat hari ini.</p>
      )}
    </div>
  )
}
