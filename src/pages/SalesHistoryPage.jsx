import { useState, useMemo } from 'react'
import { getAllSales, searchSales, getSalesStats, getTodaySales, deleteSale } from '@/services/salesHistoryService'
import '../styles/theme.css'

export default function SalesHistoryPage() {
  const [sales, setSales] = useState(() => getAllSales())
  const [searchQuery, setSearchQuery] = useState('')
  const [dateFilter, setDateFilter] = useState('all') // all, today, week, month
  const [expandedSale, setExpandedSale] = useState(null)

  // ── Filtered Sales ───────────────────────────────
  const filteredSales = useMemo(() => {
    let result = searchQuery ? searchSales(searchQuery) : sales

    if (dateFilter === 'today') {
      result = getTodaySales()
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        result = result.filter(s =>
          s.id.toLowerCase().includes(q) ||
          (s.customerPhone && s.customerPhone.includes(q)) ||
          s.items.some(i => i.name.toLowerCase().includes(q))
        )
      }
    } else if (dateFilter === 'week') {
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      result = result.filter(s => new Date(s.timestamp) >= weekAgo)
    } else if (dateFilter === 'month') {
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      result = result.filter(s => new Date(s.timestamp) >= monthAgo)
    }

    return result
  }, [sales, searchQuery, dateFilter])

  // ── Stats ────────────────────────────────────────
  const stats = useMemo(() => getSalesStats(filteredSales), [filteredSales])

  // ── Delete Handler ───────────────────────────────
  const handleDelete = (saleId) => {
    if (!confirm('Supprimer cette vente?')) return
    deleteSale(saleId)
    setSales(getAllSales())
    setExpandedSale(null)
  }

  // ── Refresh ──────────────────────────────────────
  const refresh = () => setSales(getAllSales())

  return (
    <div className="sales-history-page">
      <header className="sh-header">
        <h1>Historique des Ventes</h1>
        <button className="sh-refresh-btn" onClick={refresh}>Actualiser</button>
      </header>

      {/* Stats Cards */}
      <div className="sh-stats">
        <div className="sh-stat-card">
          <span className="sh-stat-label">Ventes</span>
          <span className="sh-stat-value">{stats.totalSales}</span>
        </div>
        <div className="sh-stat-card">
          <span className="sh-stat-label">Revenus</span>
          <span className="sh-stat-value">{Math.round(stats.totalRevenue)} DA</span>
        </div>
        <div className="sh-stat-card">
          <span className="sh-stat-label">Articles</span>
          <span className="sh-stat-value">{stats.totalItems}</span>
        </div>
        <div className="sh-stat-card">
          <span className="sh-stat-label">Panier Moyen</span>
          <span className="sh-stat-value">{Math.round(stats.averageOrderValue)} DA</span>
        </div>
      </div>

      {/* Filters */}
      <div className="sh-filters">
        <div className="sh-search-wrap">
          <span>🔍</span>
          <input
            type="text"
            placeholder="Rechercher par reçu, client, produit..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="sh-search"
          />
        </div>
        <div className="sh-date-filters">
          {[
            { key: 'all', label: 'Tout' },
            { key: 'today', label: "Aujourd'hui" },
            { key: 'week', label: 'Semaine' },
            { key: 'month', label: 'Mois' },
          ].map(f => (
            <button
              key={f.key}
              className={`sh-filter-btn ${dateFilter === f.key ? 'active' : ''}`}
              onClick={() => setDateFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sales Table */}
      <div className="sh-table-wrap">
        {filteredSales.length === 0 ? (
          <div className="sh-empty">
            <p>Aucune vente trouvée</p>
            <small>Les ventes apparaîtront ici après chaque commande validée</small>
          </div>
        ) : (
          <table className="sh-table">
            <thead>
              <tr>
                <th>Reçu</th>
                <th>Date</th>
                <th>Client</th>
                <th>Articles</th>
                <th>Total</th>
                <th>Paiement</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.map(sale => (
                <>
                  <tr
                    key={sale.id}
                    className={`sh-row ${expandedSale === sale.id ? 'expanded' : ''}`}
                    onClick={() => setExpandedSale(expandedSale === sale.id ? null : sale.id)}
                  >
                    <td className="sh-receipt-id">{sale.id}</td>
                    <td>{sale.timestamp}</td>
                    <td>{sale.customerPhone !== 'N/A' ? sale.customerPhone : '—'}</td>
                    <td>{sale.items.reduce((sum, i) => sum + (i.quantity || 1), 0)} articles</td>
                    <td className="sh-total">{sale.total} DA</td>
                    <td>
                      <span className="sh-payment-badge">
                        {sale.paymentMethod === 'cash' && '💵'}
                        {sale.paymentMethod === 'card' && '💳'}
                        {sale.paymentMethod === 'ccp' && '📮'}
                        {sale.paymentMethod === 'baridi' && '📱'}
                        {' '}{sale.paymentMethod}
                      </span>
                    </td>
                    <td>
                      <button className="sh-expand-btn">
                        {expandedSale === sale.id ? '▲' : '▼'}
                      </button>
                    </td>
                  </tr>
                  {expandedSale === sale.id && (
                    <tr key={`${sale.id}-detail`} className="sh-detail-row">
                      <td colSpan="7">
                        <div className="sh-detail">
                          <h4>Détails du reçu {sale.id}</h4>
                          <div className="sh-detail-items">
                            {sale.items.map((item, idx) => (
                              <div key={idx} className="sh-detail-item">
                                <span>{item.name}</span>
                                <span>{item.size ? `${item.size}ml` : ''}</span>
                                <span>x{item.quantity || 1}</span>
                                <span className="sh-detail-price">{item.price} DA</span>
                              </div>
                            ))}
                          </div>
                          {sale.loyaltyDiscount > 0 && (
                            <div className="sh-detail-discount">
                              🎁 Remise fidélité: -{sale.loyaltyDiscount} DA
                            </div>
                          )}
                          <div className="sh-detail-total">
                            Total: {sale.total} DA
                          </div>
                          <button className="sh-delete-btn" onClick={(e) => { e.stopPropagation(); handleDelete(sale.id) }}>
                            🗑️ Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <style>{`
        .sales-history-page {
          background: var(--color-background, #1a1a2e);
          min-height: 100vh;
          padding: 1.5rem 2rem;
          color: var(--color-text, #e0e0e0);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .sh-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        .sh-header h1 {
          color: var(--color-accent, #d4af37);
          margin: 0;
          font-size: 1.6rem;
        }
        .sh-refresh-btn {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          color: var(--color-accent, #d4af37);
          padding: 0.5rem 1rem;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.85rem;
          font-weight: 600;
          transition: all 0.2s;
        }
        .sh-refresh-btn:hover { background: rgba(212,175,55,0.25); }

        /* ── Stats ── */
        .sh-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .sh-stat-card {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: 10px;
          padding: 1rem;
          text-align: center;
        }
        .sh-stat-label {
          display: block;
          color: var(--color-gray, #888);
          font-size: 0.8rem;
          margin-bottom: 0.3rem;
        }
        .sh-stat-value {
          display: block;
          color: var(--color-accent, #d4af37);
          font-size: 1.4rem;
          font-weight: 700;
        }

        /* ── Filters ── */
        .sh-filters {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.2rem;
          flex-wrap: wrap;
        }
        .sh-search-wrap {
          flex: 1;
          min-width: 250px;
          display: flex;
          align-items: center;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(212,175,55,0.3);
          border-radius: 8px;
          padding: 0 0.8rem;
        }
        .sh-search-wrap:focus-within { border-color: #d4af37; }
        .sh-search {
          flex: 1;
          background: transparent;
          border: none;
          color: #e0e0e0;
          padding: 0.6rem 0.5rem;
          font-size: 0.9rem;
          outline: none;
        }
        .sh-search::placeholder { color: #666; }
        .sh-date-filters { display: flex; gap: 0.4rem; }
        .sh-filter-btn {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(212,175,55,0.2);
          color: #aaa;
          padding: 0.45rem 0.8rem;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.8rem;
          transition: all 0.15s;
        }
        .sh-filter-btn:hover { border-color: #d4af37; color: #d4af37; }
        .sh-filter-btn.active {
          background: rgba(212,175,55,0.15);
          border-color: #d4af37;
          color: #d4af37;
          font-weight: 600;
        }

        /* ── Table ── */
        .sh-table-wrap {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(212,175,55,0.15);
          border-radius: 10px;
          overflow: hidden;
        }
        .sh-empty {
          text-align: center;
          padding: 3rem 1rem;
          color: #666;
        }
        .sh-empty p { margin: 0 0 0.3rem; font-size: 1rem; }
        .sh-empty small { color: #555; }

        .sh-table {
          width: 100%;
          border-collapse: collapse;
        }
        .sh-table thead th {
          background: rgba(15,52,96,0.5);
          color: #d4af37;
          padding: 0.8rem 1rem;
          text-align: left;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 2px solid rgba(212,175,55,0.3);
        }
        .sh-table tbody tr { cursor: pointer; transition: background 0.15s; }
        .sh-table tbody tr:hover { background: rgba(212,175,55,0.05); }
        .sh-table tbody tr.expanded { background: rgba(212,175,55,0.08); }
        .sh-table td {
          padding: 0.7rem 1rem;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          font-size: 0.85rem;
        }
        .sh-receipt-id { color: #d4af37; font-weight: 600; font-family: monospace; font-size: 0.75rem; }
        .sh-total { color: #d4af37; font-weight: 700; }
        .sh-payment-badge {
          background: rgba(255,255,255,0.06);
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          text-transform: capitalize;
        }
        .sh-expand-btn {
          background: none; border: none; color: #888; cursor: pointer; font-size: 0.7rem;
        }

        /* ── Detail Row ── */
        .sh-detail-row td { padding: 0; }
        .sh-detail {
          background: rgba(15,52,96,0.2);
          padding: 1rem 1.5rem;
          border-top: 1px solid rgba(212,175,55,0.1);
          animation: slideDown 0.15s ease;
        }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
        .sh-detail h4 { color: #d4af37; margin: 0 0 0.7rem; font-size: 0.9rem; }
        .sh-detail-items { display: flex; flex-direction: column; gap: 0.3rem; margin-bottom: 0.7rem; }
        .sh-detail-item {
          display: flex;
          gap: 1rem;
          font-size: 0.85rem;
          color: #ccc;
          padding: 0.3rem 0;
          border-bottom: 1px solid rgba(255,255,255,0.03);
        }
        .sh-detail-item span:first-child { flex: 1; }
        .sh-detail-price { color: #d4af37; font-weight: 600; }
        .sh-detail-discount { color: #4caf50; font-size: 0.85rem; margin-bottom: 0.5rem; }
        .sh-detail-total { color: #d4af37; font-weight: 700; font-size: 1rem; margin-bottom: 0.7rem; }
        .sh-delete-btn {
          background: rgba(231,76,60,0.15);
          border: 1px solid rgba(231,76,60,0.3);
          color: #e74c3c;
          padding: 0.4rem 0.8rem;
          border-radius: 5px;
          cursor: pointer;
          font-size: 0.8rem;
          transition: all 0.15s;
        }
        .sh-delete-btn:hover { background: rgba(231,76,60,0.3); }

        @media (max-width: 768px) {
          .sh-filters { flex-direction: column; }
          .sh-stats { grid-template-columns: repeat(2, 1fr); }
          .sh-table { font-size: 0.8rem; }
          .sh-table td, .sh-table th { padding: 0.5rem; }
        }
      `}</style>
    </div>
  )
}
