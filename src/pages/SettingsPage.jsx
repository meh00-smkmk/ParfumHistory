import { useState, useEffect } from 'react'
import { getCurrentUser } from '@/api/auth'
import ThemeSwitcher from '../components/ThemeSwitcher'
import { BrandingSettings } from '../components/BrandingSettings'
import '../styles/theme.css'

// Mock functions for missing API methods
const updateUser = async (userData) => {
  return { 
    success: true, 
    data: userData
  }
}

const updatePassword = async (passwordData) => {
  return { 
    success: true, 
    data: { message: 'Password updated' }
  }
}

const getSystemSettings = async () => {
  return { 
    success: true, 
    data: {
      storeName: 'PerfumierPro Store',
      currency: 'USD',
      taxRate: '8',
      notificationsEnabled: true,
      theme: 'luxury-dark'
    }
  }
}

const updateSystemSettings = async (settings) => {
  return { 
    success: true, 
    data: settings
  }
}

export default function SettingsPage() {
  const [currentTab, setCurrentTab] = useState('profile')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [user, setUser] = useState(null)
  const [settings, setSettings] = useState(null)

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [systemSettings, setSystemSettings] = useState({
    storeName: '',
    currency: localStorage.getItem('selectedCurrency') || 'DZD',
    taxRate: '0',
    notificationsEnabled: true,
    theme: 'dark',
  })

  // Telegram settings
  const [telegramData, setTelegramData] = useState({ botToken: '', chatId: '' })
  const [telegramLocked, setTelegramLocked] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    setLoading(true)
    const [userResult, settingsResult] = await Promise.all([
      getCurrentUser(),
      getSystemSettings(),
    ])

    if (userResult.success) {
      setUser(userResult.data)
      setProfileData({
        name: userResult.data.name || '',
        email: userResult.data.email || '',
        phone: userResult.data.phone || '',
      })
    }

    if (settingsResult.success) {
      setSettings(settingsResult.data)
      setSystemSettings(settingsResult.data)
    }

    // Load Telegram if saved
    const savedToken = localStorage.getItem('telegramBotToken') || ''
    const savedChat = localStorage.getItem('telegramChatId') || ''
    setTelegramData({ botToken: savedToken, chatId: savedChat })
    if (savedToken && savedChat) setTelegramLocked(true) // Lock if existing

    setLoading(false)
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    const result = await updateUser(profileData)
    if (result.success) {
      setSuccess('Profile updated successfully')
      setUser(result.data)
    } else {
      setError(result.error || 'Failed to update profile')
    }
    setLoading(false)
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    const result = await updatePassword({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    })

    if (result.success) {
      setSuccess('Password changed successfully')
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
    } else {
      setError(result.error || 'Failed to change password')
    }
    setLoading(false)
  }

  const handleSystemSettingsUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    const result = await updateSystemSettings(systemSettings)
    if (result.success) {
      setSuccess('System settings updated successfully')
      setSettings(result.data)
    } else {
      setError(result.error || 'Failed to update settings')
    }
    setLoading(false)
  }

  const handleTelegramSave = (e) => {
    e.preventDefault()
    if (!telegramData.botToken || !telegramData.chatId) {
      setError('Bot Token et Chat ID sont requis')
      return
    }
    localStorage.setItem('telegramBotToken', telegramData.botToken)
    localStorage.setItem('telegramChatId', telegramData.chatId)
    setTelegramLocked(true)
    setSuccess('Configuration Telegram enregistrée et verrouillée 🔒')
    setTimeout(() => setSuccess(''), 3000)
  }

  // ── Database Backup ──
  const DB_KEYS = [
    'perfume_products_db', 'perfume_categories_db', 'perfume_sales_history',
    'perfume_expenses', 'perfume_clients_db', 'perfume_loyalty_db',
    'shopName', 'shopPhone', 'shopAddress', 'shopLogo',
    'selectedCurrency', 'selectedTheme', 'appSettings',
    'telegramBotToken', 'telegramChatId',
  ]

  const handleExportJSON = () => {
    const backup = {}
    DB_KEYS.forEach(key => {
      const val = localStorage.getItem(key)
      if (val !== null) backup[key] = val
    })
    backup._meta = {
      exportDate: new Date().toISOString(),
      version: '1.0.0',
      app: 'PerfumierPro',
    }
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `PerfumierPro_Backup_${new Date().toISOString().slice(0,10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    setSuccess('Backup téléchargé avec succès !')
    setTimeout(() => setSuccess(''), 3000)
  }

  const handleExportCSV = () => {
    // Export sales history as CSV
    const raw = localStorage.getItem('perfume_sales_history')
    const sales = raw ? JSON.parse(raw) : []
    if (sales.length === 0) {
      setError('Aucune vente à exporter.')
      setTimeout(() => setError(''), 3000)
      return
    }
    let csv = 'Date,Reçu,Client,Articles,Sous-total,Remise,Total,Paiement\n'
    sales.forEach(s => {
      const items = (s.items || []).map(i => `${i.name} ${i.size}ml x${i.quantity}`).join(' | ')
      csv += `"${s.timestamp || ''}","${s.receiptId || ''}","${s.customerPhone || ''}","${items}",${s.subtotal || 0},${s.loyaltyDiscount || 0},${s.total || 0},"${s.paymentMethod || ''}"\n`
    })
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `PerfumierPro_Ventes_${new Date().toISOString().slice(0,10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
    setSuccess('Historique des ventes exporté en CSV !')
    setTimeout(() => setSuccess(''), 3000)
  }

  const handleImportJSON = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result)
        if (!data._meta || data._meta.app !== 'PerfumierPro') {
          setError('Fichier invalide. Ce n\'est pas un backup PerfumierPro.')
          return
        }
        const count = Object.keys(data).filter(k => k !== '_meta').length
        if (!window.confirm(`Restaurer ${count} clés de données ?\nCela écrasera les données actuelles.`)) return
        Object.entries(data).forEach(([key, val]) => {
          if (key !== '_meta') localStorage.setItem(key, val)
        })
        setSuccess(`Restauration réussie ! ${count} clés importées. Rechargement...`)
        setTimeout(() => window.location.reload(), 1500)
      } catch {
        setError('Erreur de lecture du fichier JSON.')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }


  return (
    <div className="settings-container">
      <header className="page-header">
        <h1>Paramètres</h1>
      </header>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="settings-layout">
        {/* Sidebar Tabs */}
        <div className="settings-sidebar">
          <button
            className={`tab-btn ${currentTab === 'profile' ? 'active' : ''}`}
            onClick={() => setCurrentTab('profile')}
          >
            Mon Profil
          </button>
          <button
            className={`tab-btn ${currentTab === 'password' ? 'active' : ''}`}
            onClick={() => setCurrentTab('password')}
          >
            Mot de Passe
          </button>
          <button
            className={`tab-btn ${currentTab === 'system' ? 'active' : ''}`}
            onClick={() => setCurrentTab('system')}
          >
            Système
          </button>
          <button
            className={`tab-btn ${currentTab === 'branding' ? 'active' : ''}`}
            onClick={() => setCurrentTab('branding')}
          >
            Branding Boutique
          </button>
          <button
            className={`tab-btn ${currentTab === 'telegram' ? 'active' : ''}`}
            onClick={() => setCurrentTab('telegram')}
          >
            Telegram Bot
          </button>
          <button
            className={`tab-btn ${currentTab === 'backup' ? 'active' : ''}`}
            onClick={() => setCurrentTab('backup')}
          >
            Sauvegarde
          </button>
          <button
            className={`tab-btn ${currentTab === 'about' ? 'active' : ''}`}
            onClick={() => setCurrentTab('about')}
          >
            À propos
          </button>
        </div>

        {/* Content Area */}
        <div className="settings-content">
          {loading && currentTab !== 'about' ? (
            <div className="loading">Loading...</div>
          ) : (
            <>
              {/* Profile Tab */}
              {currentTab === 'profile' && (
                <div className="settings-form">
                  <h2>My Profile</h2>
                  <form onSubmit={handleProfileUpdate}>
                    <div className="form-group">
                      <label>Full Name</label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) =>
                          setProfileData({ ...profileData, name: e.target.value })
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) =>
                          setProfileData({ ...profileData, email: e.target.value })
                        }
                        disabled
                      />
                      <small>Email cannot be changed</small>
                    </div>

                    <div className="form-group">
                      <label>Phone</label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) =>
                          setProfileData({ ...profileData, phone: e.target.value })
                        }
                      />
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      Save Changes
                    </button>
                  </form>
                </div>
              )}

              {/* Password Tab */}
              {currentTab === 'password' && (
                <div className="settings-form">
                  <h2>Change Password</h2>
                  <form onSubmit={handlePasswordChange}>
                    <div className="form-group">
                      <label>Current Password</label>
                      <input
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            currentPassword: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>New Password</label>
                      <input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            newPassword: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Confirm Password</label>
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            confirmPassword: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      Update Password
                    </button>
                  </form>
                </div>
              )}

              {/* System Settings Tab */}
              {currentTab === 'system' && (
                <div className="settings-form">
                  <h2>System Settings</h2>
                  <form onSubmit={handleSystemSettingsUpdate}>
                    <div className="form-group">
                      <label>Store Name</label>
                      <input
                        type="text"
                        value={systemSettings.storeName}
                        onChange={(e) =>
                          setSystemSettings({
                            ...systemSettings,
                            storeName: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label>Currency</label>
                      <select
                        value={systemSettings.currency}
                        onChange={(e) => {
                          setSystemSettings({
                            ...systemSettings,
                            currency: e.target.value,
                          })
                          // Also save to localStorage for app-wide use
                          localStorage.setItem('selectedCurrency', e.target.value)
                        }}
                      >
                        <option value="USD">USD ($) - US Dollar</option>
                        <option value="DZD">DZD (د.ج) - Algerian Dinar</option>
                      </select>
                      <small>Select the currency for price display throughout the app. Default: DZD</small>
                    </div>

                    <div className="form-group">
                      <label>Tax Rate (%)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={systemSettings.taxRate}
                        onChange={(e) =>
                          setSystemSettings({
                            ...systemSettings,
                            taxRate: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="form-group checkbox">
                      <input
                        type="checkbox"
                        checked={systemSettings.notificationsEnabled}
                        onChange={(e) =>
                          setSystemSettings({
                            ...systemSettings,
                            notificationsEnabled: e.target.checked,
                          })
                        }
                      />
                      <label>Enable Notifications</label>
                    </div>

                    <div className="form-group">
                      <label>Theme</label>
                      <ThemeSwitcher />
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      Save Settings
                    </button>
                  </form>
                </div>
              )}

              {/* Branding Tab */}
              {currentTab === 'branding' && (
                <div className="settings-form">
                  <h2>Shop Branding</h2>
                  <BrandingSettings />
                </div>
              )}

              {/* Telegram Tab */}
              {currentTab === 'telegram' && (
                <div className="settings-form">
                  <h2>Notifications Telegram</h2>
                  <div className="telegram-info" style={{background: 'rgba(52,152,219,0.1)', padding:'1rem', borderRadius:'8px', marginBottom:'1.5rem', borderLeft:'4px solid #3498db'}}>
                    <p style={{margin:0, color:'#e0e0e0', fontSize:'0.9rem', lineHeight:'1.5'}}>
                      <strong>Configurez votre bot Telegram pour recevoir les reçus en temps réel.</strong><br/>
                      1. Créez un bot via @BotFather sur Telegram et copiez le <strong>Token</strong>.<br/>
                      2. Ajoutez le bot à votre groupe ou discutez avec lui.<br/>
                      3. Utilisez @userinfobot pour obtenir votre <strong>Chat ID</strong>.<br/>
                      <br/>
                      <strong style={{color:'#e74c3c'}}>⚠️ ATTENTION : Par mesure de sécurité, une fois configurés, ces identifiants seront verrouillés et ne pourront plus être modifiés à partir de cette interface.</strong>
                    </p>
                  </div>
                  
                  <form onSubmit={handleTelegramSave}>
                    <div className="form-group">
                      <label>Bot Token</label>
                      <input
                        type="password"
                        placeholder="123456789:ABCdefGHIjklMNOpqrsTUVwxyz..."
                        value={telegramLocked ? '••••••••••••••••••••••••••••••' : telegramData.botToken}
                        onChange={(e) => setTelegramData({ ...telegramData, botToken: e.target.value })}
                        disabled={telegramLocked}
                        required
                        style={{fontFamily:'monospace'}}
                      />
                    </div>
                    <div className="form-group">
                      <label>Chat ID / User ID</label>
                      <input
                        type="text"
                        placeholder="-100123456789 ou 12345678"
                        value={telegramLocked ? '••••••••••••' : telegramData.chatId}
                        onChange={(e) => setTelegramData({ ...telegramData, chatId: e.target.value })}
                        disabled={telegramLocked}
                        required
                        style={{fontFamily:'monospace'}}
                      />
                    </div>
                    {!telegramLocked ? (
                      <button type="submit" className="btn btn-primary" style={{background:'#d4af37', color:'#1a1a2e', border:'none', fontWeight:'bold', display:'flex', alignItems:'center', gap:'0.5rem'}}>
                        💾 Enregistrer et Verrouiller
                      </button>
                    ) : (
                      <div style={{background:'rgba(39,174,96,0.15)', color:'#4caf50', padding:'0.8rem', borderRadius:'6px', display:'flex', alignItems:'center', gap:'0.5rem', fontWeight:'bold'}}>
                        🔒 Configuration Verrouillée. Les reçus sont envoyés automatiquement.
                      </div>
                    )}
                  </form>
                </div>
              )}

              {/* Backup Tab */}
              {currentTab === 'backup' && (
                <div className="settings-form">
                  <h2>Sauvegarde & Restauration</h2>
                  <div style={{background: 'rgba(241,196,15,0.08)', padding:'1rem', borderRadius:'8px', marginBottom:'1.5rem', borderLeft:'4px solid #f1c40f'}}>
                    <p style={{margin:0, color:'var(--color-text)', fontSize:'0.9rem', lineHeight:'1.5'}}>
                      <strong>Sauvegardez vos données régulièrement !</strong><br/>
                      Toutes vos données sont stockées localement sur ce PC. En cas de panne, vous perdriez tout.
                      Exportez un backup sur clé USB au moins une fois par semaine.
                    </p>
                  </div>

                  <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', marginBottom:'1.5rem'}}>
                    <div style={{background:'var(--color-surface)', border:'1px solid var(--color-border)', borderRadius:'10px', padding:'1.5rem', textAlign:'center'}}>
                      <div style={{fontSize:'2rem', marginBottom:'0.5rem'}}>JSON</div>
                      <h4 style={{color:'var(--color-accent)', margin:'0 0 0.5rem'}}>Backup Complet</h4>
                      <p style={{color:'var(--color-gray)', fontSize:'0.82rem', margin:'0 0 1rem'}}>Produits, ventes, dépenses, clients, paramètres</p>
                      <button
                        className="btn btn-primary"
                        onClick={handleExportJSON}
                        style={{width:'100%'}}
                      >
                        Télécharger .JSON
                      </button>
                    </div>

                    <div style={{background:'var(--color-surface)', border:'1px solid var(--color-border)', borderRadius:'10px', padding:'1.5rem', textAlign:'center'}}>
                      <div style={{fontSize:'2rem', marginBottom:'0.5rem'}}>CSV</div>
                      <h4 style={{color:'var(--color-accent)', margin:'0 0 0.5rem'}}>Historique Ventes</h4>
                      <p style={{color:'var(--color-gray)', fontSize:'0.82rem', margin:'0 0 1rem'}}>Ouvrable dans Excel / Google Sheets</p>
                      <button
                        className="btn btn-primary"
                        onClick={handleExportCSV}
                        style={{width:'100%'}}
                      >
                        Télécharger .CSV
                      </button>
                    </div>
                  </div>

                  <div style={{background:'var(--color-surface)', border:'1px solid var(--color-border)', borderRadius:'10px', padding:'1.5rem'}}>
                    <h4 style={{color:'var(--color-accent)', margin:'0 0 0.5rem'}}>Restaurer un Backup</h4>
                    <p style={{color:'var(--color-gray)', fontSize:'0.82rem', margin:'0 0 1rem'}}>Importez un fichier .JSON précédemment exporté pour restaurer toutes vos données.</p>
                    <div style={{background:'rgba(231,76,60,0.08)', borderRadius:'6px', padding:'0.7rem', marginBottom:'1rem', borderLeft:'3px solid var(--color-danger)'}}>
                      <small style={{color:'var(--color-danger)'}}>Attention : la restauration écrase les données actuelles.</small>
                    </div>
                    <label
                      style={{display:'inline-block', padding:'0.6rem 1.2rem', background:'transparent', border:'2px solid var(--color-accent)', color:'var(--color-accent)', borderRadius:'6px', cursor:'pointer', fontWeight:'600', fontSize:'0.85rem', transition:'all 0.3s'}}
                    >
                      Choisir un fichier .JSON
                      <input type="file" accept=".json" onChange={handleImportJSON} style={{display:'none'}} />
                    </label>
                  </div>
                </div>
              )}

              {/* About Tab */}
              {currentTab === 'about' && (
                <div className="settings-form about-section">
                  <h2>About PerfumierPro</h2>
                  <div className="about-content">
                    <p>
                      <strong>Application:</strong> PerfumierPro Desktop Application
                    </p>
                    <p>
                      <strong>Version:</strong> 1.0.0
                    </p>
                    <p>
                      <strong>Built with:</strong> React 18 + Vite 5 + Electron
                    </p>
                    <p>
                      <strong>Technology Stack:</strong>
                    </p>
                    <ul>
                      <li>Frontend: React, Vite</li>
                      <li>Backend: Node.js + Express</li>
                      <li>Database: PostgreSQL</li>
                      <li>Charts: Recharts</li>
                      <li>API Client: Axios</li>
                    </ul>
                    <p>
                      <strong>Features:</strong>
                    </p>
                    <ul>
                      <li>Point of Sale (POS)</li>
                      <li>Inventory Management</li>
                      <li>Customer Relationship Management (CRM)</li>
                      <li>Product Catalog</li>
                      <li>Financial Accounting</li>
                      <li>Sales Analytics</li>
                      <li>Raw Materials Management</li>
                    </ul>
                    <p style={{ marginTop: '2rem', color: 'var(--color-gray)' }}>
                      &copy; 2024 PerfumierPro. All rights reserved.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <style>{`
        .settings-container {
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

        .settings-layout {
          display: grid;
          grid-template-columns: 250px 1fr;
          gap: 2rem;
        }

        .settings-sidebar {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .tab-btn {
          padding: 1rem;
          background: transparent;
          border: 2px solid var(--color-border);
          color: var(--color-gray);
          border-radius: 6px;
          cursor: pointer;
          text-align: left;
          transition: all 0.3s ease;
          font-size: 1rem;
        }

        .tab-btn:hover {
          border-color: var(--color-accent);
          color: var(--color-accent);
        }

        .tab-btn.active {
          background: var(--color-accent);
          color: var(--color-primary);
          border-color: var(--color-accent);
          font-weight: 600;
        }

        .settings-content {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--color-border);
          border-radius: 8px;
          padding: 2rem;
        }

        .settings-form h2 {
          margin-top: 0;
          color: var(--color-accent);
          margin-bottom: 1.5rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          color: var(--color-accent);
          font-weight: 600;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--color-border);
          border-radius: 6px;
          color: var(--color-text);
          font-size: 1rem;
        }

        .form-group small {
          display: block;
          margin-top: 0.25rem;
          color: var(--color-gray);
          font-size: 0.85rem;
        }

        .form-group.checkbox {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .form-group.checkbox input {
          width: auto;
          margin: 0;
        }

        .form-group.checkbox label {
          margin: 0;
        }

        .about-content {
          color: #b0b0b0;
          line-height: 1.8;
        }

        .about-content p {
          margin-bottom: 1rem;
        }

        .about-content strong {
          color: var(--color-accent);
        }

        .about-content ul {
          margin: 0.5rem 0 1rem 1.5rem;
        }

        .about-content li {
          margin-bottom: 0.5rem;
        }

        .loading {
          text-align: center;
          padding: 2rem;
          color: var(--color-gray);
        }

        @media (max-width: 768px) {
          .settings-layout {
            grid-template-columns: 1fr;
          }

          .settings-sidebar {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 0.5rem;
          }
        }
      `}</style>
    </div>
  )
}
