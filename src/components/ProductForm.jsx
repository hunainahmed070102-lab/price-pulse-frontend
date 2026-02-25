import { useState, useEffect } from 'react';
import { Citrus, Carrot, Beef, ShoppingCart, Milk, Scissors, X, AlertCircle, Check, UtensilsCrossed, Sparkles } from 'lucide-react';
import { productAPI } from '../services/api';
import './ProductForm.css';

const ProductForm = ({ product, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'fruit',
    price: '',
    unit: 'kg',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const units = ['kg', 'gram', 'liter', 'ml', 'piece', 'dozen', 'pack'];

  const categories = [
    { value: 'fruit', label: 'Fruit', icon: Citrus },
    { value: 'vegetable', label: 'Vegetable', icon: Carrot },
    { value: 'meat', label: 'Meat', icon: Beef },
    { value: 'grocery', label: 'Grocery', icon: ShoppingCart },
    { value: 'dairy', label: 'Dairy', icon: Milk },
    { value: 'tailor', label: 'Tailor', icon: Scissors },
    { value: 'street food', label: 'Street Food', icon: UtensilsCrossed },
    { value: 'barber', label: 'Barber', icon: Sparkles }
  ];

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        category: product.category,
        price: product.price.toString(),
        unit: product.unit || 'kg',
        description: product.description || ''
      });
    }
  }, [product]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Product name is required');
      return;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError('Valid price is required');
      return;
    }

    setLoading(true);

    try {
      const data = {
        name: formData.name.trim(),
        category: formData.category,
        price: parseFloat(formData.price),
        unit: formData.unit,
        description: formData.description.trim()
      };

      if (product) {
        await productAPI.update(product._id, data);
        
        // Add activity notification
        if (window.addAdminActivity) {
          window.addAdminActivity({
            title: 'Product Updated',
            message: `${data.name} details were modified`,
            type: 'product',
            icon: 'edit'
          });
        }
      } else {
        await productAPI.create(data);
        
        // Add activity notification
        if (window.addAdminActivity) {
          window.addAdminActivity({
            title: 'Product Added',
            message: `${data.name} added to catalog`,
            type: 'product',
            icon: 'add'
          });
        }
      }

      setShowSuccess(true);
      setTimeout(() => {
        onSave();
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="product-form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="form-header">
          <h2>{product ? 'Edit Product' : 'Add New Product'}</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="product-form">
          {error && (
            <div className="error-message">
              <AlertCircle size={20} />
              {error}
            </div>
          )}

          {/* Product Header Card - Purple Gradient */}
          <div className="product-header-card">
            <div className="product-header-top">
              <div className="product-category-section">
                <div className="product-category-label">Category</div>
                <div className="category-select-inline">
                  {categories.map(cat => {
                    const IconComponent = cat.icon;
                    return (
                      <button
                        key={cat.value}
                        type="button"
                        className={`category-btn-inline ${formData.category === cat.value ? 'active' : ''}`}
                        onClick={() => setFormData({ ...formData, category: cat.value })}
                        disabled={loading}
                        title={cat.label}
                      >
                        <IconComponent size={18} strokeWidth={2.5} />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            <div>
              <input
                type="text"
                className="product-name-input"
                placeholder="Enter product name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={loading}
              />
              <p className="product-subtitle">Product will be added to inventory</p>
            </div>
          </div>

          {/* Pricing Details */}
          <div className="product-info-grid">
            <div className="product-info-card pricing">
              <h4 className="product-info-title pricing">
                <AlertCircle size={16} /> Pricing Details
              </h4>
              <div className="pricing-row">
                <div className="pricing-field">
                  <label>Price (PKR)</label>
                  <div className="price-input-compact">
                    <span className="currency-compact">PKR</span>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      disabled={loading}
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>
                <div className="pricing-field">
                  <label>Unit</label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    disabled={loading}
                    className="unit-select-compact"
                  >
                    {units.map(unit => (
                      <option key={unit} value={unit}>
                        {unit.charAt(0).toUpperCase() + unit.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="product-info-card description">
              <h4 className="product-info-title description">
                <AlertCircle size={16} /> Additional Details
              </h4>
              <textarea
                placeholder="Enter product description (optional)..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                disabled={loading}
                className="description-textarea"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons - Fixed at bottom */}
        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button type="button" className="btn-submit" onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-small"></span>
                Saving...
              </>
            ) : (
              <>
                <Check size={20} strokeWidth={2.5} />
                {product ? 'Update Product' : 'Add Product'}
              </>
            )}
          </button>
        </div>

        {showSuccess && (
          <div className="success-modal-overlay">
            <div className="success-modal">
              <div className="success-icon">
                <Check size={40} strokeWidth={3} />
              </div>
              <h3>{product ? 'Product Updated!' : 'Product Added!'}</h3>
              <p>{product ? 'Product has been successfully updated.' : 'New product has been successfully added.'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductForm;
