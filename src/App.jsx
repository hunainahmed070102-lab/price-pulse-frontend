import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Overview from './components/Overview';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import ComplaintsSection from './components/ComplaintsSection';
import Analytics from './components/Analytics';
import Settings from './components/Settings';
import Login from './components/Login';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [theme, setTheme] = useState('light');

  // Check authentication and load theme on mount
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsAuthenticated(true);
    }
    
    const savedTheme = localStorage.getItem('adminTheme') || 'light';
    setTheme(savedTheme);
    document.body.setAttribute('data-theme', savedTheme);
  }, []);

  // Update theme
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    setIsAuthenticated(false);
    setActiveTab('overview');
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowProductForm(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleCloseForm = () => {
    setShowProductForm(false);
    setEditingProduct(null);
  };

  const handleProductSaved = () => {
    setRefreshTrigger(prev => prev + 1);
    handleCloseForm();
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
      
      <main className="main-content">
        {activeTab === 'overview' && <Overview onNavigate={setActiveTab} />}
        
        {activeTab === 'products' && (
          <ProductList
            onAddProduct={handleAddProduct}
            onEditProduct={handleEditProduct}
            refreshTrigger={refreshTrigger}
          />
        )}
        
        {activeTab === 'complaints' && (
          <ComplaintsSection />
        )}
        
        {activeTab === 'analytics' && <Analytics />}
        
        {activeTab === 'settings' && (
          <Settings theme={theme} setTheme={setTheme} />
        )}
      </main>

      {showProductForm && (
        <ProductForm
          product={editingProduct}
          onClose={handleCloseForm}
          onSave={handleProductSaved}
        />
      )}
    </div>
  );
}

export default App;
