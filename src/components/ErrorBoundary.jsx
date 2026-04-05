import { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#1a1a2e',
          color: '#f0f0f0',
          fontFamily: 'system-ui, sans-serif',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <h1 style={{ color: '#d4af37', marginBottom: '1rem' }}>⚠️ Application Error</h1>
          <p style={{ marginBottom: '2rem', maxWidth: '500px', lineHeight: 1.6 }}>
            The application encountered an error. Please refresh the page or contact support.
          </p>
          <details style={{
            backgroundColor: 'rgba(212, 175, 55, 0.1)',
            padding: '1rem',
            borderRadius: '6px',
            border: '1px solid #d4af37',
            maxWidth: '600px',
            textAlign: 'left',
            marginTop: '1rem'
          }}>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold', color: '#d4af37' }}>
              Error Details
            </summary>
            <pre style={{
              marginTop: '1rem',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              padding: '1rem',
              borderRadius: '4px',
              overflow: 'auto',
              fontSize: '0.85rem',
              color: '#b0b0b0'
            }}>
              {this.state.error?.toString()}
            </pre>
          </details>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '2rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#d4af37',
              color: '#1a1a2e',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '1rem'
            }}
          >
            🔄 Refresh Page
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
