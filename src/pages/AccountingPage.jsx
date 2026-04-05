import { useState, useEffect, useMemo } from 'react'
import { getAllExpenses, saveExpense, deleteExpense, getTotalExpenses, getExpensesByCategory, getCategories } from '@/services/expenseService'
import { getAllSales, getSalesStats } from '@/services/salesHistoryService'
import '../styles/theme.css'

export default function AccountingPage() {
  const [expenses, setExpenses] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)
  const [dateRange, setDateRange] = useState('month')
  const [formData, setFormData] = useState({
    category: 'Autre',
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    status: 'approved',
  })

  // Load expenses
  useEffect(() => { refresh() }, [])

  const refresh = () => setExpenses(getAllExpenses())

  // Sales data for P&L
  const salesStats = useMemo(() => {
    const sales = getAllSales()
    // Date filter
    const now = new Date()
    const filtered = sales.filter(s => {
      const d = new Date(s.timestamp)
      if (dateRange === 'week') return d >= new Date(now - 7 * 86400000)
      if (dateRange === 'month') { const m = new Date(); m.setMonth(m.getMonth() - 1); return d >= m }
      if (dateRange === 'year') { const y = new Date(); y.setFullYear(y.getFullYear() - 1); return d >= y }
      return true
    })
    return getSalesStats(filtered)
  }, [dateRange])

  // Filtered expenses by date
  const filteredExpenses = useMemo(() => {
    const now = new Date()
    return expenses.filter(e => {
      const d = new Date(e.date)
      if (dateRange === 'week') return d >= new Date(now - 7 * 86400000)
      if (dateRange === 'month') { const m = new Date(); m.setMonth(m.getMonth() - 1); return d >= m }
      if (dateRange === 'year') { const y = new Date(); y.setFullYear(y.getFullYear() - 1); return d >= y }
      return true
    })
  }, [expenses, dateRange])

  const totalExpenses = getTotalExpenses(filteredExpenses)
  const totalRevenue = salesStats.totalRevenue || 0
  const profit = totalRevenue - totalExpenses
  const categoryBreakdown = getExpensesByCategory(filteredExpenses)

  // ── Form Handlers ────────────────────────────────
  const openAddForm = () => {
    setEditingExpense(null)
    setFormData({ category: 'Autre', description: '', amount: '', date: new Date().toISOString().split('T')[0], status: 'approved' })
    setShowForm(true)
  }

  const openEditForm = (expense) => {
    setEditingExpense(expense)
    setFormData({
      category: expense.category,
      description: expense.description,
      amount: expense.amount.toString(),
      date: expense.date,
      status: expense.status,
    })
    setShowForm(true)
  }

  const handleSave = (e) => {
    e.preventDefault()
    if (!formData.amount || parseFloat(formData.amount) <= 0) return
    if (!formData.description.trim()) return

    saveExpense(editingExpense ? { id: editingExpense.id, ...formData, amount: parseFloat(formData.amount) } : { ...formData, amount: parseFloat(formData.amount) })
    setShowForm(false)
    setEditingExpense(null)
    refresh()
  }

  const handleDelete = (id) => {
    if (!confirm('Supprimer cette dépense?')) return
    deleteExpense(id)
    refresh()
  }

  return (
    <div className="acc-page">
      <header className="acc-header">
        <div>
          <h1>Comptabilité & Finances</h1>
          <p>Gérez vos dépenses et suivez la rentabilité</p>
        </div>
        <button className="acc-add-btn" onClick={openAddForm}>
          ➕ Ajouter Dépense
        </button>
      </header>

      {/* Date Range */}
      <div className="acc-range">
        {[
          { key: 'week', label: 'Semaine' },
          { key: 'month', label: 'Mois' },
          { key: 'year', label: 'Année' },
          { key: 'all', label: 'Tout' },
        ].map(r => (
          <button key={r.key} className={`acc-range-btn ${dateRange === r.key ? 'active' : ''}`} onClick={() => setDateRange(r.key)}>
            {r.label}
          </button>
        ))}
      </div>

      {/* KPI Cards */}
      <div className="acc-kpis">
        <div className="acc-kpi revenue">
          <span className="kpi-label">Revenus</span>
          <span className="kpi-value">{Math.round(totalRevenue)} DA</span>
          <span className="kpi-sub">{salesStats.totalSales} ventes</span>
        </div>
        <div className="acc-kpi expense">
          <span className="kpi-label">Dépenses</span>
          <span className="kpi-value">{Math.round(totalExpenses)} DA</span>
          <span className="kpi-sub">{filteredExpenses.length} entrées</span>
        </div>
        <div className={`acc-kpi ${profit >= 0 ? 'profit' : 'loss'}`}>
          <span className="kpi-label">{profit >= 0 ? 'Bénéfice Net' : 'Perte Nette'}</span>
          <span className="kpi-value">{profit >= 0 ? '' : '-'}{Math.round(Math.abs(profit))} DA</span>
          <span className="kpi-sub">{totalRevenue > 0 ? ((profit / totalRevenue) * 100).toFixed(1) : 0}% marge</span>
        </div>
        <div className="acc-kpi">
          <span className="kpi-label">ROI</span>
          <span className="kpi-value">{totalExpenses > 0 ? ((profit / totalExpenses) * 100).toFixed(0) : 0}%</span>
          <span className="kpi-sub">Retour sur investissement</span>
        </div>
      </div>

      {/* Category Breakdown */}
      {categoryBreakdown.length > 0 && (
        <div className="acc-cat-section">
          <h2>Répartition par Catégorie</h2>
          <div className="acc-cat-grid">
            {categoryBreakdown.sort((a, b) => b.amount - a.amount).map((cat, idx) => (
              <div key={idx} className="acc-cat-card">
                <span className="cat-name">{cat.category}</span>
                <span className="cat-amount">{Math.round(cat.amount)} DA</span>
                <div className="cat-bar">
                  <div className="cat-bar-fill" style={{ width: `${totalExpenses > 0 ? (cat.amount / totalExpenses) * 100 : 0}%` }}></div>
                </div>
                <span className="cat-pct">{totalExpenses > 0 ? ((cat.amount / totalExpenses) * 100).toFixed(0) : 0}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expenses Table */}
      <div className="acc-table-section">
        <div className="acc-table-header">
          <h2>📋 Liste des Dépenses</h2>
          <button className="acc-add-btn-sm" onClick={openAddForm}>➕ Ajouter</button>
        </div>

        {filteredExpenses.length === 0 ? (
          <div className="acc-empty">
            <p>Aucune dépense enregistrée</p>
            <small>Cliquez sur "Ajouter Dépense" pour commencer</small>
          </div>
        ) : (
          <table className="acc-table">
            <thead>
              <tr>
                <th>Catégorie</th>
                <th>Description</th>
                <th>Montant</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map(exp => (
                <tr key={exp.id}>
                  <td><span className="cat-badge">{exp.category}</span></td>
                  <td>{exp.description}</td>
                  <td className="amt">{Math.round(exp.amount)} DA</td>
                  <td>{exp.date}</td>
                  <td>
                    <span className={`status-badge ${exp.status}`}>{exp.status === 'approved' ? '✅' : exp.status === 'pending' ? '⏳' : '❌'} {exp.status}</span>
                  </td>
                  <td className="acc-actions">
                    <button className="act-btn edit" onClick={() => openEditForm(exp)}>✏️</button>
                    <button className="act-btn del" onClick={() => handleDelete(exp.id)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="2"><strong>Total</strong></td>
                <td className="amt"><strong>{Math.round(totalExpenses)} DA</strong></td>
                <td colSpan="3"></td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="acc-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="acc-modal" onClick={e => e.stopPropagation()}>
            <div className="acc-modal-header">
              <h3>{editingExpense ? '✏️ Modifier Dépense' : '➕ Nouvelle Dépense'}</h3>
              <button className="modal-close" onClick={() => setShowForm(false)}>✕</button>
            </div>
            <form onSubmit={handleSave} className="acc-form">
              <div className="form-row">
                <label>Catégorie</label>
                <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                  {getCategories().map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="form-row">
                <label>Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ex: Loyer du mois de Janvier"
                  required
                />
              </div>
              <div className="form-row">
                <label>Montant (DA)</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={e => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0"
                  min="1"
                  required
                />
              </div>
              <div className="form-row">
                <label>Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <div className="form-row">
                <label>Status</label>
                <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                  <option value="approved">Approuvé</option>
                  <option value="pending">En attente</option>
                  <option value="rejected">Rejeté</option>
                </select>
              </div>
              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>Annuler</button>
                <button type="submit" className="btn-save">{editingExpense ? 'Mettre à jour' : 'Ajouter'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .acc-page {
          background: var(--color-background, #1a1a2e);
          min-height: 100vh;
          padding: 1.5rem 2rem;
          color: var(--color-text, #e0e0e0);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        /* ── Header ── */
        .acc-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: var(--color-dark, linear-gradient(135deg, #0f3460, #16213e));
          padding: 1.2rem 1.5rem;
          border-radius: 10px;
          border-bottom: 3px solid var(--color-accent, #d4af37);
          margin-bottom: 1.5rem;
        }
        .acc-header h1 { color: var(--color-accent, #d4af37); margin: 0; font-size: 1.5rem; }
        .acc-header p { color: #888; margin: 0.3rem 0 0; font-size: 0.85rem; }
        .acc-add-btn {
          background: var(--color-accent, linear-gradient(135deg, #d4af37, #b8960c));
          color: var(--color-primary, #1a1a2e);
          border: none;
          padding: 0.7rem 1.3rem;
          border-radius: 8px;
          font-weight: 700;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.2s;
        }
        .acc-add-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(212,175,55,0.3); }

        /* ── Range ── */
        .acc-range { display: flex; gap: 0.4rem; margin-bottom: 1.5rem; }
        .acc-range-btn {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(212,175,55,0.2);
          color: #aaa;
          padding: 0.45rem 1rem;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.85rem;
          transition: all 0.15s;
        }
        .acc-range-btn:hover { border-color: var(--color-accent, #d4af37); color: var(--color-accent, #d4af37); }
        .acc-range-btn.active { background: rgba(212,175,55,0.15); border-color: var(--color-accent, #d4af37); color: var(--color-accent, #d4af37); font-weight: 600; }

        /* ── KPIs ── */
        .acc-kpis {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .acc-kpi {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(212,175,55,0.15);
          border-radius: 10px;
          padding: 1.2rem;
          border-left: 4px solid #d4af37;
        }
        .acc-kpi.revenue { border-left-color: #4caf50; }
        .acc-kpi.expense { border-left-color: #e74c3c; }
        .acc-kpi.profit { border-left-color: #4caf50; }
        .acc-kpi.loss { border-left-color: #e74c3c; }
        .kpi-label { display: block; color: #888; font-size: 0.8rem; margin-bottom: 0.3rem; }
        .kpi-value { display: block; color: var(--color-accent, #d4af37); font-size: 1.5rem; font-weight: 700; }
        .kpi-sub { display: block; color: #666; font-size: 0.75rem; margin-top: 0.2rem; }

        /* ── Category Breakdown ── */
        .acc-cat-section {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(212,175,55,0.15);
          border-radius: 10px;
          padding: 1.2rem;
          margin-bottom: 1.5rem;
        }
        .acc-cat-section h2 { color: var(--color-accent, #d4af37); margin: 0 0 1rem; font-size: 1.1rem; }
        .acc-cat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 0.7rem; }
        .acc-cat-card {
          background: rgba(255,255,255,0.04);
          border-radius: 8px;
          padding: 0.8rem;
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }
        .cat-name { color: #ccc; font-size: 0.85rem; }
        .cat-amount { color: #d4af37; font-weight: 700; font-size: 1rem; }
        .cat-bar { height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; overflow: hidden; }
        .cat-bar-fill { height: 100%; background: #d4af37; border-radius: 2px; transition: width 0.3s; }
        .cat-pct { color: #888; font-size: 0.7rem; }

        /* ── Table ── */
        .acc-table-section {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(212,175,55,0.15);
          border-radius: 10px;
          overflow: hidden;
        }
        .acc-table-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.2rem;
          border-bottom: 1px solid rgba(212,175,55,0.1);
        }
        .acc-table-header h2 { color: #d4af37; margin: 0; font-size: 1rem; }
        .acc-add-btn-sm {
          background: rgba(212,175,55,0.15);
          border: 1px solid rgba(212,175,55,0.3);
          color: #d4af37;
          padding: 0.4rem 0.8rem;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.8rem;
        }
        .acc-add-btn-sm:hover { background: rgba(212,175,55,0.25); }
        .acc-empty { text-align: center; padding: 2rem; color: #666; }
        .acc-empty p { margin: 0 0 0.3rem; }

        .acc-table { width: 100%; border-collapse: collapse; }
        .acc-table thead th {
          background: rgba(15,52,96,0.4);
          color: var(--color-accent, #d4af37);
          padding: 0.7rem 1rem;
          text-align: left;
          font-size: 0.78rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 2px solid rgba(212,175,55,0.3);
        }
        .acc-table td {
          padding: 0.6rem 1rem;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          font-size: 0.85rem;
        }
        .acc-table tbody tr { transition: background 0.15s; }
        .acc-table tbody tr:hover { background: rgba(212,175,55,0.05); }
        .acc-table tfoot td {
          background: rgba(15,52,96,0.3);
          border-top: 2px solid rgba(212,175,55,0.3);
        }
        .amt { color: #d4af37; font-weight: 700; }
        .cat-badge {
          background: rgba(212,175,55,0.1);
          color: #d4af37;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
        }
        .status-badge {
          font-size: 0.75rem;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
        }
        .status-badge.approved { background: rgba(76,175,80,0.15); color: #4caf50; }
        .status-badge.pending { background: rgba(255,193,7,0.15); color: #ffc107; }
        .status-badge.rejected { background: rgba(231,76,60,0.15); color: #e74c3c; }

        .acc-actions { display: flex; gap: 0.3rem; }
        .act-btn {
          background: none;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 4px;
          cursor: pointer;
          padding: 0.3rem 0.5rem;
          font-size: 0.8rem;
          transition: all 0.15s;
        }
        .act-btn.edit:hover { background: rgba(212,175,55,0.2); border-color: var(--color-accent, #d4af37); }
        .act-btn.del:hover { background: rgba(231,76,60,0.2); border-color: #e74c3c; }

        /* ── Modal ── */
        .acc-modal-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.7);
          display: flex; align-items: center; justify-content: center;
          z-index: 9999;
          animation: fadeIn 0.15s ease;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        .acc-modal {
          background: var(--color-dark, linear-gradient(135deg, #0f3460, #16213e));
          border: 2px solid var(--color-accent, #d4af37);
          border-radius: 12px;
          padding: 0;
          width: 90%;
          max-width: 480px;
          animation: scaleIn 0.15s ease;
        }
        @keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }

        .acc-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.3rem;
          border-bottom: 1px solid rgba(212,175,55,0.2);
        }
        .acc-modal-header h3 { color: var(--color-accent, #d4af37); margin: 0; font-size: 1.1rem; }
        .modal-close {
          background: none; border: none; color: #888; font-size: 1.2rem; cursor: pointer;
        }
        .modal-close:hover { color: #e74c3c; }

        .acc-form { padding: 1.3rem; }
        .form-row { margin-bottom: 1rem; }
        .form-row label {
          display: block;
          color: var(--color-accent, #d4af37);
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 0.3rem;
        }
        .form-row input,
        .form-row select {
          width: 100%;
          padding: 0.6rem 0.8rem;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(212,175,55,0.3);
          border-radius: 6px;
          color: #e0e0e0;
          font-size: 0.9rem;
          outline: none;
        }
        .form-row input:focus,
        .form-row select:focus { border-color: #d4af37; }

        .form-actions {
          display: flex;
          gap: 0.7rem;
          justify-content: flex-end;
          margin-top: 1.2rem;
        }
        .btn-cancel {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.15);
          color: #aaa;
          padding: 0.6rem 1.2rem;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.85rem;
        }
        .btn-cancel:hover { border-color: #888; color: #ccc; }
        .btn-save {
          background: linear-gradient(135deg, #d4af37, #b8960c);
          color: #1a1a2e;
          border: none;
          padding: 0.6rem 1.5rem;
          border-radius: 6px;
          font-weight: 700;
          cursor: pointer;
          font-size: 0.85rem;
          transition: all 0.15s;
        }
        .btn-save:hover { transform: translateY(-1px); box-shadow: 0 3px 10px rgba(212,175,55,0.3); }

        @media (max-width: 768px) {
          .acc-kpis { grid-template-columns: repeat(2, 1fr); }
          .acc-header { flex-direction: column; gap: 0.8rem; text-align: center; }
          .acc-table { font-size: 0.78rem; }
        }
      `}</style>
    </div>
  )
}
