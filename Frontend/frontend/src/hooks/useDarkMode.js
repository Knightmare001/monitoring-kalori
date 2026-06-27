import { useState, useEffect } from 'react'

export function useDarkMode() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('nutritrack_theme')
    if (saved) return saved === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    const root = document.documentElement
    if (dark) {
      root.classList.add('dark')
      localStorage.setItem('nutritrack_theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('nutritrack_theme', 'light')
    }
  }, [dark])

  return [dark, setDark]
}
