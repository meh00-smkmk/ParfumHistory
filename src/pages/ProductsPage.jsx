import { useState, useEffect } from 'react'
import { getProducts, createProduct, updateProduct, deleteProduct, getCategories, addCategory, deleteCategory, renameCategory } from '@/api/products'
import '../styles/theme.css'

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showCatManager, setShowCatManager] = useState(false)
  const [newCategory, setNewCategory] = useState('')
  const [renamingCat, setRenamingCat] = useState(null)
  const [renameCatValue, setRenameCatValue] = useState('')
  const [formData, setFormData] = useState({ name: '', category: '', price: '', description: '', sku: '', stock: '' })

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    setLoading(true)
    const [pRes, cRes] = await Promise.all([getProducts(), getCategories()])
    if (pRes.success) setProducts(pRes.data)
    if (cRes.success) setCategories(cRes.data)
    setLoading(false)
  }

  // ── Product CRUD ─────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.category) return
    setLoading(true)
    if (selectedProduct) {
      await updateProduct(selectedProduct.id, { ...formData, price: parseFloat(formData.price), stock: parseInt(formData.stock) || 0 })
    } else {
      await createProduct({ ...formData, price: parseFloat(formData.price), stock: parseInt(formData.stock) || 0 })
    }
    setShowForm(false)
    setSelectedProduct(null)
    setFormData({ name: '', category: '', price: '', description: '', sku: '', stock: '' })
    await loadData()
    setLoading(false)
  }

  const handleEdit = (product) => {
    setSelectedProduct(product)
    setFormData({ name: product.name, category: product.category, price: product.price || '', description: product.description || '', sku: product.sku || '', stock: product.stock || '' })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce produit?')) return
    await deleteProduct(id)
    await loadData()
  }

  // ── Category CRUD ────────────────────────────────
  const handleAddCategory = () => {
    if (!newCategory.trim()) return
    const updated = addCategory(newCategory.trim())
    setCategories(updated)
    setNewCategory('')
  }

  const handleDeleteCategory = (cat) => {
    if (!confirm(`Supprimer la catégorie "${cat}"?`)) return
    const updated = deleteCategory(cat)
    setCategories(updated)
  }

  const handleRenameCategory = (oldName) => {
    if (!renameCatValue.trim()) return
    const updated = renameCategory(oldName, renameCatValue.trim())
    setCategories(updated)
    setRenamingCat(null)
    setRenameCatValue('')
    loadData() // refresh products too
  }

  // ── Filter ───────────────────────────────────────
  let filtered = products
  if (filterCategory !== 'all') filtered = filtered.filter(p => p.category === filterCategory)
  if (searchQuery) {
    const q = searchQuery.toLowerCase()
    filtered = filtered.filter(p => p.name?.toLowerCase().includes(q) || p.sku?.toLowerCase().includes(q))
  }

  return (
    <div className="prod-page">
      <header className="prod-header">
        <div>
          <h1>Gestion des Produits</h1>
          <p>{products.length} produits • {categories.length} catégories</p>
        </div>
        <div className="prod-header-actions">
          <button className="prod-cat-btn" onClick={() => setShowCatManager(!showCatManager)}>
            Catégories
          </button>
          <button className="prod-add-btn" onClick={() => { setShowForm(true); setSelectedProduct(null); setFormData({ name: '', category: categories[0] || '', price: '', description: '', sku: '', stock: '' }) }}>
            + Nouveau Produit
          </button>
        </div>
      </header>

      {/* Category Manager */}
      {showCatManager && (
        <div className="cat-manager">
          <h3>Gestion des Catégories</h3>
          <div className="cat-add-row">
            <input type="text" value={newCategory} onChange={e => setNewCategory(e.target.value)} placeholder="Nouvelle catégorie..." className="cat-input" onKeyDown={e => e.key === 'Enter' && handleAddCategory()} />
            <button className="cat-add-btn" onClick={handleAddCategory}>+ Ajouter</button>
          </div>
          <div className="cat-list">
            {categories.map(cat => (
              <div key={cat} className="cat-item">
                {renamingCat === cat ? (
                  <div className="cat-rename-row">
                    <input type="text" value={renameCatValue} onChange={e => setRenameCatValue(e.target.value)} className="cat-input-sm" autoFocus onKeyDown={e => e.key === 'Enter' && handleRenameCategory(cat)} />
                    <button className="cat-act-btn save" onClick={() => handleRenameCategory(cat)}>✓</button>
                    <button className="cat-act-btn" onClick={() => setRenamingCat(null)}>✕</button>
                  </div>
                ) : (
                  <>
                    <span className="cat-name">{cat}</span>
                    <span className="cat-count">{products.filter(p => p.category === cat).length}</span>
                    <button className="cat-act-btn" onClick={() => { setRenamingCat(cat); setRenameCatValue(cat) }}>✏️</button>
                    <button className="cat-act-btn del" onClick={() => handleDeleteCategory(cat)}>🗑️</button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="prod-filters">
        <div className="prod-search-wrap">
          <span>🔍</span>
          <input type="text" placeholder="Rechercher un produit..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="prod-search" />
        </div>
        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="prod-cat-filter">
          <option value="all">Toutes les catégories</option>
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>

      {/* Product Grid */}
      <div className="prod-grid">
        {loading ? (
          <div className="prod-empty">Chargement...</div>
        ) : filtered.length === 0 ? (
          <div className="prod-empty">Aucun produit trouvé</div>
        ) : (
          filtered.map(product => (
            <div key={product.id} className="prod-card">
              <div className="pc-header">
                <h3>{product.name}</h3>
                <span className="pc-cat">{product.category}</span>
              </div>
              <div className="pc-details">
                {product.sku && <div className="pc-row"><span>SKU:</span><span>{product.sku}</span></div>}
                <div className="pc-row"><span>Stock:</span><span className={`pc-stock ${(product.stock || 0) <= 5 ? 'low' : ''}`}>{product.stock || 0}</span></div>
                {product.sizes && product.sizes.length > 0 && (
                  <div className="pc-sizes">
                    <span className="pc-sizes-label">{product.sizes.length} tailles:</span>
                    <span className="pc-sizes-range">{product.sizes[0].size}ml — {product.sizes[product.sizes.length - 1].size}ml</span>
                  </div>
                )}
                {product.price > 0 && <div className="pc-row"><span>Prix:</span><span className="pc-price">{product.price} DA</span></div>}
                {product.description && <p className="pc-desc">{product.description}</p>}
              </div>
              <div className="pc-actions">
                <button className="pc-btn edit" onClick={() => handleEdit(product)}>✏️ Modifier</button>
                <button className="pc-btn del" onClick={() => handleDelete(product.id)}>🗑️</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="prod-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="prod-modal" onClick={e => e.stopPropagation()}>
            <div className="pm-header">
              <h3>{selectedProduct ? '✏️ Modifier Produit' : '➕ Nouveau Produit'}</h3>
              <button className="pm-close" onClick={() => setShowForm(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className="pm-form">
              <div className="pm-row"><label>Nom *</label><input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required /></div>
              <div className="pm-row">
                <label>Catégorie *</label>
                <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} required>
                  <option value="">Choisir...</option>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div className="pm-row"><label>Prix (DA)</label><input type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} min="0" /></div>
              <div className="pm-row"><label>Stock</label><input type="number" value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} min="0" /></div>
              <div className="pm-row"><label>SKU</label><input type="text" value={formData.sku} onChange={e => setFormData({ ...formData, sku: e.target.value })} /></div>
              <div className="pm-row"><label>Description</label><textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows="3" /></div>
              <div className="pm-actions">
                <button type="button" className="pm-cancel" onClick={() => setShowForm(false)}>Annuler</button>
                <button type="submit" className="pm-save">{selectedProduct ? 'Mettre à jour' : 'Ajouter'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .prod-page { background: var(--color-background, #1a1a2e); min-height: 100vh; padding: 1.5rem 2rem; color: var(--color-text, #e0e0e0); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        .prod-header { display: flex; justify-content: space-between; align-items: center; background: var(--color-dark, #0f3460); padding: 1.2rem 1.5rem; border-radius: 10px; border-bottom: 3px solid var(--color-accent, #d4af37); margin-bottom: 1.5rem; }
        .prod-header h1 { color: var(--color-accent, #d4af37); margin: 0; font-size: 1.5rem; }
        .prod-header p { color: var(--color-gray, #888); margin: 0.3rem 0 0; font-size: 0.85rem; }
        .prod-header-actions { display: flex; gap: 0.5rem; }
        .prod-cat-btn { background: var(--color-surface); border: 1px solid var(--color-border); color: var(--color-accent, #d4af37); padding: 0.6rem 1rem; border-radius: 8px; cursor: pointer; font-size: 0.85rem; font-weight: 600; transition: all 0.15s; }
        .prod-cat-btn:hover { background: rgba(212,175,55,0.25); }
        .prod-add-btn { background: var(--color-accent, #d4af37); color: var(--color-primary, #1a1a2e); border: none; padding: 0.6rem 1.2rem; border-radius: 8px; font-weight: 700; cursor: pointer; font-size: 0.85rem; }
        .prod-add-btn:hover { transform: translateY(-1px); }

        /* Category Manager */
        .cat-manager { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 10px; padding: 1.2rem; margin-bottom: 1.5rem; animation: slideDown 0.15s ease; }
        @keyframes slideDown { from { opacity:0; transform: translateY(-8px); } to { opacity:1; transform: translateY(0); } }
        .cat-manager h3 { color: var(--color-accent, #d4af37); margin: 0 0 1rem; font-size: 1rem; }
        .cat-add-row { display: flex; gap: 0.5rem; margin-bottom: 0.8rem; }
        .cat-input { flex: 1; background: rgba(255,255,255,0.06); border: 1px solid var(--color-border); border-radius: 6px; padding: 0.5rem 0.7rem; color: var(--color-text, #e0e0e0); outline: none; font-size: 0.85rem; }
        .cat-input:focus { border-color: var(--color-accent, #d4af37); }
        .cat-add-btn { background: var(--color-accent, #d4af37); color: var(--color-primary, #1a1a2e); border: none; padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer; font-weight: 700; font-size: 0.85rem; min-width: 80px; }
        .cat-add-btn:hover { opacity: 0.9; }
        .cat-list { display: flex; flex-direction: column; gap: 0.3rem; }
        .cat-item { display: flex; align-items: center; gap: 0.5rem; background: rgba(255,255,255,0.03); padding: 0.5rem 0.7rem; border-radius: 6px; }
        .cat-name { flex: 1; color: var(--color-text, #ccc); font-size: 0.85rem; }
        .cat-count { color: var(--color-gray, #888); font-size: 0.75rem; background: rgba(255,255,255,0.06); padding: 0.15rem 0.4rem; border-radius: 3px; }
        .cat-act-btn { background: none; border: 1px solid rgba(255,255,255,0.08); border-radius: 4px; cursor: pointer; padding: 0.2rem 0.4rem; font-size: 0.75rem; transition: all 0.15s; color: var(--color-gray); }
        .cat-act-btn:hover { background: rgba(212,175,55,0.15); border-color: var(--color-accent, #d4af37); }
        .cat-act-btn.del:hover { background: rgba(231,76,60,0.15); border-color: var(--color-danger, #e74c3c); }
        .cat-act-btn.save { background: rgba(76,175,80,0.15); border-color: var(--color-success, #4caf50); }
        .cat-rename-row { display: flex; gap: 0.3rem; flex: 1; }
        .cat-input-sm { flex: 1; background: rgba(255,255,255,0.06); border: 1px solid var(--color-accent, #d4af37); border-radius: 4px; padding: 0.3rem 0.5rem; color: var(--color-text, #e0e0e0); outline: none; font-size: 0.8rem; }

        /* Filters */
        .prod-filters { display: flex; gap: 0.8rem; margin-bottom: 1.2rem; }
        .prod-search-wrap { flex: 1; display: flex; align-items: center; background: rgba(255,255,255,0.06); border: 1px solid var(--color-border); border-radius: 8px; padding: 0 0.8rem; }
        .prod-search-wrap:focus-within { border-color: var(--color-accent, #d4af37); }
        .prod-search { flex: 1; background: transparent; border: none; color: var(--color-text, #e0e0e0); padding: 0.6rem 0.5rem; outline: none; font-size: 0.9rem; }
        .prod-search::placeholder { color: #666; }
        .prod-cat-filter { background: rgba(255,255,255,0.06); border: 1px solid var(--color-border); border-radius: 8px; color: var(--color-text, #e0e0e0); padding: 0.6rem 0.8rem; font-size: 0.85rem; outline: none; cursor: pointer; }

        /* Grid */
        .prod-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; }
        .prod-empty { grid-column: 1/-1; text-align: center; padding: 2rem; color: #666; }
        .prod-card { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 10px; padding: 1.2rem; transition: all 0.15s; }
        .prod-card:hover { border-color: var(--color-accent, #d4af37); background: rgba(212,175,55,0.05); }
        .pc-header { display: flex; justify-content: space-between; align-items: start; gap: 0.5rem; margin-bottom: 0.8rem; }
        .pc-header h3 { color: var(--color-accent, #d4af37); margin: 0; font-size: 1rem; }
        .pc-cat { background: rgba(52,152,219,0.15); color: #3498db; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.7rem; font-weight: 600; white-space: nowrap; }
        .pc-details { display: flex; flex-direction: column; gap: 0.3rem; }
        .pc-row { display: flex; justify-content: space-between; font-size: 0.85rem; color: var(--color-gray, #aaa); }
        .pc-stock { font-weight: 600; }
        .pc-stock.low { color: var(--color-danger, #e74c3c); }
        .pc-price { color: var(--color-accent, #d4af37); font-weight: 700; }
        .pc-desc { color: #777; font-size: 0.8rem; margin: 0.3rem 0 0; line-height: 1.3; }
        .pc-sizes { display: flex; justify-content: space-between; font-size: 0.8rem; color: #888; }
        .pc-sizes-label { color: var(--color-gray, #aaa); }
        .pc-sizes-range { color: var(--color-accent, #d4af37); }
        .pc-actions { display: flex; gap: 0.4rem; margin-top: 0.8rem; }
        .pc-btn { flex: 1; padding: 0.45rem; border-radius: 6px; cursor: pointer; font-size: 0.8rem; transition: all 0.15s; border: 1px solid rgba(255,255,255,0.1); background: none; color: var(--color-gray, #aaa); }
        .pc-btn.edit:hover { background: rgba(212,175,55,0.15); border-color: var(--color-accent); color: var(--color-accent); }
        .pc-btn.del:hover { background: rgba(231,76,60,0.15); border-color: var(--color-danger); color: var(--color-danger); }

        /* Modal */
        .prod-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 9999; }
        .prod-modal { background: var(--color-dark, #0f3460); border: 2px solid var(--color-accent, #d4af37); border-radius: 12px; width: 90%; max-width: 480px; max-height: 90vh; overflow-y: auto; animation: scaleIn 0.15s ease; }
        @keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .pm-header { display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.3rem; border-bottom: 1px solid var(--color-border); }
        .pm-header h3 { color: var(--color-accent, #d4af37); margin: 0; font-size: 1.1rem; }
        .pm-close { background: none; border: none; color: #888; font-size: 1.2rem; cursor: pointer; }
        .pm-close:hover { color: var(--color-danger, #e74c3c); }
        .pm-form { padding: 1.3rem; }
        .pm-row { margin-bottom: 0.8rem; }
        .pm-row label { display: block; color: var(--color-accent, #d4af37); font-size: 0.85rem; font-weight: 600; margin-bottom: 0.25rem; }
        .pm-row input, .pm-row select, .pm-row textarea { width: 100%; padding: 0.55rem 0.7rem; background: rgba(255,255,255,0.06); border: 1px solid var(--color-border); border-radius: 6px; color: var(--color-text, #e0e0e0); font-size: 0.85rem; outline: none; }
        .pm-row input:focus, .pm-row select:focus, .pm-row textarea:focus { border-color: var(--color-accent, #d4af37); }
        .pm-actions { display: flex; gap: 0.6rem; justify-content: flex-end; margin-top: 1rem; }
        .pm-cancel { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.15); color: var(--color-gray, #aaa); padding: 0.55rem 1rem; border-radius: 6px; cursor: pointer; font-size: 0.85rem; }
        .pm-save { background: var(--color-accent, #d4af37); color: var(--color-primary, #1a1a2e); border: none; padding: 0.55rem 1.3rem; border-radius: 6px; font-weight: 700; cursor: pointer; font-size: 0.85rem; }
        .pm-save:hover { transform: translateY(-1px); }

        @media (max-width: 768px) { .prod-header { flex-direction: column; gap: 0.8rem; } .prod-filters { flex-direction: column; } }
      `}</style>
    </div>
  )
}
