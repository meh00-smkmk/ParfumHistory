import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom'
import './App.css'
import { ThemeProvider } from './hooks/useTheme.jsx'
import ErrorBoundary from './components/ErrorBoundary'
import { LicenseScreen } from './components/LicenseScreen'
import { isLicensed } from './utils/licenseValidator'

// Import all pages
import LoginPage from './pages/LoginPage'
import POSPage from './pages/POSPage'
import InventoryPage from './pages/InventoryPage'
import ClientsPage from './pages/ClientsPage'
import ProductsPage from './pages/ProductsPage'
import AnalyticsPage from './pages/AnalyticsPage'
import AccountingPage from './pages/AccountingPage'
import SettingsPage from './pages/SettingsPage'
import RawMaterialsPage from './pages/RawMaterialsPage'
import AdminPanel from './pages/AdminPanel'
import SalesHistoryPage from './pages/SalesHistoryPage'
import CustomerHistoryPage from './pages/CustomerHistoryPage'

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

function AppRouter() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [isLicensedApp, setIsLicensedApp] = useState(false)
  const [showLicenseScreen, setShowLicenseScreen] = useState(false)

  const location = useLocation()
  const isRouteAdmin = location.pathname.startsWith('/admin')

  useEffect(() => {
    const licensed = isLicensed()
    setIsLicensedApp(licensed)
    setShowLicenseScreen(!licensed)

    if (licensed) {
      const token = localStorage.getItem('authToken')
      if (token) {
        setIsLoggedIn(true)
        const userData = localStorage.getItem('userData')
        if (userData) {
          setUser(JSON.parse(userData))
        }
      }
      // No auto-login: force users to actually log in
    }
    setIsInitialized(true)
  }, [])

  const handleLicenseValid = () => {
    setShowLicenseScreen(false)
    setIsLicensedApp(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('userData')
    setIsLoggedIn(false)
    setUser(null)
  }

  if (!isInitialized) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#1a1a2e' }}>
        <div style={{ color: '#d4af37', fontSize: '1.2rem' }}>Loading...</div>
      </div>
    )
  }

  // Admin route bypasses license and login completely
  if (isRouteAdmin) {
    return (
      <Routes>
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    )
  }

  // QR Code route bypasses license and login completely
  if (location.search.includes('?data=')) {
    return <CustomerHistoryPage />
  }

  // Not licensed
  if (!isLicensedApp) {
    return (
      <>
        {showLicenseScreen && <LicenseScreen onLicenseValid={handleLicenseValid} />}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#1a1a2e' }}>
          <div style={{ color: '#d4af37', fontSize: '1.2rem' }}>License required...</div>
        </div>
      </>
    )
  }

  // Licensed - normal app routes
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/history" element={<CustomerHistoryPage />} />

      <Route
        path="/*"
        element={
          isLoggedIn ? (
            <DashboardLayout user={user} onLogout={handleLogout}>
              <Routes>
                <Route path="/pos" element={<POSPage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/sales-history" element={<SalesHistoryPage />} />
                {/* Manager-only routes */}
                {user?.role !== 'seller' && (
                  <>
                    <Route path="/inventory" element={<InventoryPage />} />
                    <Route path="/clients" element={<ClientsPage />} />
                    <Route path="/analytics" element={<AnalyticsPage />} />
                    <Route path="/accounting" element={<AccountingPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/raw-materials" element={<RawMaterialsPage />} />
                  </>
                )}
                <Route path="/" element={<Navigate to="/pos" replace />} />
                <Route path="*" element={<Navigate to="/pos" replace />} />
              </Routes>
            </DashboardLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  )
}

/**
 * NAVIGATION ITEMS
 * 'roles' array defines who can see each nav item.
 * 'manager' = full access
 * 'seller'  = restricted (POS + Products + Sales History only)
 */
const ALL_NAV_ITEMS = [
  { path: '/pos', label: 'POS', roles: ['manager', 'seller'] },
  { path: '/products', label: 'Produits', roles: ['manager', 'seller'] },
  { path: '/sales-history', label: 'Historique', roles: ['manager', 'seller'] },
  { path: '/inventory', label: 'Inventaire', roles: ['manager'] },
  { path: '/clients', label: 'Clients', roles: ['manager'] },
  { path: '/analytics', label: 'Analytiques', roles: ['manager'] },
  { path: '/accounting', label: 'Comptabilité', roles: ['manager'] },
  { path: '/raw-materials', label: 'Matières', roles: ['manager'] },
  { path: '/settings', label: 'Paramètres', roles: ['manager'] },
]

function DashboardLayout({ user, onLogout, children }) {
  const userRole = user?.role || 'seller'
  const navItems = ALL_NAV_ITEMS.filter(item => item.roles.includes(userRole))
  const location = useLocation()

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="logo">
          <h1>PerfumierPro</h1>
          <div className="logo-divider"></div>
        </div>
        <nav className="main-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="nav-label">{item.label}</span>
              <span className="nav-indicator"></span>
            </Link>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-name">{user?.name || 'User'}</div>
            <div className="user-role">
              {userRole === 'manager' ? 'Manager' : 'Vendeur'}
            </div>
          </div>
          <button className="logout-btn" onClick={onLogout}>
            Déconnexion
          </button>
        </div>
      </aside>

      <main className="dashboard-content">{children}</main>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
            Ubuntu, Cantarell, sans-serif;
        }

        .dashboard-layout {
          display: grid;
          grid-template-columns: 220px 1fr;
          height: 100vh;
          background: var(--color-primary);
        }

        .sidebar {
          background: var(--color-dark);
          border-right: 1px solid var(--color-border);
          padding: 0;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          position: relative;
        }

        .sidebar::after {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 2px;
          height: 100%;
          background: linear-gradient(
            to bottom,
            transparent,
            var(--color-accent),
            transparent
          );
          opacity: 0.5;
        }

        .logo {
          padding: 1.6rem 1.2rem 1rem;
          text-align: center;
        }

        .logo h1 {
          color: var(--color-accent);
          font-size: 1.25rem;
          font-weight: 800;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin: 0;
        }

        .logo-divider {
          height: 2px;
          margin-top: 1rem;
          background: linear-gradient(
            90deg,
            transparent,
            var(--color-accent),
            transparent
          );
          opacity: 0.6;
        }

        .main-nav {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
          padding: 0.6rem 0.6rem;
        }

        .nav-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.7rem 1rem;
          color: var(--color-gray);
          text-decoration: none;
          border-radius: 8px;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          font-size: 0.88rem;
          font-weight: 500;
          letter-spacing: 0.3px;
          position: relative;
          overflow: hidden;
        }

        .nav-indicator {
          width: 4px;
          height: 0;
          border-radius: 2px;
          background: var(--color-accent);
          transition: height 0.25s ease;
          flex-shrink: 0;
        }

        .nav-item:hover {
          background: var(--color-surface);
          color: var(--color-text);
          padding-left: 1.2rem;
        }

        .nav-item:hover .nav-indicator {
          height: 16px;
        }

        .nav-item.active {
          background: linear-gradient(
            90deg,
            var(--color-surface),
            transparent
          );
          color: var(--color-accent);
          font-weight: 700;
          padding-left: 1.2rem;
        }

        .nav-item.active .nav-indicator {
          height: 24px;
          box-shadow: 0 0 8px var(--color-accent);
        }

        .nav-label {
          font-size: 0.88rem;
        }

        .sidebar-footer {
          border-top: 1px solid var(--color-border);
          padding: 0.8rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.7rem;
          margin-top: auto;
        }

        .user-info {
          text-align: center;
        }

        .user-name {
          color: var(--color-accent);
          font-weight: 600;
          font-size: 0.9rem;
        }

        .user-role {
          color: var(--color-gray);
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 600;
        }

        .logout-btn {
          padding: 0.5rem;
          background: transparent;
          border: 1px solid var(--color-danger);
          color: var(--color-danger);
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.82rem;
          letter-spacing: 0.5px;
          transition: all 0.3s ease;
        }

        .logout-btn:hover {
          background: var(--color-danger);
          color: var(--color-text);
        }

        .dashboard-content {
          overflow-y: auto;
          background: var(--color-background);
        }

        @media (max-width: 768px) {
          .dashboard-layout {
            grid-template-columns: 1fr;
            grid-template-rows: auto 1fr;
          }

          .sidebar {
            grid-column: 1 / -1;
            border-right: none;
            border-bottom: 1px solid var(--color-border);
            display: grid;
            grid-template-columns: auto 1fr auto;
            align-items: center;
            gap: 0.7rem;
            padding: 0.5rem 0.7rem;
          }

          .sidebar::after {
            display: none;
          }

          .logo {
            padding: 0;
            margin-bottom: 0;
          }

          .logo h1 {
            font-size: 0.9rem;
          }

          .logo-divider {
            display: none;
          }

          .main-nav {
            flex-direction: row;
            overflow-x: auto;
            padding: 0;
            gap: 2px;
          }

          .nav-item {
            padding: 0.4rem 0.6rem;
            white-space: nowrap;
            font-size: 0.8rem;
          }

          .nav-indicator {
            display: none;
          }

          .sidebar-footer {
            border-top: none;
            flex-direction: row;
            gap: 0.3rem;
            padding: 0;
          }

          .user-info {
            display: none;
          }

          .logout-btn {
            padding: 0.3rem 0.5rem;
            font-size: 0.78rem;
          }
        }
      `}</style>
    </div>
  )
}

export default App
