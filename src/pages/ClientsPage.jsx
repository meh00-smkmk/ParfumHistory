import { useState, useEffect } from 'react'
import { formatPrice, getDefaultCurrency } from '@/utils/currencyFormatter'
import { getClients, createClient, updateClient, getClientPurchaseHistory, getTopClients } from '@/api/clients'
import '../styles/theme.css'

export default function ClientsPage() {
  const [clients, setClients] = useState([])
  const [topClients, setTopClients] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [selectedClient, setSelectedClient] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    type: 'retail',
  })

  useEffect(() => {
    loadClients()
  }, [])

  const loadClients = async () => {
    setLoading(true)
    const [clientsResult, topResult] = await Promise.all([
      getClients({ limit: 100 }),
      getTopClients(10),
    ])

    if (clientsResult.success) setClients(clientsResult.data)
    if (topResult.success) setTopClients(topResult.data)
    setLoading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    let result
    if (selectedClient) {
      result = await updateClient(selectedClient.id, formData)
    } else {
      result = await createClient(formData)
    }

    if (result.success) {
      loadClients()
      setShowForm(false)
      setSelectedClient(null)
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        type: 'retail',
      })
    } else {
      setError(result.error || 'Operation failed')
    }
    setLoading(false)
  }

  const handleEdit = (client) => {
    setSelectedClient(client)
    setFormData({
      name: client.name,
      email: client.email,
      phone: client.phone,
      address: client.address,
      city: client.city,
      type: client.type,
    })
    setShowForm(true)
  }

  const filteredClients = clients.filter((c) =>
    c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="clients-container">
      <header className="page-header">
        <h1>Gestion des Clients</h1>
      </header>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="clients-layout">
        {/* Left: Client List */}
        <div className="clients-list">
          <div className="list-header">
            <h2>All Clients</h2>
            <button
              onClick={() => {
                setShowForm(true)
                setSelectedClient(null)
                setFormData({
                  name: '',
                  email: '',
                  phone: '',
                  address: '',
                  city: '',
                  type: 'retail',
                })
              }}
              className="btn btn-primary"
            >
              + Add Client
            </button>
          </div>

          <input
            type="text"
            placeholder="Search clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />

          <div className="clients-table">
            {loading ? (
              <div className="loading">Loading...</div>
            ) : filteredClients.length === 0 ? (
              <div className="empty-state">No clients found</div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Type</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.map((client) => (
                    <tr key={client.id}>
                      <td>{client.name}</td>
                      <td>{client.email}</td>
                      <td>{client.phone}</td>
                      <td>
                        <span className="badge badge-info">{client.type}</span>
                      </td>
                      <td>
                        <button
                          onClick={() => handleEdit(client)}
                          className="btn btn-sm btn-primary"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right: Form or Top Clients */}
        <div className="clients-sidebar">
          {showForm ? (
            <div className="form-card">
              <h2>{selectedClient ? 'Edit Client' : 'New Client'}</h2>
              <form onSubmit={handleSubmit} className="client-form">
                <div className="form-group">
                  <label>Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="retail">Retail</option>
                    <option value="wholesale">Wholesale</option>
                    <option value="vip">VIP</option>
                  </select>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false)
                      setSelectedClient(null)
                    }}
                    className="btn btn-secondary"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="top-clients">
              <h2>⭐ Top Clients</h2>
              {topClients.map((client) => (
                <div key={client.id} className="top-client-card">
                  <div className="client-name">{client.name}</div>
                  <div className="client-spent">
                    Total Spent: {formatPrice(client.totalSpent || 0, getDefaultCurrency())}
                  </div>
                  <div className="client-purchases">
                    Purchases: {client.purchaseCount || 0}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .clients-container {
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

        .clients-layout {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 2rem;
        }

        .clients-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .list-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .list-header h2 {
          margin: 0;
          color: var(--color-accent);
        }

        .search-input {
          padding: 0.75rem 1rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid var(--color-accent);
          border-radius: 6px;
          color: var(--color-text);
          width: 100%;
        }

        .clients-table {
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
          border-bottom: 2px solid var(--color-accent);
        }

        td {
          padding: 0.75rem 1rem;
          border-bottom: 1px solid var(--color-surface);
        }

        tr:hover {
          background: var(--color-surface);
        }

        .badge {
          display: inline-block;
          padding: 0.4rem 0.8rem;
          border-radius: 4px;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .badge-info {
          background: rgba(52, 152, 219, 0.2);
          color: #3498db;
        }

        .form-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--color-border);
          border-radius: 8px;
          padding: 1.5rem;
        }

        .form-card h2 {
          margin-top: 0;
          color: var(--color-accent);
        }

        .client-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
        }

        .top-clients {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--color-border);
          border-radius: 8px;
          padding: 1.5rem;
        }

        .top-clients h2 {
          margin-top: 0;
          color: var(--color-accent);
        }

        .top-client-card {
          background: var(--color-surface);
          padding: 1rem;
          border-radius: 6px;
          margin-bottom: 1rem;
        }

        .client-name {
          font-weight: 600;
          font-size: 1rem;
          margin-bottom: 0.3rem;
        }

        .client-spent,
        .client-purchases {
          color: var(--color-gray);
          font-size: 0.85rem;
        }

        .loading,
        .empty-state {
          text-align: center;
          padding: 2rem;
          color: var(--color-gray);
        }

        @media (max-width: 768px) {
          .clients-layout {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}
