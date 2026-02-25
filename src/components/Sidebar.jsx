import { useState } from 'react';
import './Sidebar.css';

const Sidebar = ({ activeTab, setActiveTab, onLogout }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem('adminToken');
      window.location.href = '/login.html';
    }
  };

  const menuItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" fill="none"/>
          <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" fill="none"/>
          <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" fill="none"/>
          <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" fill="none"/>
        </svg>
      )
    },
    {
      id: 'products',
      label: 'Products',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
          <path d="M9 9h6M9 12h6M9 15h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    },
    {
      id: 'complaints',
      label: 'Complaints',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" fill="none"/>
          <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M3 3v16a2 2 0 002 2h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M7 16V10M12 16V6M17 16v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    }
  ];

  return (
    <>
      <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-section">
            <div className="logo-icon">
              <img src="/logo.png" alt="Logo" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
            </div>
            {!collapsed && (
              <div className="logo-text">
                <h1>Price Pulse</h1>
                <span>Admin Panel</span>
              </div>
            )}
          </div>
          <button 
            className="collapse-btn" 
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? 'Expand' : 'Collapse'}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path 
                d={collapsed ? "M7 5l5 5-5 5" : "M13 5l-5 5 5 5"} 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map(item => (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
              title={collapsed ? item.label : ''}
            >
              <span className="nav-icon">{item.icon}</span>
              {!collapsed && <span className="nav-label">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button 
            className="logout-btn" 
            onClick={() => setShowLogoutConfirm(true)}
            title={collapsed ? 'Logout' : ''}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M16 3h5v18h-5M10 12h11M15 8l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {showLogoutConfirm && (
        <div className="modal-overlay" onClick={() => setShowLogoutConfirm(false)}>
          <div className="logout-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="22" stroke="#FF4B4B" strokeWidth="3" fill="none"/>
                <path d="M24 16v12M24 32h.01" stroke="#FF4B4B" strokeWidth="3" strokeLinecap="round"/>
              </svg>
            </div>
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to logout from admin panel?</p>
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

export default Sidebar;
