import { useState, useEffect } from 'react'
import { formatPrice, getDefaultCurrency } from '@/utils/currencyFormatter'
import { getInventory, adjustStock } from '@/api/inventory'
import '../styles/theme.css'

export default function RawMaterialsPage() {
  const [materials, setMaterials] = useState([])
  const [suppliers, setSuppliers] = useState([
    { id: 1, name: 'Fragrance Global', country: 'France', leadTime: '14 days' },
    { id: 2, name: 'Essence Import', country: 'Switzerland', leadTime: '10 days' },
    { id: 3, name: 'Natural Oils Ltd', country: 'India', leadTime: '21 days' },
  ])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [selectedMaterial, setSelectedMaterial] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [adjusting, setAdjusting] = useState(null)
  const [adjustQty, setAdjustQty] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    supplier: '',
    quantity: '',
    unit: 'ml',
    cost: '',
    category: 'fragrance',
  })

  useEffect(() => {
    loadMaterials()
  }, [])

  const loadMaterials = async () => {
    setLoading(true)
    const result = await getInventory({ limit: 100, category: 'raw_materials' })

    if (result.success) {
      setMaterials(result.data)
    }
    setLoading(false)
  }

  const handleAddMaterial = (e) => {
    e.preventDefault()
    if (!formData.name) return

    const newMaterial = {
      id: Date.now(),
      ...formData,
      quantity: parseInt(formData.quantity),
      cost: parseFloat(formData.cost),
      dateAdded: new Date().toLocaleDateString(),
    }

    setMaterials([...materials, newMaterial])
    setShowForm(false)
    setFormData({
      name: '',
      sku: '',
      supplier: '',
      quantity: '',
      unit: 'ml',
      cost: '',
      category: 'fragrance',
    })
  }

  const handleAdjustStock = async (materialId) => {
    if (!adjustQty) return

    const updatedMaterials = materials.map((m) =>
      m.id === materialId
        ? { ...m, quantity: m.quantity + parseInt(adjustQty) }
        : m
    )

    setMaterials(updatedMaterials)
    setAdjusting(null)
    setAdjustQty('')
  }

  const filteredMaterials = materials.filter((m) =>
    m.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.sku?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalValue = materials.reduce((sum, m) => sum + (m.quantity * m.cost || 0), 0)

  return (
    <div className="raw-materials-container">
      <header className="page-header">
        <h1>Gestion des Matières Premières</h1>
      </header>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="materials-layout">
        {/* Main Content */}
        <div className="materials-main">
          <div className="controls">
            <div className="controls-left">
              <input
                type="text"
                placeholder="Search materials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            <button
              onClick={() => {
                setShowForm(!showForm)
                if (!showForm) setSelectedMaterial(null)
              }}
              className="btn btn-primary"
            >
              {showForm ? '✕ Cancel' : '+ Add Material'}
            </button>
          </div>

          {/* Form */}
          {showForm && (
            <div className="form-card">
              <h3>Add New Raw Material</h3>
              <form onSubmit={handleAddMaterial} className="material-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Material Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>SKU</label>
                    <input
                      type="text"
                      value={formData.sku}
                      onChange={(e) =>
                        setFormData({ ...formData, sku: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Supplier</label>
                    <select
                      value={formData.supplier}
                      onChange={(e) =>
                        setFormData({ ...formData, supplier: e.target.value })
                      }
                    >
                      <option value="">Select Supplier</option>
                      {suppliers.map((s) => (
                        <option key={s.id} value={s.name}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                    >
                      <option value="fragrance">Fragrance</option>
                      <option value="alcohol">Alcohol</option>
                      <option value="oil">Oil</option>
                      <option value="container">Container</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Quantity *</label>
                    <input
                      type="number"
                      value={formData.quantity}
                      onChange={(e) =>
                        setFormData({ ...formData, quantity: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Unit</label>
                    <select
                      value={formData.unit}
                      onChange={(e) =>
                        setFormData({ ...formData, unit: e.target.value })
                      }
                    >
                      <option value="ml">ml</option>
                      <option value="l">L</option>
                      <option value="kg">kg</option>
                      <option value="g">g</option>
                      <option value="unit">unit</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Cost per Unit</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.cost}
                      onChange={(e) =>
                        setFormData({ ...formData, cost: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    Add Material
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Materials Grid */}
          <div className="materials-grid">
            {loading ? (
              <div className="loading">Loading...</div>
            ) : filteredMaterials.length === 0 ? (
              <div className="empty-state">No materials found</div>
            ) : (
              filteredMaterials.map((material) => (
                <div key={material.id} className="material-card">
                  <div className="card-header">
                    <h4>{material.name}</h4>
                    <span className="badge badge-info">{material.category}</span>
                  </div>

                  <div className="card-details">
                    <div className="detail">
                      <span>SKU:</span>
                      <span className="value">{material.sku || 'N/A'}</span>
                    </div>
                    <div className="detail">
                      <span>Supplier:</span>
                      <span className="value">{material.supplier || 'N/A'}</span>
                    </div>
                    <div className="detail">
                      <span>Quantity:</span>
                      <span className="value quantity">
                        {material.quantity} {material.unit}
                      </span>
                    </div>
                    <div className="detail">
                      <span>Cost/Unit:</span>
                      <span className="value">{formatPrice(material.cost || 0, getDefaultCurrency())}</span>
                    </div>
                    <div className="detail">
                      <span>Total Value:</span>
                      <span className="value price">
                        {formatPrice(material.quantity * material.cost || 0, getDefaultCurrency())}
                      </span>
                    </div>
                  </div>

                  <div className="card-actions">
                    {adjusting === material.id ? (
                      <div className="adjust-input">
                        <input
                          type="number"
                          value={adjustQty}
                          onChange={(e) => setAdjustQty(e.target.value)}
                          placeholder="Qty"
                        />
                        <button
                          onClick={() => handleAdjustStock(material.id)}
                          className="btn btn-sm btn-success"
                        >
                          OK
                        </button>
                        <button
                          onClick={() => {
                            setAdjusting(null)
                            setAdjustQty('')
                          }}
                          className="btn btn-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setAdjusting(material.id)}
                        className="btn btn-sm btn-primary"
                      >
                        Adjust Stock
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sidebar: Summary & Suppliers */}
        <div className="materials-sidebar">
          {/* Summary Card */}
          <div className="summary-card">
            <h3>📊 Summary</h3>
            <div className="summary-item">
              <span>Total Materials</span>
              <span className="value">{materials.length}</span>
            </div>
            <div className="summary-item">
              <span>Inventory Value</span>
              <span className="value">{formatPrice(totalValue, getDefaultCurrency())}</span>
            </div>
            <div className="summary-item">
              <span>Last Updated</span>
              <span className="value">{new Date().toLocaleDateString()}</span>
            </div>
          </div>

          {/* Suppliers Card */}
          <div className="suppliers-card">
            <h3>🏢 Suppliers</h3>
            <div className="suppliers-list">
              {suppliers.map((supplier) => (
                <div key={supplier.id} className="supplier-item">
                  <div className="supplier-name">{supplier.name}</div>
                  <div className="supplier-info">
                    <span>{supplier.country}</span>
                    <span className="lead-time">{supplier.leadTime}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="quick-stats">
            <h3>⚡ Quick Stats</h3>
            <div className="stat-item">
              <span className="label">Fragrance</span>
              <span className="value">
                {materials.filter((m) => m.category === 'fragrance').length}
              </span>
            </div>
            <div className="stat-item">
              <span className="label">Alcohol</span>
              <span className="value">
                {materials.filter((m) => m.category === 'alcohol').length}
              </span>
            </div>
            <div className="stat-item">
              <span className="label">Oil</span>
              <span className="value">
                {materials.filter((m) => m.category === 'oil').length}
              </span>
            </div>
            <div className="stat-item">
              <span className="label">Container</span>
              <span className="value">
                {materials.filter((m) => m.category === 'container').length}
              </span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .raw-materials-container {
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

        .materials-layout {
          display: grid;
          grid-template-columns: 1fr 350px;
          gap: 2rem;
        }

        .controls {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .controls-left {
          flex: 1;
        }

        .search-input {
          width: 100%;
          padding: 0.75rem 1rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid var(--color-accent);
          border-radius: 6px;
          color: var(--color-text);
        }

        .form-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--color-border);
          border-radius: 8px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .form-card h3 {
          margin-top: 0;
          color: var(--color-accent);
        }

        .material-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group label {
          color: var(--color-accent);
          font-weight: 600;
          margin-bottom: 0.3rem;
          font-size: 0.9rem;
        }

        .form-group input,
        .form-group select {
          padding: 0.6rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid var(--color-border);
          border-radius: 4px;
          color: var(--color-text);
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          margin-top: 0.5rem;
        }

        .materials-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .material-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--color-border);
          border-radius: 8px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          transition: all 0.3s ease;
        }

        .material-card:hover {
          border-color: var(--color-accent);
          background: var(--color-surface);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: start;
        }

        .card-header h4 {
          margin: 0;
          color: var(--color-accent);
        }

        .card-details {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .detail {
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;
        }

        .detail span:first-child {
          color: var(--color-gray);
        }

        .detail .value {
          color: var(--color-text);
          font-weight: 600;
        }

        .detail .value.quantity {
          color: var(--color-accent);
        }

        .detail .value.price {
          color: var(--color-success);
        }

        .card-actions {
          margin-top: 0.5rem;
        }

        .adjust-input {
          display: flex;
          gap: 0.3rem;
        }

        .adjust-input input {
          flex: 1;
          padding: 0.4rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid var(--color-accent);
          border-radius: 4px;
          color: var(--color-text);
        }

        .materials-sidebar {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .summary-card,
        .suppliers-card,
        .quick-stats {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--color-border);
          border-radius: 8px;
          padding: 1.5rem;
        }

        .summary-card h3,
        .suppliers-card h3,
        .quick-stats h3 {
          margin-top: 0;
          color: var(--color-accent);
          font-size: 1rem;
          margin-bottom: 1rem;
        }

        .summary-item {
          display: flex;
          justify-content: space-between;
          padding: 0.75rem 0;
          border-bottom: 1px solid var(--color-surface);
        }

        .summary-item .value {
          color: var(--color-accent);
          font-weight: 700;
        }

        .suppliers-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .supplier-item {
          background: var(--color-surface);
          padding: 0.75rem;
          border-radius: 4px;
        }

        .supplier-name {
          color: var(--color-accent);
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .supplier-info {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          color: var(--color-gray);
        }

        .lead-time {
          color: var(--color-accent);
        }

        .stat-item {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0;
        }

        .stat-item .label {
          color: var(--color-gray);
          font-size: 0.9rem;
        }

        .stat-item .value {
          color: var(--color-accent);
          font-weight: 700;
        }

        .badge {
          display: inline-block;
          padding: 0.3rem 0.6rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .badge-info {
          background: rgba(52, 152, 219, 0.2);
          color: #3498db;
        }

        .loading,
        .empty-state {
          text-align: center;
          padding: 2rem;
          color: var(--color-gray);
        }

        @media (max-width: 1024px) {
          .materials-layout {
            grid-template-columns: 1fr;
          }

          .materials-sidebar {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 768px) {
          .materials-sidebar {
            grid-template-columns: 1fr;
          }

          .materials-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}
