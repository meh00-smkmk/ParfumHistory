import { useState } from 'react'
import { login } from '@/api/auth'
import '../styles/theme.css'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await login(email, password)

    if (result.success) {
      setSuccess(true)
      // Store user data and do a full page reload to /pos
      localStorage.setItem('userData', JSON.stringify(result.user))
      setTimeout(() => {
        // Full page reload to /pos to reinitialize React and App component
        window.location.href = '/pos'
      }, 1500)
    } else {
      setError(result.error || 'Login failed')
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>PerfumierPro</h1>
          <p>Perfume Store Management</p>
        </div>

        {success && (
          <div className="alert alert-success">
            ✅ Login successful! Redirecting...
          </div>
        )}

        {error && (
          <div className="alert alert-danger">
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={loading}
              />
              Remember me
            </label>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="login-footer">
          <a href="#forgot">Forgot password?</a>
          <span>•</span>
          <a href="#signup">Create account</a>
        </div>
      </div>

      <style>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary) 100%);
          padding: 1rem;
        }

        .login-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--color-border);
          border-radius: 12px;
          padding: 2.5rem;
          width: 100%;
          max-width: 400px;
          backdrop-filter: blur(10px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        .login-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .login-header h1 {
          margin: 0;
          font-size: 2rem;
          color: var(--color-accent);
        }

        .login-header p {
          margin: 0.5rem 0 0;
          color: var(--color-gray);
        }

        .login-form {
          margin: 2rem 0;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          color: #b0b0b0;
          font-size: 0.9rem;
        }

        .checkbox-label input {
          width: auto;
          cursor: pointer;
        }

        .login-footer {
          text-align: center;
          margin-top: 1.5rem;
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          font-size: 0.9rem;
        }

        .login-footer a {
          color: var(--color-accent);
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .login-footer a:hover {
          color: var(--color-text);
        }

        @media (max-width: 480px) {
          .login-card {
            padding: 1.5rem;
          }

          .login-header h1 {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  )
}
