import { useState, useEffect } from 'react'
import '../styles/theme.css'

export default function CustomerHistoryPage() {
  const [history, setHistory] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    try {
      const hash = window.location.hash
      if (!hash || !hash.includes('#data=')) {
        throw new Error("Aucune donnée trouvée. Veuillez scanner un QR code valide.")
      }
      
      const b64Data = hash.split('#data=')[1]
      const decodedStr = atob(b64Data)
      const data = JSON.parse(decodedStr)
      
      if (!Array.isArray(data)) {
        throw new Error("Format de données invalide.")
      }
      setHistory(data)
    } catch (e) {
      console.error(e)
      setError(e.message || "Impossible de charger l'historique.")
    }
  }, [])

  return (
    <div className="customer-history-page">
      <header className="ch-header">
        <h1>PerfumierPro</h1>
        <p>Votre Historique Parfums</p>
      </header>

      <main className="ch-main">
        {error ? (
          <div className="ch-error">
            <span className="error-icon">⚠️</span>
            <p>{error}</p>
          </div>
        ) : (
          <div className="ch-list">
            <div className="ch-intro">
              Voici la liste exacte des parfums que vous avez achetés. Montrez cet écran lors de votre prochaine visite !
            </div>
            {history.map((item, i) => (
              <div key={i} className="ch-item">
                <div className="ch-item-icon">✨</div>
                <div className="ch-item-details">
                  <h3>{decodeURIComponent(item.n)}</h3>
                  <div className="ch-item-meta">
                    {item.s ? <span>Taille: {item.s}ml</span> : null}
                    <span>Quantité: {item.q}</span>
                  </div>
                </div>
              </div>
            ))}
            {history.length === 0 && !error && (
              <p style={{textAlign: 'center', color: '#888'}}>Chargement...</p>
            )}
          </div>
        )}
      </main>

      <style>{`
        .customer-history-page {
          background: var(--color-background, #1a1a2e);
          min-height: 100vh;
          color: var(--color-text, #e0e0e0);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          padding: 2rem 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .ch-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .ch-header h1 {
          color: var(--color-accent, #d4af37);
          margin: 0;
          font-size: 2rem;
          letter-spacing: 1px;
        }
        .ch-header p {
          color: #888;
          margin: 0.5rem 0 0;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        .ch-main {
          width: 100%;
          max-width: 400px;
        }

        .ch-intro {
          background: rgba(212,175,55,0.1);
          border: 1px solid rgba(212,175,55,0.3);
          color: var(--color-accent, #d4af37);
          padding: 1rem;
          border-radius: 8px;
          font-size: 0.9rem;
          text-align: center;
          margin-bottom: 1.5rem;
          line-height: 1.4;
        }

        .ch-error {
          background: rgba(231,76,60,0.1);
          border: 1px dashed #e74c3c;
          padding: 2rem;
          border-radius: 12px;
          text-align: center;
          color: #ff6b6b;
        }
        .error-icon { display: block; font-size: 2.5rem; margin-bottom: 1rem; }

        .ch-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .ch-item {
          background: var(--color-surface, rgba(255,255,255,0.05));
          border: 1px solid var(--color-border, rgba(255,255,255,0.1));
          border-radius: 12px;
          padding: 1.2rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }

        .ch-item-icon {
          font-size: 1.5rem;
          background: rgba(212,175,55,0.15);
          width: 45px;
          height: 45px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          border: 1px solid rgba(212,175,55,0.3);
        }

        .ch-item-details h3 {
          margin: 0 0 0.4rem;
          color: var(--color-accent, #d4af37);
          font-size: 1.1rem;
        }
        .ch-item-meta {
          display: flex;
          gap: 1rem;
          font-size: 0.85rem;
          color: #aaa;
        }
      `}</style>
    </div>
  )
}
