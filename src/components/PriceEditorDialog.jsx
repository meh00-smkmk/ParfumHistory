/**
 * Price Editor Dialog Component
 * Allows editing product price during sale
 * Offers choice: temp edit (this sale only) or permanent (update product)
 */

import React, { useState } from 'react';

export const PriceEditorDialog = ({ item, onSave, onCancel }) => {
  const [newPrice, setNewPrice] = useState(item.price);
  const [permanent, setPermanent] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSave = () => {
    const priceNum = parseFloat(newPrice);
    if (!priceNum || priceNum <= 0) {
      alert('Please enter a valid price greater than 0');
      return;
    }

    if (newPrice === item.price) {
      alert('Price is the same as current price');
      return;
    }

    setShowConfirm(true);
  };

  const handleConfirm = () => {
    onSave({
      newPrice: parseFloat(newPrice),
      permanent,
      productId: item.id,
      oldPrice: item.price
    });
  };

  if (showConfirm) {
    return (
      <div style={styles.overlay}>
        <div style={styles.modal}>
          <div style={styles.confirmContent}>
            <h3 style={styles.confirmTitle}>⚠️ Price Change Confirmation</h3>

            <div style={styles.confirmInfo}>
              <p style={styles.infoText}>
                <strong>Product:</strong> {item.name}
              </p>
              <p style={styles.infoText}>
                <strong>Old Price:</strong> {item.price} DZD
              </p>
              <p style={styles.priceChange}>
                <strong>New Price:</strong> {newPrice} DZD
              </p>
              <p style={styles.changePercent}>
                ({((((newPrice - item.price) / item.price) * 100)).toFixed(1)}% change)
              </p>
            </div>

            <div style={styles.choiceSection}>
              <p style={styles.choiceTitle}>Apply this change:</p>

              <label style={styles.radioLabel}>
                <input
                  type="radio"
                  name="scope"
                  checked={!permanent}
                  onChange={() => setPermanent(false)}
                  style={styles.radio}
                />
                <span style={styles.radioText}>
                  📌 <strong>This Sale Only</strong>
                  <br />
                  <small>Change applies only to this transaction</small>
                </span>
              </label>

              <label style={styles.radioLabel}>
                <input
                  type="radio"
                  name="scope"
                  checked={permanent}
                  onChange={() => setPermanent(true)}
                  style={styles.radio}
                />
                <span style={styles.radioText}>
                  🔄 <strong>Update Product Forever</strong>
                  <br />
                  <small>Updates the product price in inventory</small>
                </span>
              </label>
            </div>

            <div style={styles.confirmButtons}>
              <button
                onClick={() => setShowConfirm(false)}
                style={styles.backBtn}
              >
                ← Back to Edit
              </button>
              <button
                onClick={handleConfirm}
                style={styles.confirmBtn}
              >
                ✓ Confirm Change
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={styles.title}>✏️ Edit Product Price</h2>
          <button
            onClick={onCancel}
            style={styles.closeBtn}
          >
            ✕
          </button>
        </div>

        <div style={styles.content}>
          <div style={styles.productInfo}>
            <p style={styles.label}>Product Name</p>
            <p style={styles.value}>{item.name}</p>
          </div>

          <div style={styles.productInfo}>
            <p style={styles.label}>Current Price</p>
            <p style={styles.value}>{item.price} DZD</p>
          </div>

          <div style={styles.inputSection}>
            <label style={styles.label}>New Price (DZD)</label>
            <input
              type="number"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              style={styles.priceInput}
              placeholder="Enter new price"
              min="0"
              step="1"
              autoFocus
            />
            {newPrice !== item.price && (
              <p style={styles.priceInfo}>
                {newPrice > item.price ? '📈 Price increased by' : '📉 Price decreased by'}{' '}
                <strong>{Math.abs(((parseFloat(newPrice) - item.price) / item.price) * 100).toFixed(1)}%</strong>
              </p>
            )}
          </div>

          <div style={styles.footer}>
            <button
              onClick={onCancel}
              style={styles.cancelBtn}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              style={styles.saveBtn}
              disabled={newPrice === item.price || !newPrice || parseFloat(newPrice) <= 0}
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modal: {
    backgroundColor: 'var(--color-background)',
    borderRadius: '12px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
    maxWidth: '500px',
    width: '90%',
    maxHeight: '90vh',
    overflow: 'auto'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    borderBottom: '1px solid var(--color-border)',
  },
  title: {
    color: 'var(--color-text)',
    margin: 0,
    fontSize: '20px',
    fontWeight: '600'
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: 'var(--color-text)',
    padding: 0
  },
  content: {
    padding: '20px'
  },
  productInfo: {
    marginBottom: '15px'
  },
  label: {
    color: 'var(--color-text-secondary)',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: '5px'
  },
  value: {
    color: 'var(--color-text)',
    fontSize: '16px',
    fontWeight: '600',
    margin: 0
  },
  inputSection: {
    marginBottom: '20px',
    padding: '15px',
    backgroundColor: 'var(--color-background-secondary)',
    borderRadius: '8px'
  },
  priceInput: {
    width: '100%',
    padding: '12px',
    fontSize: '18px',
    border: '2px solid var(--color-accent)',
    borderRadius: '6px',
    backgroundColor: 'var(--color-background)',
    color: 'var(--color-text)',
    boxSizing: 'border-box',
    fontWeight: '600',
    outline: 'none'
  },
  priceInfo: {
    marginTop: '10px',
    fontSize: '13px',
    color: 'var(--color-accent)',
    margin: '10px 0 0 0'
  },
  footer: {
    display: 'flex',
    gap: '10px',
    borderTop: '1px solid var(--color-border)',
    paddingTop: '15px'
  },
  cancelBtn: {
    flex: 1,
    padding: '12px',
    backgroundColor: 'var(--color-background-secondary)',
    color: 'var(--color-text)',
    border: '1px solid var(--color-border)',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px'
  },
  saveBtn: {
    flex: 1,
    padding: '12px',
    backgroundColor: 'var(--color-accent)',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    transition: 'opacity 0.2s',
    '&:hover': {
      opacity: 0.9
    },
    '&:disabled': {
      opacity: 0.5,
      cursor: 'not-allowed'
    }
  },

  // Confirmation modal styles
  confirmContent: {
    padding: '30px 20px'
  },
  confirmTitle: {
    color: 'var(--color-text)',
    margin: '0 0 20px 0',
    fontSize: '18px',
    fontWeight: '600'
  },
  confirmInfo: {
    backgroundColor: 'var(--color-background-secondary)',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px'
  },
  infoText: {
    color: 'var(--color-text)',
    margin: '8px 0',
    fontSize: '14px'
  },
  priceChange: {
    color: 'var(--color-accent)',
    margin: '8px 0',
    fontSize: '16px',
    fontWeight: '600'
  },
  changePercent: {
    color: 'var(--color-text-secondary)',
    margin: '5px 0 0 0',
    fontSize: '13px'
  },
  choiceSection: {
    backgroundColor: 'var(--color-background-secondary)',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px'
  },
  choiceTitle: {
    color: 'var(--color-text)',
    margin: '0 0 12px 0',
    fontSize: '14px',
    fontWeight: '600'
  },
  radioLabel: {
    display: 'block',
    padding: '12px',
    marginBottom: '10px',
    backgroundColor: 'var(--color-background)',
    border: '2px solid var(--color-border)',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  radio: {
    marginRight: '10px',
    cursor: 'pointer'
  },
  radioText: {
    color: 'var(--color-text)',
    fontSize: '14px'
  },
  confirmButtons: {
    display: 'flex',
    gap: '10px'
  },
  backBtn: {
    flex: 1,
    padding: '12px',
    backgroundColor: 'var(--color-background-secondary)',
    color: 'var(--color-text)',
    border: '1px solid var(--color-border)',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px'
  },
  confirmBtn: {
    flex: 1,
    padding: '12px',
    backgroundColor: 'var(--color-accent)',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px'
  }
};
