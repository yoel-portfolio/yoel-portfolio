import { useEffect, useRef, useState } from 'react'

type Theme = 'light' | 'dark'
const storageKey = 'yoel-theme'

function savedTheme(): Theme | null {
  try {
    const value = localStorage.getItem(storageKey)
    return value === 'light' || value === 'dark' ? value : null
  } catch {
    return null
  }
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(
    document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light',
  )
  const hasUserChoice = useRef(savedTheme() !== null)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      'content', theme === 'dark' ? '#0F172A' : '#F8FAFC',
    )
  }, [theme])

  useEffect(() => {
    const system = matchMedia('(prefers-color-scheme: dark)')
    const followSystem = () => {
      if (!hasUserChoice.current) setTheme(system.matches ? 'dark' : 'light')
    }
    const synchronizeTabs = (event: StorageEvent) => {
      if (event.key !== storageKey && event.key !== null) return
      const saved = savedTheme()
      hasUserChoice.current = saved !== null
      setTheme(saved ?? (system.matches ? 'dark' : 'light'))
    }
    system.addEventListener('change', followSystem)
    window.addEventListener('storage', synchronizeTabs)
    return () => {
      system.removeEventListener('change', followSystem)
      window.removeEventListener('storage', synchronizeTabs)
    }
  }, [])

  function toggleTheme() {
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    hasUserChoice.current = true
    setTheme(nextTheme)
    try { localStorage.setItem(storageKey, nextTheme) } catch { /* Funciona sin persistencia si el navegador la bloquea. */ }
  }

  return { theme, toggleTheme }
}
