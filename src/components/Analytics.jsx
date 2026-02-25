import { useState, useEffect } from 'react';
import { productAPI, complaintAPI } from '../services/api';
import * as XLSX from 'xlsx';
import './Analytics.css';

const Analytics = () => {
  const [products, setProducts] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProductCategory, setSelectedProductCategory] = useState('all');
  const [selectedComplaintStatus, setSelectedComplaintStatus] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsRes, complaintsRes] = await Promise.all([
        productAPI.getAll(),
        complaintAPI.getAll()
      ]);

      // Access data correctly from axios response
      const productsData = productsRes.data.data || productsRes.data || [];
      const complaintsData = complaintsRes.data.data || complaintsRes.data || [];
      
      setProducts(productsData);
      setComplaints(complaintsData);
      
      console.log('Analytics Data:', { products: productsData.length, complaints: complaintsData.length });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportProductsToExcel = () => {
    const filteredProducts = selectedProductCategory === 'all' 
      ? products 
      : products.filter(p => p.category === selectedProductCategory);
    
    const data = filteredProducts.map(p => ({
      'Product Name': p.name,
      'Category': p.category,
      'Price (PKR)': p.price,
      'Unit': p.unit || 'N/A',
      'Created At': new Date(p.createdAt).toLocaleDateString()
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Products');
    
    // Auto-size columns
    const maxWidth = data.reduce((w, r) => Math.max(w, r['Product Name'].length), 10);
    ws['!cols'] = [
      { wch: maxWidth },
      { wch: 15 },
      { wch: 15 },
      { wch: 10 },
      { wch: 15 }
    ];

    const categoryLabel = selectedProductCategory === 'all' ? 'All' : selectedProductCategory;
    XLSX.writeFile(wb, `Products_${categoryLabel}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const exportComplaintsToExcel = () => {
    const filteredComplaints = selectedComplaintStatus === 'all'
      ? complaints
      : complaints.filter(c => c.status === selectedComplaintStatus);
    
    const data = filteredComplaints.map(c => ({
      'Complaint ID': c.complaintId,
      'Product': c.productName,
      'Category': c.category,
      'Shop Name': c.shopName,
      'Location': c.location,
      'Issue': c.issue,
      'Customer Name': c.customerName,
      'Phone': c.phoneNumber,
      'Status': c.status,
      'Created At': new Date(c.createdAt).toLocaleDateString()
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Complaints');
    
    // Auto-size columns
    ws['!cols'] = [
      { wch: 15 },
      { wch: 20 },
      { wch: 12 },
      { wch: 20 },
      { wch: 20 },
      { wch: 40 },
      { wch: 20 },
      { wch: 15 },
      { wch: 12 },
      { wch: 15 }
    ];

    const statusLabel = selectedComplaintStatus === 'all' ? 'All' : selectedComplaintStatus;
    XLSX.writeFile(wb, `Complaints_${statusLabel}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const getCategoryStats = () => {
    const stats = {};
    products.forEach(p => {
      stats[p.category] = (stats[p.category] || 0) + 1;
    });
    return Object.entries(stats).map(([category, count]) => ({ category, count }));
  };

  const getComplaintStats = () => {
    const pending = complaints.filter(c => c.status === 'pending').length;
    const processing = complaints.filter(c => c.status === 'processing').length;
    const resolved = complaints.filter(c => c.status === 'resolved').length;
    const rejected = complaints.filter(c => c.status === 'rejected').length;
    return { pending, processing, resolved, rejected, total: complaints.length };
  };

  const categoryStats = getCategoryStats();
  const complaintStats = getComplaintStats();

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <div>
          <h2>Analytics & Reports</h2>
          <p>Export data and view insights</p>
        </div>
      </div>

      <div className="export-section">
        <div className="export-card">
          <div className="export-icon" style={{ background: 'linear-gradient(135deg, #f5f0ff 0%, #faf5ff 100%)', color: '#6B0EFF' }}>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <rect x="8" y="8" width="24" height="24" rx="2" stroke="currentColor" strokeWidth="2.5" fill="none"/>
              <path d="M14 14h12M14 20h12M14 26h8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="export-content">
            <h3>Products Data</h3>
            <p>{selectedProductCategory === 'all' ? products.length : products.filter(p => p.category === selectedProductCategory).length} products {selectedProductCategory !== 'all' && `(${selectedProductCategory})`}</p>
            <select 
              className="filter-select"
              value={selectedProductCategory}
              onChange={(e) => setSelectedProductCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="fruit">Fruit</option>
              <option value="vegetable">Vegetable</option>
              <option value="meat">Meat</option>
              <option value="grocery">Grocery</option>
              <option value="dairy">Dairy</option>
              <option value="tailor">Tailor</option>
            </select>
            <p className="export-detail">Export product information for selected category</p>
          </div>
          <button 
            className="export-btn" 
            onClick={exportProductsToExcel}
            disabled={loading || products.length === 0}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 3v10M10 13l-3-3m3 3l3-3M3 17h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Export Excel
          </button>
        </div>

        <div className="export-card">
          <div className="export-icon" style={{ background: 'linear-gradient(135deg, #f5f0ff 0%, #faf5ff 100%)', color: '#6B0EFF' }}>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="12" stroke="currentColor" strokeWidth="2.5" fill="none"/>
              <path d="M20 14v6M20 24h.01" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="export-content">
            <h3>Complaints Data</h3>
            <p>{selectedComplaintStatus === 'all' ? complaints.length : complaints.filter(c => c.status === selectedComplaintStatus).length} complaints {selectedComplaintStatus !== 'all' && `(${selectedComplaintStatus})`}</p>
            <select 
              className="filter-select"
              value={selectedComplaintStatus}
              onChange={(e) => setSelectedComplaintStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
            </select>
            <p className="export-detail">Export complaint records for selected status</p>
          </div>
          <button 
            className="export-btn" 
            onClick={exportComplaintsToExcel}
            disabled={loading || complaints.length === 0}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 3v10M10 13l-3-3m3 3l3-3M3 17h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Export Excel
          </button>
        </div>
      </div>

      <div className="insights-grid">
        <div className="insight-card">
          <h3>Products by Category</h3>
          <div className="category-list">
            {categoryStats.map(({ category, count }) => (
              <div key={category} className="category-item">
                <span className="category-name">{category}</span>
                <span className="category-count">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="insight-card">
          <h3>Complaint Status</h3>
          <div className="status-stats">
            <div className="status-item">
              <div className="status-label">
                <span className="status-dot pending"></span>
                Pending
              </div>
              <span className="status-value">{complaintStats.pending}</span>
            </div>
            <div className="status-item">
              <div className="status-label">
                <span className="status-dot processing"></span>
                Processing
              </div>
              <span className="status-value">{complaintStats.processing}</span>
            </div>
            <div className="status-item">
              <div className="status-label">
                <span className="status-dot resolved"></span>
                Resolved
              </div>
              <span className="status-value">{complaintStats.resolved}</span>
            </div>
            <div className="status-item">
              <div className="status-label">
                <span className="status-dot rejected"></span>
                Rejected
              </div>
              <span className="status-value">{complaintStats.rejected}</span>
            </div>
            <div className="status-item total">
              <div className="status-label">Total</div>
              <span className="status-value">{complaintStats.total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
