import { useState, useEffect } from 'react';
import { X, User, AlertCircle, Calendar, Hash, Check, Loader } from 'lucide-react';
import './ComplaintModal.css';

const ComplaintModal = ({ complaint, isOpen, onClose, onUpdateStatus }) => {
    const [status, setStatus] = useState(complaint?.status || 'pending');
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        if (complaint) {
            setStatus(complaint.status);
        }
    }, [complaint]);

    const handleStatusUpdate = async () => {
        if (status === complaint.status) return;
        
        setUpdating(true);
        try {
            await onUpdateStatus(complaint._id, status);
            
            // Add activity notification
            if (window.addAdminActivity) {
                window.addAdminActivity({
                    title: 'Complaint Status Updated',
                    message: `${complaint.customerName}'s complaint marked as ${status}`,
                    type: 'complaint',
                    icon: 'status'
                });
            }
            
            onClose();
        } catch (error) {
            console.error('Failed to update status:', error);
        } finally {
            setUpdating(false);
        }
    };

    const getStatusOptions = () => [
        { value: 'pending', label: 'Pending' },
        { value: 'processing', label: 'Processing' },
        { value: 'resolved', label: 'Resolved' },
        { value: 'rejected', label: 'Rejected' }
    ];

    if (!isOpen || !complaint) return null;

    return (
        <div className="complaint-modal-overlay" onClick={onClose}>
            <div className="complaint-modal" onClick={(e) => e.stopPropagation()}>
                <div className="complaint-modal-header">
                    <h2>Complaint Details</h2>
                    <button onClick={onClose} className="complaint-close-btn">
                        <X size={20} />
                    </button>
                </div>
                
                <div className="complaint-modal-content">
                    {/* Status Update Section */}
                    <div className="complaint-status-section">
                        <h3 className="complaint-status-title">
                            <Check size={18} /> Update Status
                        </h3>
                        <div className="status-options">
                            {getStatusOptions().map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => setStatus(option.value)}
                                    className={`status-option-btn ${option.value} ${
                                        status === option.value ? 'active' : 'inactive'
                                    }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={handleStatusUpdate}
                            disabled={updating || status === complaint.status}
                            className="update-status-btn"
                        >
                            {updating ? (
                                <>
                                    <Loader size={18} className="spinner-icon" /> Updating...
                                </>
                            ) : (
                                <>
                                    <Check size={18} /> Update Status
                                </>
                            )}
                        </button>
                    </div>

                    {/* Complaint Details */}
                    <div className="complaint-details">
                        {/* Header with status */}
                        <div className="complaint-header-card">
                            <div className="complaint-header-top">
                                <div className="complaint-id-section">
                                    <div className="complaint-id-label">Complaint ID</div>
                                    <div className="complaint-id-value">{complaint.complaintId}</div>
                                    <div className="complaint-type-badge">
                                        {complaint.complaintTable?.toUpperCase() || 'PRICE'}
                                    </div>
                                </div>
                                <div className="complaint-status-badge">
                                    {complaint.status.replace('-', ' ')}
                                </div>
                            </div>
                            <div>
                                <h3 className="complaint-product-name">{complaint.productName}</h3>
                                <p className="complaint-shop-name">Reported at {complaint.shopName}</p>
                            </div>
                        </div>
                        
                        {/* Customer & Issue */}
                        <div className="complaint-info-grid">
                            <div className="complaint-info-card customer">
                                <h4 className="complaint-info-title customer">
                                    <User size={16} /> Customer Details
                                </h4>
                                <p className="complaint-info-text"><strong>Name:</strong> {complaint.customerName}</p>
                                <p className="complaint-info-text"><strong>Phone:</strong> {complaint.phoneNumber}</p>
                                <p className="complaint-info-text"><strong>Location:</strong> {complaint.location}</p>
                            </div>
                            
                            <div className="complaint-info-card issue">
                                <h4 className="complaint-info-title issue">
                                    <AlertCircle size={16} /> Issue Description
                                </h4>
                                <p className="complaint-issue-text">{complaint.issue}</p>
                            </div>
                        </div>
                        
                        {/* Metadata */}
                        <div className="complaint-metadata">
                            <div className="complaint-meta-item">
                                <Calendar size={16} />
                                <span>Submitted: {new Date(complaint.createdAt).toLocaleString()}</span>
                            </div>
                            <div className="complaint-meta-item">
                                <Hash size={16} />
                                <span>Ref: {complaint.complaintId}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComplaintModal;
