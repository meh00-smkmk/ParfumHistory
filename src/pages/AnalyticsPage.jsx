import { useState, useEffect } from 'react'
import { formatPrice, getDefaultCurrency } from '@/utils/currencyFormatter'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { getSales, getSalesSummary } from '@/api/sales'
import { getFinancialKPIs } from '@/api/accounting'
import '../styles/theme.css'

// Mock data functions for missing API methods
const getSalesRevenue = async (options = {}) => {
  return { 
    success: true, 
    data: {
      totalRevenue: 45000,
      totalOrders: 180,
      avgTransactionValue: 250,
      transactionCount: 180
    } 
  }
}

const getRevenueReport = async (options = {}) => {
  return { 
    success: true, 
    data: {
      totalRevenue: 45000,
      totalOrders: 180
    } 
  }
}

const getTopProducts = async (options = {}) => {
  return { 
    success: true, 
    data: [
      { id: 1, name: 'Perfume A', sales: 450, revenue: 13500 },
      { id: 2, name: 'Perfume B', sales: 380, revenue: 11400 },
      { id: 3, name: 'Perfume C', sales: 320, revenue: 9600 },
      { id: 4, name: 'Perfume D', sales: 270, revenue: 8100 },
      { id: 5, name: 'Perfume E', sales: 210, revenue: 6300 }
    ]
  }
}

const getSalesByCategory = async (options = {}) => {
  return { 
    success: true, 
    data: [
      { name: 'Premium', value: 18000, revenue: 18000, category: 'Premium' },
      { name: 'Standard', value: 15000, revenue: 15000, category: 'Standard' },
      { name: 'Budget', value: 12000, revenue: 12000, category: 'Budget' }
    ]
  }
}

const getMonthlyTrend = async (options = {}) => {
  return { 
    success: true, 
    data: [
      { month: 'Jan', revenue: 35000 },
      { month: 'Feb', revenue: 38000 },
      { month: 'Mar', revenue: 41000 },
      { month: 'Apr', revenue: 39000 },
      { month: 'May', revenue: 42000 },
      { month: 'Jun', revenue: 45000 }
    ]
  }
}

const COLORS = ['var(--color-accent)', 'var(--color-dark)', 'var(--color-primary)', '#533483', 'var(--color-danger)']

export default function AnalyticsPage() {
  const [revenue, setRevenue] = useState(null)
  const [topProducts, setTopProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [monthlyTrend, setMonthlyTrend] = useState([])
  const [loading, setLoading] = useState(false)
  const [dateRange, setDateRange] = useState('month')

  useEffect(() => {
    loadAnalytics()
  }, [dateRange])

  const loadAnalytics = async () => {
    setLoading(true)

    const params = {
      startDate: getStartDate(dateRange),
      endDate: new Date().toISOString(),
    }

    const [revenueResult, topResult, catResult, trendResult] = await Promise.all([
      getRevenueReport(params),
      getTopProducts(5),
      getSalesByCategory(),
      getMonthlyTrend(),
    ])

    if (revenueResult.success) {
      setRevenue(revenueResult.data)
    }
    if (topResult.success) {
      setTopProducts(topResult.data)
    }
    if (catResult.success) {
      setCategories(catResult.data)
    }
    if (trendResult.success) {
      setMonthlyTrend(trendResult.data)
    }

    setLoading(false)
  }

  const getStartDate = (range) => {
    const now = new Date()
    const startDate = new Date()

    switch (range) {
      case 'week':
        startDate.setDate(now.getDate() - 7)
        break
      case 'month':
        startDate.setMonth(now.getMonth() - 1)
        break
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        startDate.setMonth(now.getMonth() - 1)
    }

    return startDate.toISOString()
  }

  return (
    <div className="analytics-container">
      <header className="page-header">
        <h1>Analytiques & Rapports</h1>
      </header>

      <div className="analytics-controls">
        <div className="date-range">
          <button
            className={`range-btn ${dateRange === 'week' ? 'active' : ''}`}
            onClick={() => setDateRange('week')}
          >
            Week
          </button>
          <button
            className={`range-btn ${dateRange === 'month' ? 'active' : ''}`}
            onClick={() => setDateRange('month')}
          >
            Month
          </button>
          <button
            className={`range-btn ${dateRange === 'year' ? 'active' : ''}`}
            onClick={() => setDateRange('year')}
          >
            Year
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading analytics...</div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="kpi-grid">
            <div className="kpi-card">
              <div className="kpi-label">Total Revenue</div>
              <div className="kpi-value">
                {formatPrice(revenue?.totalRevenue || 0, getDefaultCurrency())}
              </div>
              <div className="kpi-change">
                {revenue?.growth ? (
                  <span className={revenue.growth > 0 ? 'positive' : 'negative'}>
                    {revenue.growth > 0 ? '↑' : '↓'} {Math.abs(revenue.growth).toFixed(1)}%
                  </span>
                ) : null}
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-label">Total Orders</div>
              <div className="kpi-value">{revenue?.totalOrders || 0}</div>
            </div>

            <div className="kpi-card">
              <div className="kpi-label">Avg Order Value</div>
              <div className="kpi-value">
                {formatPrice((revenue?.totalRevenue / (revenue?.totalOrders || 1)) || 0, getDefaultCurrency())}
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-label">Top Category</div>
              <div className="kpi-value">
                {categories.length > 0 ? categories[0].category : 'N/A'}
              </div>
              <div className="kpi-subtitle">
                {formatPrice(categories.length > 0 ? categories[0].sales || 0 : 0, getDefaultCurrency())} sales
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="charts-grid">
            {/* Revenue Trend */}
            <div className="chart-card">
              <h3>Revenue Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#d4af37" />
                  <XAxis stroke="#d4af37" />
                  <YAxis stroke="#d4af37" />
                  <Tooltip
                    contentStyle={{
                      background: '#1a1a2e',
                      border: '1px solid #d4af37',
                      borderRadius: '6px',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#d4af37"
                    strokeWidth={2}
                    dot={{ fill: '#d4af37' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Sales by Category */}
            <div className="chart-card">
              <h3>Sales by Category</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categories}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#d4af37"
                    dataKey="value"
                  >
                    {categories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: '#1a1a2e',
                      border: '1px solid #d4af37',
                      borderRadius: '6px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Top Products */}
            <div className="chart-card full-width">
              <h3>Top Performing Products</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topProducts}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#d4af37" />
                  <XAxis stroke="#d4af37" dataKey="name" />
                  <YAxis stroke="#d4af37" />
                  <Tooltip
                    contentStyle={{
                      background: '#1a1a2e',
                      border: '1px solid #d4af37',
                      borderRadius: '6px',
                    }}
                  />
                  <Bar dataKey="sales" fill="#d4af37" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Statistics Table */}
          <div className="stats-table">
            <h3>Category Performance</h3>
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Sales</th>
                  <th>Units Sold</th>
                  <th>% of Total</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat, idx) => {
                  const percentage = (cat.sales / (revenue?.totalRevenue || 1)) * 100
                  return (
                    <tr key={idx}>
                      <td>{cat.category}</td>
                      <td>{formatPrice(cat.sales || 0, getDefaultCurrency())}</td>
                      <td>{cat.quantity}</td>
                      <td>{percentage.toFixed(1)}%</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      <style>{`
        .analytics-container {
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

        .analytics-controls {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .date-range {
          display: flex;
          gap: 0.5rem;
        }

        .range-btn {
          padding: 0.5rem 1rem;
          background: transparent;
          border: 2px solid var(--color-accent);
          color: var(--color-accent);
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .range-btn.active,
        .range-btn:hover {
          background: var(--color-accent);
          color: var(--color-primary);
        }

        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .kpi-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--color-border);
          border-radius: 8px;
          padding: 1.5rem;
          text-align: center;
        }

        .kpi-label {
          color: var(--color-gray);
          font-size: 0.85rem;
          margin-bottom: 0.5rem;
        }

        .kpi-value {
          color: var(--color-accent);
          font-size: 1.8rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .kpi-subtitle {
          color: var(--color-gray);
          font-size: 0.85rem;
        }

        .kpi-change {
          margin-top: 0.5rem;
        }

        .kpi-change .positive {
          color: var(--color-success);
        }

        .kpi-change .negative {
          color: var(--color-danger);
        }

        .charts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .chart-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--color-border);
          border-radius: 8px;
          padding: 1.5rem;
        }

        .chart-card.full-width {
          grid-column: 1 / -1;
        }

        .chart-card h3 {
          margin-top: 0;
          color: var(--color-accent);
          margin-bottom: 1rem;
        }

        .stats-table {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--color-border);
          border-radius: 8px;
          padding: 1.5rem;
        }

        .stats-table h3 {
          margin-top: 0;
          color: var(--color-accent);
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

        .loading {
          text-align: center;
          padding: 2rem;
          color: var(--color-gray);
        }

        @media (max-width: 768px) {
          .charts-grid {
            grid-template-columns: 1fr;
          }

          .kpi-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}
