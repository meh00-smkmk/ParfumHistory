import { useTheme } from '../hooks/useTheme'
import { getAllThemes } from '../services/themeService'

export default function ThemeSwitcher() {
  const { themeName, switchTheme } = useTheme()
  const availableThemes = getAllThemes()

  return (
    <div style={{
      display: 'flex',
      gap: '1rem',
      flexWrap: 'wrap',
      alignItems: 'center',
      padding: '1rem',
      backgroundColor: 'rgba(255, 255, 255, 0.02)',
      borderRadius: '8px',
      border: '1px solid rgba(212, 175, 55, 0.1)',
    }}>
      <label style={{
        color: '#d4af37',
        fontWeight: '600',
        fontSize: '0.95rem',
      }}>
        🎨 Theme:
      </label>
      
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        flexWrap: 'wrap',
      }}>
        {availableThemes.map(theme => (
          <button
            key={theme.id}
            onClick={() => switchTheme(theme.id)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: themeName === theme.id ? '2px solid #d4af37' : '1px solid #d4af37',
              backgroundColor: themeName === theme.id 
                ? 'rgba(212, 175, 55, 0.2)' 
                : 'transparent',
              color: '#d4af37',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: themeName === theme.id ? '700' : '500',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              if (themeName !== theme.id) {
                e.target.style.backgroundColor = 'rgba(212, 175, 55, 0.1)'
              }
            }}
            onMouseLeave={(e) => {
              if (themeName !== theme.id) {
                e.target.style.backgroundColor = 'transparent'
              }
            }}
          >
            ✓ {theme.name}
          </button>
        ))}
      </div>
    </div>
  )
}
