import { useState, useEffect } from 'react'
import { getInventory, adjustStock, getLowStockAlerts, getOutOfStockProducts } from '@/api/inventory'
import '../styles/theme.css'

export default function InventoryPage() {
  const [inventory, setInventory] = useState([])
  const [lowStockItems, setLowStockItems] = useState([])
  const [outOfStock, setOutOfStock] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedTab, setSelectedTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [adjusting, setAdjusting] = useState(null)
  const [adjustQty, setAdjustQty] = useState('')

  useEffect(() => {
    loadInventory()
  }, [])

  const loadInventory = async () => {
    setLoading(true)
    setError('')

    const [invResult, lowResult, outResult] = await Promise.all([
      getInventory({ limit: 100 }),
      getLowStockAlerts(),
      getOutOfStockProducts(),
    ])

    if (invResult.success) setInventory(invResult.data)
    if (lowResult.success) setLowStockItems(lowResult.data)
    if (outResult.success) setOutOfStock(outResult.data)

    setLoading(false)
  }

  const handleAdjustStock = async (productId) => {
    if (!adjustQty) return

    setLoading(true)
    const result = await adjustStock(productId, parseInt(adjustQty), 'manual_adjustment')

    if (result.success) {
      setAdjusting(null)
      setAdjustQty('')
      loadInventory()
    } else {
      setError('Failed to adjust stock')
    }
    setLoading(false)
  }

  const getDisplayItems = () => {
    let items = inventory
    if (selectedTab === 'low') items = lowStockItems
    if (selectedTab === 'out') items = outOfStock

    if (searchQuery) {
      items = items.filter((item) =>
        item.name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return items
  }

  const displayItems = getDisplayItems()

  return (
    <div className="inventory-container">
      <header className="page-header">
        <h1>Gestion de l'Inventaire</h1>
      </header>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="inventory-controls">
        <div className="tabs">
          <button
            className={`tab ${selectedTab === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedTab('all')}
          >
            All Items ({inventory.length})
          </button>
          <button
            className={`tab ${selectedTab === 'low' ? 'active' : ''}`}
            onClick={() => setSelectedTab('low')}
          >
            Low Stock ({lowStockItems.length})
          </button>
          <button
            className={`tab ${selectedTab === 'out' ? 'active' : ''}`}
            onClick={() => setSelectedTab('out')}
          >
            Out of Stock ({outOfStock.length})
          </button>
        </div>

        <input
          type="text"
          placeholder="Search inventory..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="inventory-table">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : displayItems.length === 0 ? (
          <div className="empty-state">No items found</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Current Stock</th>
                <th>Min Level</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayItems.map((item) => (
                <tr key={item.id} className={item.stock <= 0 ? 'out-of-stock' : ''}>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td className="stock-level">{item.stock}</td>
                  <td>{item.minLevel || 10}</td>
                  <td>
                    <span
                      className={`badge ${
                        item.stock > item.minLevel
                          ? 'badge-success'
                          : item.stock > 0
                          ? 'badge-warning'
                          : 'badge-danger'
                      }`}
                    >
                      {item.stock > item.minLevel
                        ? '✅ Good'
                        : item.stock > 0
                        ? '⚠️ Low'
                        : '❌ Out'}
                    </span>
                  </td>
                  <td>
                    {adjusting === item.id ? (
                      <div className="adjust-input">
                        <input
                          type="number"
                          value={adjustQty}
                          onChange={(e) => setAdjustQty(e.target.value)}
                          placeholder="Qty"
                          disabled={loading}
                        />
                        <button
                          onClick={() => handleAdjustStock(item.id)}
                          className="btn btn-sm btn-success"
                          disabled={loading}
                        >
                          OK
                        </button>
                        <button
                          onClick={() => {
                            setAdjusting(null)
                            setAdjustQty('')
                          }}
                          className="btn btn-sm"
                          disabled={loading}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setAdjusting(item.id)}
                        className="btn btn-sm btn-primary"
                      >
                        Adjust
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <style>{`
        .inventory-container {
          background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary) 100%);
          min-height: 100vh;
          padding: 2rem;
          color: var(--color-text);
        }

        .page-header {
          background: linear-gradient(135deg, var(--color-dark) 0%, var(--color-primary) 100%);
          padding: 1.5rem;
          border-radius: 8px;
          margin-bottom: 2rem;
          border-bottom: 3px solid var(--color-accent);
        }

        .page-header h1 {
          margin: 0;
          color: var(--color-accent);
          font-size: 1.8rem;
        }

        .inventory-controls {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--color-border);
          border-radius: 8px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .tabs {
          display: flex;
          gap: 1rem;
        }

        .tab {
          padding: 0.75rem 1.5rem;
          border: 2px solid var(--color-accent);
          background: transparent;
          color: var(--color-accent);
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 600;
        }

        .tab:hover,
        .tab.active {
          background: var(--color-accent);
          color: var(--color-primary);
        }

        .search-input {
          padding: 0.75rem 1rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid var(--color-accent);
          border-radius: 6px;
          color: var(--color-text);
          width: 250px;
        }

        .inventory-table {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--color-border);
          border-radius: 8px;
          overflow: hidden;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th {
          background: var(--color-surface);
          color: var(--color-accent);
          padding: 1rem;
          text-align: left;
          font-weight: 700;
          border-bottom: 2px solid var(--color-accent);
        }

        td {
          padding: 0.75rem 1rem;
          border-bottom: 1px solid var(--color-surface);
        }

        tr:hover {
          background: var(--color-surface);
        }

        tr.out-of-stock {
          background: rgba(231, 76, 60, 0.1);
        }

        .stock-level {
          color: var(--color-accent);
          font-weight: 600;
          font-size: 1.1rem;
        }

        .badge {
          display: inline-block;
          padding: 0.4rem 0.8rem;
          border-radius: 4px;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .badge-success {
          background: rgba(39, 174, 96, 0.2);
          color: var(--color-success);
        }

        .badge-warning {
          background: rgba(241, 196, 15, 0.2);
          color: #f1c40f;
        }

        .badge-danger {
          background: rgba(231, 76, 60, 0.2);
          color: var(--color-danger);
        }

        .adjust-input {
          display: flex;
          gap: 0.3rem;
        }

        .adjust-input input {
          width: 60px;
          padding: 0.4rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid var(--color-accent);
          border-radius: 4px;
          color: var(--color-text);
        }

        .loading {
          text-align: center;
          padding: 2rem;
          color: var(--color-gray);
        }

        .empty-state {
          text-align: center;
          padding: 2rem;
          color: var(--color-gray);
        }

        @media (max-width: 768px) {
          .inventory-controls {
            flex-direction: column;
          }

          .search-input {
            width: 100%;
          }

          .tabs {
            flex-wrap: wrap;
          }

          table {
            font-size: 0.9rem;
          }

          th, td {
            padding: 0.5rem;
          }
        }
      `}</style>
    </div>
  )
}
