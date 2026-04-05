import { useState, useRef, useEffect } from 'react'
import { printTicket } from '@/services/ticketService'
import { recordPurchase, calculateDiscount, getCustomerSummary } from '@/services/loyaltyService'
import { sendTelegramReceipt, sendTelegramStockAlert } from '@/services/telegramService'
import { saveSale } from '@/services/salesHistoryService'
import { getProducts, updateProduct } from '@/api/products'
import '../styles/theme.css'

export default function POSPage() {
  const [productsDb, setProductsDb] = useState([])
  const [cart, setCart] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showCustomSize, setShowCustomSize] = useState(false)
  const [customSize, setCustomSize] = useState('')
  const [customPrice, setCustomPrice] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [loyaltyInfo, setLoyaltyInfo] = useState(null)
  const [showLoyaltyDiscount, setShowLoyaltyDiscount] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [checkoutSuccess, setCheckoutSuccess] = useState(false)

  const searchRef = useRef(null)

  // Load real products & auto-focus
  useEffect(() => {
    if (searchRef.current) searchRef.current.focus()
    const loadProducts = async () => {
      const res = await getProducts()
      if (res.success) setProductsDb(res.data)
    }
    loadProducts()
  }, [])

  // ── Cart Helpers ─────────────────────────────────
  const addToCartWithSize = (product, size, price) => {
    const cartKey = `${product.id}-${size}-${price}`
    const existing = cart.find(item => item.cartKey === cartKey)
    if (existing) {
      setCart(cart.map(item =>
        item.cartKey === cartKey
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      setCart([...cart, {
        cartKey,
        id: product.id,
        name: product.name,
        size,
        price,
        quantity: 1,
      }])
    }
    // Instantly close size picker after add
    setSelectedProduct(null)
    setShowCustomSize(false)
    setCustomSize('')
    setCustomPrice('')
  }

  const addCustomSizeToCart = (product) => {
    const sizeNum = parseFloat(customSize)
    const priceNum = parseFloat(customPrice)
    if (isNaN(sizeNum) || sizeNum <= 0 || isNaN(priceNum) || priceNum <= 0) return
    addToCartWithSize(product, sizeNum, priceNum)
  }

  const removeFromCart = (cartKey) => {
    setCart(cart.filter(item => item.cartKey !== cartKey))
  }

  const updateQuantity = (cartKey, qty) => {
    if (qty <= 0) { removeFromCart(cartKey); return }
    setCart(cart.map(item =>
      item.cartKey === cartKey ? { ...item, quantity: qty } : item
    ))
  }

  // ── Loyalty ──────────────────────────────────────
  const handleLoyaltyCheck = (phone) => {
    if (!phone || phone.trim() === '') {
      setLoyaltyInfo(null)
      setShowLoyaltyDiscount(false)
      return
    }
    setLoyaltyInfo(getCustomerSummary(phone))
  }

  // ── Totals ───────────────────────────────────────
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  let loyaltyDiscount = 0
  if (customerPhone && showLoyaltyDiscount && loyaltyInfo) {
    loyaltyDiscount = Math.round((subtotal * loyaltyInfo.discount) / 100)
  }
  const total = subtotal - loyaltyDiscount

  // ── Checkout ─────────────────────────────────────
  const handleCheckout = () => {
    if (cart.length === 0) return

    const receipt = {
      receiptId: 'RCP-' + Date.now(),
      timestamp: new Date().toLocaleString('fr-FR'),
      items: cart,
      subtotal,
      loyaltyDiscount,
      total,
      paymentMethod,
      customerPhone: customerPhone || 'N/A',
      shopName: localStorage.getItem('shopName') || 'PerfumierPro',
      shopPhone: localStorage.getItem('shopPhone'),
      shopAddress: localStorage.getItem('shopAddress'),
    }

    // 1. Save to local sales history
    saveSale(receipt)

    // 2. Record loyalty
    if (customerPhone) recordPurchase(customerPhone, total)

    // 3. Deduct Stock & Check Alerts (async)
    cart.forEach(async (item) => {
      const dbProduct = productsDb.find(p => p.id === item.id)
      if (dbProduct) {
        const newStock = Math.max(0, (dbProduct.stock || 0) - item.quantity)
        await updateProduct(dbProduct.id, { stock: newStock })
        
        // Trigger Telegram alert if stock hits a critical threshold (<= 5)
        if (newStock <= 5) {
          sendTelegramStockAlert(dbProduct, newStock)
        }
        
        // Update local state instantly for UI
        setProductsDb(prev => prev.map(p => p.id === dbProduct.id ? { ...p, stock: newStock } : p))
      }
    })

    // 4. Record loyalty

    // 5. Send Telegram notification (async, non-blocking)
    sendTelegramReceipt(receipt)

    // 6. Print receipt
    setTimeout(() => printTicket('receipt', receipt), 300)

    // 7. Visual feedback
    setCheckoutSuccess(true)
    setTimeout(() => {
      setCheckoutSuccess(false)
      setCart([])
      setPaymentMethod('cash')
      setCustomerPhone('')
      setLoyaltyInfo(null)
      setShowLoyaltyDiscount(false)
      // Re-focus search
      if (searchRef.current) searchRef.current.focus()
    }, 1800)
  }

  // ── Search ───────────────────────────────────────
  const filteredProducts = productsDb.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // ── Render ───────────────────────────────────────
  return (
    <div className="pos-page">
      {/* Success Overlay */}
      {checkoutSuccess && (
        <div className="checkout-overlay">
          <div className="checkout-success-card">
            <span className="success-icon">✅</span>
            <h2>Vente Complétée!</h2>
            <p>{total} DA</p>
          </div>
        </div>
      )}

      <div className="pos-grid">
        {/* ═══ LEFT PANEL: Products ═══ */}
        <div className="pos-left">
          <div className="pos-search-bar">
            <span className="search-icon">🔍</span>
            <input
              ref={searchRef}
              type="text"
              placeholder="Rechercher un parfum..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setSelectedProduct(null) }}
              className="pos-search"
              autoComplete="off"
            />
            {searchQuery && (
              <button className="search-clear" onClick={() => { setSearchQuery(''); setSelectedProduct(null) }}>✕</button>
            )}
          </div>

          {/* Size Picker Panel (when a product is selected) */}
          {selectedProduct && (
            <div className="size-picker-panel">
              <div className="size-picker-header">
                <h3>{selectedProduct.name}</h3>
                <button className="size-close-btn" onClick={() => { setSelectedProduct(null); setShowCustomSize(false) }}>✕</button>
              </div>
              <p className="size-picker-hint">Choisir la taille →</p>
              <div className="size-grid">
                {selectedProduct.sizes.map((s, idx) => (
                  <button
                    key={idx}
                    className="size-tile"
                    onClick={() => addToCartWithSize(selectedProduct, s.size, s.price)}
                  >
                    <span className="size-ml">{s.size}ml</span>
                    <span className="size-price">{s.price} DA</span>
                  </button>
                ))}
                {/* Custom Size Button */}
                <button
                  className={`size-tile size-custom-trigger ${showCustomSize ? 'active' : ''}`}
                  onClick={() => setShowCustomSize(!showCustomSize)}
                >
                  <span className="size-ml">✏️</span>
                  <span className="size-price">Custom</span>
                </button>
              </div>

              {/* Custom Size Input */}
              {showCustomSize && (
                <div className="custom-size-form">
                  <input
                    type="number"
                    placeholder="Taille (ml)"
                    value={customSize}
                    onChange={(e) => setCustomSize(e.target.value)}
                    className="custom-input"
                    min="1"
                  />
                  <input
                    type="number"
                    placeholder="Prix (DA)"
                    value={customPrice}
                    onChange={(e) => setCustomPrice(e.target.value)}
                    className="custom-input"
                    min="1"
                  />
                  <button
                    className="custom-add-btn"
                    onClick={() => addCustomSizeToCart(selectedProduct)}
                    disabled={!customSize || !customPrice || parseFloat(customSize) <= 0 || parseFloat(customPrice) <= 0}
                  >
                    ✓ Ajouter
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Product List */}
          <div className="product-tiles">
            {filteredProducts.map((product) => (
              <button
                key={product.id}
                className={`product-tile ${selectedProduct?.id === product.id ? 'selected' : ''}`}
                onClick={() => setSelectedProduct(selectedProduct?.id === product.id ? null : product)}
              >
                <div className="pt-name">{product.name}</div>
                <div className="pt-category">{product.category}</div>
                <div className="pt-stock">Stock: {product.stock}</div>
              </button>
            ))}
            {filteredProducts.length === 0 && (
              <div className="no-results">Aucun parfum trouvé</div>
            )}
          </div>
        </div>

        {/* ═══ RIGHT PANEL: Cart & Checkout ═══ */}
        <div className="pos-right">
          <h2 className="cart-title">🛒 Panier</h2>

          {/* Customer Loyalty */}
          <div className="loyalty-box">
            <div className="loyalty-row">
              <input
                type="tel"
                placeholder="Téléphone client"
                value={customerPhone}
                onChange={(e) => { setCustomerPhone(e.target.value); handleLoyaltyCheck(e.target.value) }}
                className="loyalty-phone"
              />
              {loyaltyInfo && (
                <span className={`tier-badge tier-${loyaltyInfo.tier.toLowerCase().replace(/\s+/g, '-')}`}>
                  {loyaltyInfo.tier}
                  {loyaltyInfo.discount > 0 && <span className="tier-pct">{loyaltyInfo.discount}%</span>}
                </span>
              )}
            </div>
            {loyaltyInfo && loyaltyInfo.discount > 0 && (
              <label className="loyalty-apply">
                <input type="checkbox" checked={showLoyaltyDiscount} onChange={(e) => setShowLoyaltyDiscount(e.target.checked)} />
                <span>Appliquer remise fidélité</span>
              </label>
            )}
          </div>

          {/* Cart Items */}
          <div className="cart-items-list">
            {cart.length === 0 ? (
              <div className="cart-empty">
                <span>🛒</span>
                <p>Panier vide</p>
                <small>Sélectionnez un parfum → Cliquez une taille</small>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.cartKey} className="cart-row">
                  <div className="cr-info">
                    <span className="cr-name">{item.name}</span>
                    <span className="cr-size">{item.size}ml — {item.price} DA</span>
                  </div>
                  <div className="cr-controls">
                    <button onClick={() => updateQuantity(item.cartKey, item.quantity - 1)} className="cr-btn">−</button>
                    <span className="cr-qty">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.cartKey, item.quantity + 1)} className="cr-btn">+</button>
                  </div>
                  <span className="cr-total">{item.price * item.quantity} DA</span>
                  <button className="cr-remove" onClick={() => removeFromCart(item.cartKey)}>✕</button>
                </div>
              ))
            )}
          </div>

          {/* Totals */}
          {cart.length > 0 && (
            <>
              <div className="cart-totals">
                <div className="ct-row">
                  <span>Sous-total:</span>
                  <span>{subtotal} DA</span>
                </div>
                {loyaltyDiscount > 0 && (
                  <div className="ct-row ct-discount">
                    <span>Remise fidélité ({loyaltyInfo?.discount}%):</span>
                    <span>-{loyaltyDiscount} DA</span>
                  </div>
                )}
                <div className="ct-row ct-total">
                  <span>TOTAL:</span>
                  <span>{total} DA</span>
                </div>
              </div>

              {/* Payment Method */}
              <div className="payment-methods">
                {['cash', 'card', 'ccp', 'baridi'].map((m) => (
                  <button
                    key={m}
                    className={`pm-btn ${paymentMethod === m ? 'active' : ''}`}
                    onClick={() => setPaymentMethod(m)}
                  >
                    {m === 'cash' && '💵 Cash'}
                    {m === 'card' && '💳 Carte'}
                    {m === 'ccp' && '📮 CCP'}
                    {m === 'baridi' && '📱 BaridiMob'}
                  </button>
                ))}
              </div>

              <button className="checkout-btn" onClick={handleCheckout}>
                ✓ Valider la vente — {total} DA
              </button>
            </>
          )}
        </div>
      </div>

      <style>{`
        .pos-page {
          height: 100vh;
          background: var(--color-background, #1a1a2e);
          color: var(--color-text, #e0e0e0);
          overflow: hidden;
          position: relative;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        /* ── Checkout Overlay ── */
        .checkout-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.7);
          display: flex; align-items: center; justify-content: center;
          z-index: 9999;
          animation: fadeIn 0.2s ease;
        }
        .checkout-success-card {
          background: var(--color-dark, linear-gradient(135deg, #0f3460, #16213e));
          border: 3px solid var(--color-accent, #d4af37);
          border-radius: 16px;
          padding: 3rem 4rem;
          text-align: center;
          animation: scaleIn 0.3s ease;
        }
        .success-icon { font-size: 3rem; display: block; margin-bottom: 1rem; }
        .checkout-success-card h2 { color: var(--color-accent, #d4af37); margin: 0 0 0.5rem; font-size: 1.5rem; }
        .checkout-success-card p { color: #fff; font-size: 1.8rem; font-weight: 700; margin: 0; }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }

        /* ── Grid Layout ── */
        .pos-grid {
          display: grid;
          grid-template-columns: 1fr 380px;
          height: 100%;
          gap: 0;
        }

        /* ── LEFT: Products ── */
        .pos-left {
          padding: 1rem 1.5rem;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .pos-search-bar {
          display: flex;
          align-items: center;
          background: rgba(255,255,255,0.08);
          border: 2px solid rgba(212,175,55,0.4);
          border-radius: 10px;
          padding: 0 1rem;
          margin-bottom: 1rem;
          transition: border-color 0.2s;
        }
        .pos-search-bar:focus-within { border-color: var(--color-accent, #d4af37); }
        .search-icon { font-size: 1.1rem; margin-right: 0.5rem; }
        .pos-search {
          flex: 1;
          background: transparent;
          border: none;
          color: var(--color-text, #e0e0e0);
          padding: 0.8rem 0;
          font-size: 1rem;
          outline: none;
        }
        .pos-search::placeholder { color: #888; }
        .search-clear {
          background: none; border: none; color: #888; cursor: pointer;
          font-size: 1.1rem; padding: 0.3rem;
        }
        .search-clear:hover { color: #e74c3c; }

        /* ── Size Picker ── */
        .size-picker-panel {
          background: linear-gradient(135deg, rgba(212,175,55,0.08), rgba(15,52,96,0.3));
          border: 2px solid rgba(212,175,55,0.5);
          border-radius: 10px;
          padding: 1rem 1.2rem;
          margin-bottom: 1rem;
          animation: slideDown 0.15s ease;
        }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }

        .size-picker-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.3rem;
        }
        .size-picker-header h3 { color: var(--color-accent, #d4af37); margin: 0; font-size: 1.1rem; }
        .size-close-btn {
          background: none; border: none; color: #888; cursor: pointer;
          font-size: 1.2rem; padding: 0.2rem 0.5rem;
        }
        .size-close-btn:hover { color: #e74c3c; }
        .size-picker-hint { color: #888; font-size: 0.8rem; margin: 0 0 0.5rem; }

        .size-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
          gap: 0.5rem;
        }

        .size-tile {
          background: rgba(212,175,55,0.1);
          border: 1.5px solid rgba(212,175,55,0.3);
          border-radius: 8px;
          padding: 0.6rem 0.4rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          transition: all 0.15s ease;
          gap: 0.2rem;
        }
        .size-tile:hover {
          background: rgba(212,175,55,0.25);
          border-color: var(--color-accent, #d4af37);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(212,175,55,0.2);
        }
        .size-tile:active {
          transform: translateY(0);
        }
        .size-ml { color: var(--color-accent, #d4af37); font-weight: 700; font-size: 0.95rem; }
        .size-price { color: #aaa; font-size: 0.8rem; }

        .size-custom-trigger { border-style: dashed; }
        .size-custom-trigger.active { background: rgba(212,175,55,0.2); border-color: var(--color-accent, #d4af37); }

        .custom-size-form {
          display: flex;
          gap: 0.5rem;
          margin-top: 0.7rem;
          animation: slideDown 0.15s ease;
        }
        .custom-input {
          flex: 1;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(212,175,55,0.3);
          border-radius: 6px;
          padding: 0.5rem 0.6rem;
          color: #e0e0e0;
          font-size: 0.85rem;
          outline: none;
        }
        .custom-input:focus { border-color: var(--color-accent, #d4af37); }
        .custom-add-btn {
          background: var(--color-accent, #d4af37);
          border: none;
          color: var(--color-primary, #1a1a2e);
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s;
          white-space: nowrap;
        }
        .custom-add-btn:hover { background: #e8c547; }
        .custom-add-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        /* ── Product Tiles ── */
        .product-tiles {
          flex: 1;
          overflow-y: auto;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 0.7rem;
          align-content: start;
          padding-bottom: 1rem;
        }
        .product-tiles::-webkit-scrollbar { width: 4px; }
        .product-tiles::-webkit-scrollbar-thumb { background: var(--color-accent, #d4af37); border-radius: 4px; }

        .product-tile {
          background: rgba(255,255,255,0.04);
          border: 1.5px solid rgba(212,175,55,0.2);
          border-radius: 10px;
          padding: 1rem;
          cursor: pointer;
          transition: all 0.15s ease;
          text-align: left;
        }
        .product-tile:hover {
          border-color: rgba(212,175,55,0.6);
          background: rgba(212,175,55,0.08);
        }
        .product-tile.selected {
          border-color: var(--color-accent, #d4af37);
          background: rgba(212,175,55,0.15);
          box-shadow: 0 0 0 1px var(--color-accent, #d4af37);
        }
        .pt-name { color: var(--color-accent, #d4af37); font-weight: 700; font-size: 0.95rem; margin-bottom: 0.3rem; }
        .pt-category { color: #888; font-size: 0.8rem; margin-bottom: 0.2rem; }
        .pt-stock { color: #4caf50; font-size: 0.75rem; }
        .no-results { color: #888; text-align: center; padding: 2rem; grid-column: 1/-1; }

        .pos-right {
          background: var(--color-dark, linear-gradient(180deg, #0f3460 0%, #16213e 100%));
          border-left: 3px solid var(--color-accent, #d4af37);
          padding: 1rem 1.2rem;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .cart-title {
          color: var(--color-accent, #d4af37);
          margin: 0 0 0.8rem;
          font-size: 1.2rem;
        }

        /* ── Loyalty Box ── */
        .loyalty-box {
          background: rgba(76,175,80,0.08);
          border: 1px solid rgba(76,175,80,0.3);
          border-radius: 8px;
          padding: 0.7rem;
          margin-bottom: 0.8rem;
        }
        .loyalty-row {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }
        .loyalty-phone {
          flex: 1;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(76,175,80,0.3);
          border-radius: 6px;
          padding: 0.45rem 0.6rem;
          color: #e0e0e0;
          font-size: 0.85rem;
          outline: none;
        }
        .loyalty-phone:focus { border-color: #4caf50; }
        .tier-badge {
          padding: 0.3rem 0.6rem;
          border-radius: 20px;
          font-size: 0.7rem;
          font-weight: 600;
          white-space: nowrap;
          display: flex;
          gap: 0.3rem;
          align-items: center;
        }
        .tier-new-customer { background: rgba(150,150,150,0.2); color: #888; }
        .tier-silver { background: rgba(192,192,192,0.2); color: #c0c0c0; }
        .tier-gold { background: rgba(212,175,55,0.2); color: var(--color-accent, #d4af37); }
        .tier-platinum { background: rgba(229,228,226,0.2); color: #e5e4e2; }
        .tier-pct {
          background: rgba(76,175,80,0.4);
          padding: 0.1rem 0.35rem;
          border-radius: 3px;
          color: #4caf50;
          font-size: 0.65rem;
        }
        .loyalty-apply {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          margin-top: 0.5rem;
          cursor: pointer;
          font-size: 0.8rem;
          color: #aaa;
        }
        .loyalty-apply input { cursor: pointer; }

        /* ── Cart Items ── */
        .cart-items-list {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .cart-items-list::-webkit-scrollbar { width: 3px; }
        .cart-items-list::-webkit-scrollbar-thumb { background: var(--color-accent, #d4af37); border-radius: 3px; }

        .cart-empty {
          text-align: center;
          padding: 2rem 1rem;
          color: #666;
        }
        .cart-empty span { font-size: 2rem; display: block; margin-bottom: 0.5rem; }
        .cart-empty p { margin: 0; font-size: 0.95rem; }
        .cart-empty small { color: #555; }

        .cart-row {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(255,255,255,0.04);
          border-radius: 6px;
          padding: 0.5rem 0.6rem;
        }
        .cr-info { flex: 1; min-width: 0; }
        .cr-name { display: block; color: var(--color-accent, #d4af37); font-size: 0.85rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .cr-size { display: block; color: #888; font-size: 0.72rem; }
        .cr-controls { display: flex; align-items: center; gap: 0.2rem; }
        .cr-btn {
          width: 22px; height: 22px; padding: 0;
          background: var(--color-accent, #d4af37); border: none; color: var(--color-primary, #1a1a2e);
          border-radius: 3px; cursor: pointer; font-weight: bold; font-size: 0.85rem;
          display: flex; align-items: center; justify-content: center;
        }
        .cr-btn:hover { opacity: 0.9; }
        .cr-qty { color: var(--color-text, #e0e0e0); font-size: 0.85rem; min-width: 18px; text-align: center; font-weight: 600; }
        .cr-total { color: var(--color-accent, #d4af37); font-weight: 700; font-size: 0.85rem; min-width: 55px; text-align: right; }
        .cr-remove { background: none; border: none; color: #e74c3c; cursor: pointer; font-size: 0.85rem; padding: 0.2rem; }
        .cr-remove:hover { color: #ff6b6b; }

        /* ── Totals ── */
        .cart-totals {
          border-top: 1px solid rgba(212,175,55,0.2);
          padding: 0.7rem 0;
          margin-top: 0.5rem;
        }
        .ct-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          color: #aaa;
          margin-bottom: 0.3rem;
        }
        .ct-row span:last-child { color: var(--color-text, #e0e0e0); }
        .ct-discount { color: #4caf50 !important; }
        .ct-discount span { color: #4caf50 !important; }
        .ct-total { font-size: 1.1rem; font-weight: 700; color: var(--color-accent, #d4af37) !important; margin: 0; }
        .ct-total span { color: var(--color-accent, #d4af37) !important; }

        /* ── Payment ── */
        .payment-methods {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.4rem;
          margin: 0.6rem 0;
        }
        .pm-btn {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(212,175,55,0.2);
          color: #aaa;
          padding: 0.45rem;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.8rem;
          transition: all 0.15s;
        }
        .pm-btn:hover { border-color: var(--color-accent, #d4af37); color: var(--color-accent, #d4af37); }
        .pm-btn.active {
          background: rgba(212,175,55,0.15);
          border-color: var(--color-accent, #d4af37);
          color: var(--color-accent, #d4af37);
          font-weight: 600;
        }

        /* ── Checkout Button ── */
        .checkout-btn {
          width: 100%;
          padding: 0.9rem;
          background: var(--color-accent, linear-gradient(135deg, #d4af37, #b8960c));
          color: var(--color-primary, #1a1a2e);
          border: none;
          border-radius: 8px;
          font-weight: 800;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s;
          letter-spacing: 0.3px;
        }
        .checkout-btn:hover {
          background: linear-gradient(135deg, #e8c547, #d4af37);
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(212,175,55,0.3);
        }
        .checkout-btn:active { transform: translateY(0); }

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .pos-grid { grid-template-columns: 1fr; grid-template-rows: 1fr 1fr; }
          .pos-right { border-left: none; border-top: 3px solid #d4af37; }
        }
      `}</style>
    </div>
  )
}
