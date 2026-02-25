import { useState, useEffect } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { productAPI } from '../services/api';
import './ProductList.css';

const ProductList = ({ onAddProduct, onEditProduct, refreshTrigger }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, productId: null, productName: '' });
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [categories, setCategories] = useState(['all', 'fruit', 'vegetable', 'meat', 'grocery', 'dairy', 'tailor', 'street food', 'barber']);

  useEffect(() => {
    // Always ensure default categories are present
    const defaultCategories = ['fruit', 'vegetable', 'meat', 'grocery', 'dairy', 'tailor', 'street food', 'barber'];
    const savedCategories = localStorage.getItem('productCategories');
    
    if (savedCategories) {
      try {
        const parsed = JSON.parse(savedCategories);
        // Filter out transport category
        const filteredCategories = parsed.filter(cat => cat.toLowerCase() !== 'transport');
        // Merge with defaults, removing duplicates (defaults come first)
        const merged = [...new Set([...defaultCategories, ...filteredCategories])];
        setCategories(['all', ...merged]);
        // Update localStorage with merged categories
        localStorage.setItem('productCategories', JSON.stringify(merged));
      } catch (error) {
        console.error('Error loading categories:', error);
        // Reset to defaults on error
        setCategories(['all', ...defaultCategories]);
        localStorage.setItem('productCategories', JSON.stringify(defaultCategories));
      }
    } else {
      // Initialize localStorage with defaults
      localStorage.setItem('productCategories', JSON.stringify(defaultCategories));
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [refreshTrigger]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getAll();
      console.log('Products API Response:', response.data);
      
      // Access data correctly from axios response
      const productsData = response.data.data || response.data || [];
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (product) => {
    setDeleteConfirm({ show: true, productId: product._id, productName: product.name });
  };

  const handleDeleteConfirm = async () => {
    try {
      await productAPI.delete(deleteConfirm.productId);
      setProducts(products.filter(p => p._id !== deleteConfirm.productId));
      
      // Add activity notification
      if (window.addAdminActivity) {
        window.addAdminActivity({
          title: 'Product Deleted',
          message: `${deleteConfirm.productName} was removed from catalog`,
          type: 'product',
          icon: 'delete'
        });
      }
      
      setDeleteConfirm({ show: false, productId: null, productName: '' });
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm({ show: false, productId: null, productName: '' });
  };

  const filteredProducts = products.filter(product => {
    // Filter out transport category
    if (product.category.toLowerCase() === 'transport') return false;
    const matchesFilter = filter === 'all' || product.category === filter;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="product-list-container">
      <div className="list-header">
        <div className="header-top">
          <div>
            <h2>Product Management</h2>
            <p>Manage your product catalog and pricing</p>
          </div>
          <button className="add-product-btn" onClick={onAddProduct}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            Add Product
          </button>
        </div>

        <div className="filters-section">
          <div className="search-box">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="9" cy="9" r="5" stroke="currentColor" strokeWidth="2" fill="none"/>
              <path d="M13 13l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="category-filters">
            {categories.map(cat => (
              <button
                key={cat}
                className={`filter-btn ${filter === cat ? 'active' : ''}`}
                onClick={() => setFilter(cat)}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading products...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="empty-state">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            <circle cx="40" cy="40" r="35" stroke="#EBEBEB" strokeWidth="4" fill="none"/>
            <path d="M40 25v30M25 40h30" stroke="#EBEBEB" strokeWidth="4" strokeLinecap="round"/>
          </svg>
          <h3>No Products Found</h3>
          <p>Try adjusting your filters or add a new product</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="products-table">
            <thead>
              <tr>
                <th>No.</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Unit</th>
                <th>Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, index) => (
                <tr key={product._id}>
                  <td>{index + 1}</td>
                  <td className="product-name-cell">{product.name}</td>
                  <td>
                    <span className="category-badge" data-category={product.category}>
                      {product.category}
                    </span>
                  </td>
                  <td className="price-cell">PKR {product.price}</td>
                  <td>{product.unit || 'Per Item'}</td>
                  <td className="date-cell">
                    {new Date(product.updatedAt || product.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </td>
                  <td className="actions-cell">
                    <button className="action-btn edit-btn" onClick={() => onEditProduct(product)} title="Edit">
                      <Pencil size={16} />
                    </button>
                    <button className="action-btn delete-btn" onClick={() => handleDeleteClick(product)} title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="list-footer">
        <p>Showing {filteredProducts.length} of {products.length} products</p>
      </div>

      {deleteConfirm.show && (
        <div className="delete-modal-backdrop">
          <div className="delete-modal-overlay">
            <div className="delete-modal">
              <div className="delete-modal-icon">
                <Trash2 size={40} strokeWidth={3} />
              </div>
              <h3>Delete Product?</h3>
              <p>Are you sure you want to delete <strong>{deleteConfirm.productName}</strong>? This action cannot be undone.</p>
              <div className="delete-modal-actions">
                <button className="cancel-btn" onClick={handleDeleteCancel}>Cancel</button>
                <button className="confirm-delete-btn" onClick={handleDeleteConfirm}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
