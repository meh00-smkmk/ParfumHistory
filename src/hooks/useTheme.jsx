import { createContext, useContext, useState, useEffect } from 'react'
import { getTheme, applyThemeCSSVariables } from '../services/themeService'

/**
 * Theme Context
 */
const ThemeContext = createContext()

/**
 * Theme Provider Component
 * Wraps the app to provide theme context to all children
 */
export function ThemeProvider({ children }) {
  const [themeName, setThemeName] = useState(() => {
    return localStorage.getItem('selectedTheme') || 'luxury-dark'
  })

  const currentTheme = getTheme(themeName)

  // Apply theme to CSS variables when it changes
  useEffect(() => {
    applyThemeCSSVariables(currentTheme)
    localStorage.setItem('selectedTheme', themeName)
  }, [themeName, currentTheme])

  const switchTheme = (newThemeName) => {
    setThemeName(newThemeName)
  }

  const value = {
    themeName,
    currentTheme,
    switchTheme,
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

/**
 * useTheme Hook
 * Use this hook in any component to access theme context
 */
export function useTheme() {
  const context = useContext(ThemeContext)
  
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }

  return context
}

export default ThemeContext
