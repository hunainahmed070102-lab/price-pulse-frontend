import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Overview from './components/Overview';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import ComplaintsSection from './components/ComplaintsSection';
import Analytics from './components/Analytics';
import Login from './components/Login';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // No auto-authentication - always show login first
  useEffect(() => {
    // Removed auto-authentication check
    // User must login every time
  }, []);

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
