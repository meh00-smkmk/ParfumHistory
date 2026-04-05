/**
 * Category Manager Component
 * CRUD interface for managing product categories
 */

import React, { useState, useEffect } from 'react';
import {
  getAllCategories,
  addCategory,
  editCategory,
  deleteCategory,
  getCategoryOptions
} from '../services/categoryService';

export const CategoryManager = ({ onCategoryChange }) => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () => {
    try {
      const cats = getAllCategories();
      setCategories(cats);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      setError('Category name cannot be empty');
      return;
    }

    try {
      addCategory(newCategory);
      setSuccess('Category added successfully');
      setNewCategory('');
      loadCategories();
      if (onCategoryChange) onCategoryChange();
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditCategory = (oldName) => {
    if (!editingName.trim()) {
      setError('Category name cannot be empty');
      return;
    }

    try {
      editCategory(oldName, editingName);
      setSuccess('Category updated successfully');
      setEditingId(null);
      setEditingName('');
      loadCategories();
      if (onCategoryChange) onCategoryChange();
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteCategory = (name) => {
    if (!window.confirm(`Delete category "${name}"? This will not affect existing products.`)) {
      return;
    }

    try {
      deleteCategory(name);
      setSuccess('Category deleted successfully');
      loadCategories();
      if (onCategoryChange) onCategoryChange();
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>📂 Manage Categories</h3>

      {/* Add New Category */}
      <div style={styles.section}>
        <label style={styles.label}>Add New Category</label>
        <div style={styles.inputGroup}>
          <input
            type="text"
            placeholder="Enter category name (e.g., Eau de Parfum)"
            value={newCategory}
            onChange={(e) => {
              setNewCategory(e.target.value);
              setError('');
            }}
            onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
            style={styles.input}
          />
          <button
            onClick={handleAddCategory}
            style={styles.addButton}
          >
            ➕ Add
          </button>
        </div>
      </div>

      {/* Categories List */}
      <div style={styles.section}>
        <label style={styles.label}>Current Categories ({categories.length})</label>
        <div style={styles.categoryList}>
          {categories.map((cat, idx) => (
            <div key={idx} style={styles.categoryItem}>
              {editingId === idx ? (
                <div style={styles.editRow}>
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    style={styles.editInput}
                    autoFocus
                  />
                  <button
                    onClick={() => handleEditCategory(cat)}
                    style={styles.saveBtn}
                  >
                    ✓ Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    style={styles.cancelBtn}
                  >
                    ✕ Cancel
                  </button>
                </div>
              ) : (
                <div style={styles.viewRow}>
                  <span style={styles.categoryName}>{cat}</span>
                  <div style={styles.actions}>
                    <button
                      onClick={() => {
                        setEditingId(idx);
                        setEditingName(cat);
                      }}
                      style={styles.editBtn}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(cat)}
                      style={styles.deleteBtn}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Messages */}
      {error && <div style={styles.error}>{error}</div>}
      {success && <div style={styles.success}>{success}</div>}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    backgroundColor: 'var(--color-background-secondary)',
    borderRadius: '8px',
    marginBottom: '20px'
  },
  title: {
    color: 'var(--color-text)',
    marginBottom: '15px',
    fontSize: '18px',
    fontWeight: '600'
  },
  section: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    color: 'var(--color-text)',
    marginBottom: '10px',
    fontWeight: '500',
    fontSize: '14px'
  },
  inputGroup: {
    display: 'flex',
    gap: '10px',
    marginBottom: '15px'
  },
  input: {
    flex: 1,
    padding: '10px 12px',
    border: '1px solid var(--color-border)',
    borderRadius: '6px',
    backgroundColor: 'var(--color-background)',
    color: 'var(--color-text)',
    fontSize: '14px',
    outline: 'none'
  },
  addButton: {
    padding: '10px 20px',
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
    }
  },
  categoryList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    maxHeight: '400px',
    overflowY: 'auto'
  },
  categoryItem: {
    padding: '12px',
    backgroundColor: 'var(--color-background)',
    borderRadius: '6px',
    border: '1px solid var(--color-border)',
  },
  viewRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  categoryName: {
    color: 'var(--color-text)',
    fontWeight: '500',
    fontSize: '14px'
  },
  actions: {
    display: 'flex',
    gap: '8px'
  },
  editRow: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center'
  },
  editInput: {
    flex: 1,
    padding: '8px 10px',
    border: '1px solid var(--color-accent)',
    borderRadius: '4px',
    backgroundColor: 'var(--color-background)',
    color: 'var(--color-text)',
    fontSize: '14px',
    outline: 'none'
  },
  editBtn: {
    padding: '6px 12px',
    backgroundColor: 'var(--color-primary)',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '600'
  },
  deleteBtn: {
    padding: '6px 12px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '600'
  },
  saveBtn: {
    padding: '6px 12px',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '600'
  },
  cancelBtn: {
    padding: '6px 12px',
    backgroundColor: '#95a5a6',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '600'
  },
  error: {
    padding: '12px',
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
    color: '#e74c3c',
    borderRadius: '6px',
    marginTop: '10px',
    fontSize: '14px'
  },
  success: {
    padding: '12px',
    backgroundColor: 'rgba(39, 174, 96, 0.1)',
    color: '#27ae60',
    borderRadius: '6px',
    marginTop: '10px',
    fontSize: '14px'
  }
};
