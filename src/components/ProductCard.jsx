import { Citrus, Carrot, Beef, ShoppingCart, Milk, Scissors, Package } from 'lucide-react';
import './ProductCard.css';

const ProductCard = ({ product, onEdit, onDelete }) => {
  const getCategoryIcon = (category) => {
    const icons = {
      fruit: Citrus,
      vegetable: Carrot,
      meat: Beef,
      grocery: ShoppingCart,
      dairy: Milk,
      tailor: Scissors
    };
    return icons[category] || Package;
  };

  const getCategoryColor = (category) => {
    const colors = {
      fruit: '#FF6B6B',
      vegetable: '#51CF66',
      meat: '#FF8787',
      grocery: '#4DABF7',
      dairy: '#FFD43B',
      tailor: '#9775FA'
    };
    return colors[category] || '#6B0EFF';
  };

  const IconComponent = getCategoryIcon(product.category);

  return (
    <div className="product-card">
      <div className="card-header">
        <div 
          className="category-badge" 
          style={{ backgroundColor: `${getCategoryColor(product.category)}15`, color: getCategoryColor(product.category) }}
        >
          <span className="category-icon">
            <IconComponent size={18} strokeWidth={2} />
          </span>
          <span className="category-name">{product.category}</span>
        </div>
        <div className="card-actions">
          <button className="action-btn edit-btn" onClick={onEdit} title="Edit">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M12.5 2.5l3 3L6 15H3v-3L12.5 2.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
          </button>
          <button className="action-btn delete-btn" onClick={onDelete} title="Delete">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3 5h12M7 5V3h4v2M8 8v5M10 8v5M5 5l1 10h6l1-10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="card-body">
        <h3 className="product-name">{product.name}</h3>
        <div className="product-price">
          <span className="price-label">Price</span>
          <span className="price-value">PKR {product.price}</span>
        </div>
      </div>

      <div className="card-footer">
        <div className="product-meta">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            <path d="M8 4v4l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span>Updated recently</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
