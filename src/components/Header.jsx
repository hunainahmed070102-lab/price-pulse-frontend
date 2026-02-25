import { useState } from 'react';
import './Header.css';

const Header = ({ activeTab, setActiveTab }) => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    window.location.href = '/login.html';
  };

  return (
    <>
      <header className="header">
        <div className="header-content">
          <div className="header-left">
            <div className="logo-container">
              <div className="logo-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <rect width="32" height="32" rx="8" fill="#6B0EFF"/>
                  <path d="M16 8L22 14L16 20L10 14L16 8Z" fill="white"/>
                </svg>
              </div>
              <div className="logo-text">
                <h1>Price Pulse</h1>
                <span>Admin Dashboard</span>
              </div>
            </div>
          </div>

          <nav className="header-nav">
            <button
              className={`nav-btn ${activeTab === 'products' ? 'active' : ''}`}
              onClick={() => setActiveTab('products')}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M3 3h14v14H3V3z" stroke="currentColor" strokeWidth="2" fill="none"/>
                <path d="M7 7h6M7 10h6M7 13h4" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Products
            </button>
            
            <button
              className={`nav-btn ${activeTab === 'complaints' ? 'active' : ''}`}
              onClick={() => setActiveTab('complaints')}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16z" stroke="currentColor" strokeWidth="2" fill="none"/>
                <path d="M10 6v4M10 14h.01" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Complaints
            </button>
          </nav>

          <button className="logout-btn" onClick={() => setShowLogoutConfirm(true)}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M13 3h4v14h-4M7 10h10M10 7l3 3-3 3" stroke="currentColor" strokeWidth="2" fill="none"/>
            </svg>
            Logout
          </button>
        </div>
      </header>

      {showLogoutConfirm && (
        <div className="modal-overlay" onClick={() => setShowLogoutConfirm(false)}>
          <div className="logout-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to logout?</p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowLogoutConfirm(false)}>
                Cancel
              </button>
              <button className="btn-confirm" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
