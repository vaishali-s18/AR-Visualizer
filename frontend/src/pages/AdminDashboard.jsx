import { useEffect, useState } from 'react';
import api from '../api/axios';
import './AdminDashboard.css';

// ─── Default empty form state ─────────────────────────────────────────────────
const EMPTY_FORM = {
  name: '', category: '', price: '',
  description: '', modelUrl: '', thumbnailUrl: '', affiliateUrl: '',
  'dimensions.width': '', 'dimensions.height': '', 'dimensions.depth': '',
};

// ─── AdminDashboard ───────────────────────────────────────────────────────────
// Full CRUD table for managing products — accessible to admin users only.
const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');
  const [modal,    setModal]    = useState(false);  // true = open
  const [editing,  setEditing]  = useState(null);   // null = adding new
  const [form,     setForm]     = useState(EMPTY_FORM);
  const [saving,   setSaving]   = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/products');
      setProducts(data);
    } catch {
      setError('Failed to load products.');
    } finally {
      setLoading(false);
    }
  };

  // Open modal to add a new product
  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormError('');
    setModal(true);
  };

  // Open modal pre-filled with existing product data
  const openEdit = (product) => {
    setEditing(product._id);
    setForm({
      name:              product.name,
      category:          product.category,
      price:             product.price,
      description:       product.description || '',
      modelUrl:          product.modelUrl,
      thumbnailUrl:      product.thumbnailUrl || '',
      affiliateUrl:      product.affiliateUrl || '',
      'dimensions.width':  product.dimensions?.width  || '',
      'dimensions.height': product.dimensions?.height || '',
      'dimensions.depth':  product.dimensions?.depth  || '',
    });
    setFormError('');
    setModal(true);
  };

  const closeModal = () => { setModal(false); setEditing(null); };

  // Handle any form input change
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Submit: create or update product
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError('');

    // Build the payload — nest dimensions back into an object
    const payload = {
      name:         form.name,
      category:     form.category,
      price:        Number(form.price),
      description:  form.description,
      modelUrl:     form.modelUrl,
      thumbnailUrl: form.thumbnailUrl,
      affiliateUrl: form.affiliateUrl,
      dimensions: {
        width:  Number(form['dimensions.width'])  || 0,
        height: Number(form['dimensions.height']) || 0,
        depth:  Number(form['dimensions.depth'])  || 0,
      },
    };

    try {
      if (editing) {
        await api.put(`/api/products/${editing}`, payload);
      } else {
        await api.post('/api/products', payload);
      }
      closeModal();
      fetchProducts(); // Refresh the table
    } catch (err) {
      setFormError(err.response?.data?.message || 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/api/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch {
      alert('Delete failed.');
    }
  };

  return (
    <div className="page">
      <div className="admin-header">
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-subtitle">Manage the furniture catalogue.</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Product</button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="admin-skeleton">
          {[...Array(5)].map((_, i) => <div key={i} className="skeleton" style={{ height: 52 }} />)}
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Model URL</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td className="td-name">{p.name}</td>
                  <td><span className="badge">{p.category}</span></td>
                  <td>₹{p.price.toLocaleString('en-IN')}</td>
                  <td className="td-url">{p.modelUrl}</td>
                  <td>
                    <div className="td-actions">
                      <button className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }} onClick={() => openEdit(p)}>Edit</button>
                      <button className="btn btn-danger"    style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }} onClick={() => handleDelete(p._id, p.name)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && (
            <div className="empty-state"><p>No products yet. Click "Add Product" to get started.</p></div>
          )}
        </div>
      )}

      {/* ── Add / Edit Modal ────────────────────────────────────────────────── */}
      {modal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">{editing ? 'Edit Product' : 'Add Product'}</h2>

            {formError && <div className="error-message">{formError}</div>}

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="modal-grid">
                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label>Product Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Category *</label>
                  <select name="category" value={form.category} onChange={handleChange} required>
                    <option value="">Select...</option>
                    {['Chairs','Sofas','Tables','Lighting','Storage','Other'].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Price (₹) *</label>
                  <input name="price" type="number" min="0" value={form.price} onChange={handleChange} required />
                </div>
                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label>Description</label>
                  <textarea name="description" rows={3} value={form.description} onChange={handleChange} />
                </div>
                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label>Model URL (.glb) *</label>
                  <input name="modelUrl" value={form.modelUrl} onChange={handleChange} required placeholder="/models/Chair.glb" />
                </div>
                <div className="form-group">
                  <label>Thumbnail URL</label>
                  <input name="thumbnailUrl" value={form.thumbnailUrl} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Affiliate URL</label>
                  <input name="affiliateUrl" value={form.affiliateUrl} onChange={handleChange} placeholder="https://amazon.in/..." />
                </div>
                <div className="form-group">
                  <label>Width (cm)</label>
                  <input name="dimensions.width" type="number" value={form['dimensions.width']} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Height (cm)</label>
                  <input name="dimensions.height" type="number" value={form['dimensions.height']} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Depth (cm)</label>
                  <input name="dimensions.depth" type="number" value={form['dimensions.depth']} onChange={handleChange} />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : editing ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
