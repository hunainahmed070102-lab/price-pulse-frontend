import { useState, useEffect } from 'react';
import { Trash2, Eye } from 'lucide-react';
import { complaintAPI } from '../services/api';
import ComplaintModal from './ComplaintModal';
import './ComplaintsSection.css';

const ComplaintsSection = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [deleteConfirm, setDeleteConfirm] = useState({ show: false, complaintId: null, complaintRef: '' });
    const [searchQuery, setSearchQuery] = useState('');
    const [timeFilter, setTimeFilter] = useState('all');

    useEffect(() => {
        fetchComplaints();
        const interval = setInterval(fetchComplaints, 10000);
        return () => clearInterval(interval);
    }, []);

    // Update current time every minute for real-time timestamp display
    useEffect(() => {
        const timeInterval = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000); // Update every minute

        return () => clearInterval(timeInterval);
    }, []);

    const fetchComplaints = async () => {
        try {
            setLoading(true);
            const response = await complaintAPI.getAll();
            console.log('Complaints API Response:', response.data);
            
            // Access data correctly from axios response
            const complaintsData = response.data.data || response.data || [];
            setComplaints(complaintsData);
        } catch (error) {
            console.error('Error fetching complaints:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewComplaint = (complaint) => {
        setSelectedComplaint(complaint);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedComplaint(null);
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            console.log('🔄 Updating complaint status:', { id, status });
            const res = await complaintAPI.updateStatus(id, status);
            console.log('📥 Update Status Response:', res);
            
            // Handle axios response structure: res.data contains the actual response
            if (res.success || (res.data && res.data.success)) {
                // Update local state with the new status
                setComplaints(prev => 
                    prev.map(c => c._id === id ? { ...c, status } : c)
                );
                
                // Also update selectedComplaint if it's the one being updated
                if (selectedComplaint && selectedComplaint._id === id) {
                    setSelectedComplaint(prev => ({ ...prev, status }));
                }
                
                console.log('✅ Status updated successfully in UI');
            } else {
                console.error('❌ Status update failed:', res);
            }
        } catch (error) {
            console.error('❌ Failed to update status:', error);
            const errorMsg = error.response?.data?.error || error.message || 'Unknown error';
            alert(`Failed to update complaint status: ${errorMsg}\n\nPlease check the browser console for more details.`);
        }
    };

    const handleDeleteClick = (complaint) => {
        setDeleteConfirm({ show: true, complaintId: complaint._id, complaintRef: complaint.complaintId });
    };

    const handleDeleteConfirm = async () => {
        try {
            const res = await complaintAPI.delete(deleteConfirm.complaintId);
            if (res.data.success) {
                setComplaints(prev => prev.filter(x => x._id !== deleteConfirm.complaintId));
                
                // Add activity notification
                if (window.addAdminActivity) {
                    window.addAdminActivity({
                        title: 'Complaint Deleted',
                        message: `Complaint ${deleteConfirm.complaintRef} was removed`,
                        type: 'complaint',
                        icon: 'delete'
                    });
                }
            }
            setDeleteConfirm({ show: false, complaintId: null, complaintRef: '' });
        } catch (error) {
            console.error('Delete complaint failed:', error);
            setDeleteConfirm({ show: false, complaintId: null, complaintRef: '' });
        }
    };

    const handleDeleteCancel = () => {
        setDeleteConfirm({ show: false, complaintId: null, complaintRef: '' });
    };

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        const now = currentTime;
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) {
            return 'Just now';
        } else if (diffMins < 60) {
            return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
        } else if (diffHours < 24) {
            return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        } else if (diffDays < 7) {
            return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        } else {
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    };

    const filterByTime = (complaint) => {
        if (timeFilter === 'all') return true;
        
        const now = new Date();
        const complaintDate = new Date(complaint.createdAt);
        const diffMs = now - complaintDate;
        const diffDays = diffMs / (1000 * 60 * 60 * 24);

        switch (timeFilter) {
            case 'today':
                return diffDays < 1;
            case 'week':
                return diffDays < 7;
            case 'month':
                return diffDays < 30;
            default:
                return true;
        }
    };

    const filteredComplaints = complaints.filter(complaint => {
        const matchesSearch = 
            complaint.phoneNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            complaint.complaintId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            complaint.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            complaint.productName.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesTime = filterByTime(complaint);
        
        return matchesSearch && matchesTime;
    });

    const getFullTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    if (loading && complaints.length === 0) {
        return (
            <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading complaints...</p>
            </div>
        );
    }

    return (
        <div className="complaints-container">
            <div className="complaints-header">
                <div className="complaints-header-top">
                    <div>
                        <h2>Complaint Management</h2>
                        <p>Monitor and respond to customer complaints</p>
                    </div>
                </div>

                <div className="filters-section">
                    <div className="search-box">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <circle cx="9" cy="9" r="5" stroke="currentColor" strokeWidth="2" fill="none"/>
                            <path d="M13 13l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        <input
                            type="text"
                            placeholder="Search by phone, ID, customer, or product..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="time-filters">
                        <button
                            className={`filter-btn ${timeFilter === 'all' ? 'active' : ''}`}
                            onClick={() => setTimeFilter('all')}
                        >
                            All Time
                        </button>
                        <button
                            className={`filter-btn ${timeFilter === 'today' ? 'active' : ''}`}
                            onClick={() => setTimeFilter('today')}
                        >
                            Today
                        </button>
                        <button
                            className={`filter-btn ${timeFilter === 'week' ? 'active' : ''}`}
                            onClick={() => setTimeFilter('week')}
                        >
                            Last 7 Days
                        </button>
                        <button
                            className={`filter-btn ${timeFilter === 'month' ? 'active' : ''}`}
                            onClick={() => setTimeFilter('month')}
                        >
                            Last 30 Days
                        </button>
                    </div>
                </div>
            </div>
            {filteredComplaints.length === 0 && !loading ? (
                <div className="empty-state">
                    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                        <circle cx="40" cy="40" r="35" stroke="#EBEBEB" strokeWidth="4" fill="none"/>
                        <path d="M40 25v30M25 40h30" stroke="#EBEBEB" strokeWidth="4" strokeLinecap="round"/>
                    </svg>
                    <h3>No Complaints Yet</h3>
                    <p className="empty-state-description">Customer complaints will appear here once they are submitted through the mobile app.</p>
                    <div className="empty-features">
                        <div className="empty-feature">
                            <div className="empty-feature-icon blue">
                                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <p className="empty-feature-text">Real-time Updates</p>
                        </div>
                        <div className="empty-feature">
                            <div className="empty-feature-icon purple">
                                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <p className="empty-feature-text">Secure Tracking</p>
                        </div>
                        <div className="empty-feature">
                            <div className="empty-feature-icon indigo">
                                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <p className="empty-feature-text">Quick Response</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="complaints-table-container">
                    <table className="complaints-table">
                        <thead>
                            <tr>
                                <th>Complaint ID</th>
                                <th>Type</th>
                                <th>Submitted</th>
                                <th>Product</th>
                                <th>Issue</th>
                                <th>Status</th>
                                <th style={{textAlign: 'center'}}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredComplaints.map((c) => (
                                <tr key={c._id}>
                                    <td>
                                        <div className="complaint-id-cell">
                                            <div>
                                                <div className="complaint-id-text">{c.complaintId}</div>
                                                <div className="complaint-sub-id">ID: {c._id.slice(-6)}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`type-badge ${c.complaintTable}`}>
                                            {c.complaintTable}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="timestamp-cell">
                                            <span className="timestamp-main">{formatTimestamp(c.createdAt)}</span>
                                            <span className="timestamp-sub">{new Date(c.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="product-cell">
                                            <div className="product-info">
                                                <div className="product-name" title={c.productName}>{c.productName}</div>
                                                <div className="shop-name" title={c.shopName}>{c.shopName}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="issue-cell">
                                            <p className="issue-text" title={c.issue}>
                                                {c.issue.length > 60 ? `${c.issue.substring(0, 60)}...` : c.issue}
                                            </p>
                                            {c.issue.length > 60 && (
                                                <span className="issue-more">Click details for more</span>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${c.status}`}>
                                            {c.status.replace('-', ' ')}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="actions-cell">
                                            <button onClick={() => handleViewComplaint(c)} className="view-btn" title="View Details">
                                                <Eye size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(c)}
                                                className="delete-complaint-btn"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="list-footer">
                <p>Showing {filteredComplaints.length} of {complaints.length} complaints</p>
            </div>
            
            {/* Complaint Detail Modal */}
            <ComplaintModal 
                complaint={selectedComplaint}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onUpdateStatus={handleUpdateStatus}
            />

            {/* Delete Confirmation Modal */}
            {deleteConfirm.show && (
                <div className="delete-modal-backdrop">
                    <div className="delete-modal-overlay">
                        <div className="delete-modal">
                            <div className="delete-modal-icon">
                                <Trash2 size={40} strokeWidth={3} />
                            </div>
                            <h3>Delete Complaint?</h3>
                            <p>Are you sure you want to delete complaint <strong>{deleteConfirm.complaintRef}</strong>? This action cannot be undone.</p>
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

export default ComplaintsSection;
