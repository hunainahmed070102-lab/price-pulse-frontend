import { useState } from 'react';
import { CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';

const ComplaintDetail = ({ complaint, onUpdateStatus, onDelete, onClose }) => {
  const [newStatus, setNewStatus] = useState(complaint?.status || 'pending');

  const handleStatusChange = () => {
    if (newStatus !== complaint.status) {
      onUpdateStatus(complaint._id, newStatus);
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this complaint?')) {
      onDelete(complaint._id);
      onClose();
    }
  };

  if (!complaint) return null;

  const getStatusIcon = (status) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'processing':
        return <AlertTriangle className="w-5 h-5 text-blue-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-orange-500" />;
      default:
        return <Clock className="w-5 h-5 text-orange-500" />;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-orange-100 text-orange-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Complaint Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-2xl font-black text-gray-900 mb-2">{complaint.productName}</h3>
          <div className="flex items-center gap-2">
            {getStatusIcon(complaint.status)}
            <span className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusClass(complaint.status)}`}>
              {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
            </span>
          </div>
        </div>
        <button
          onClick={handleDelete}
          className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-semibold"
        >
          <XCircle className="w-4 h-4" />
          Delete
        </button>
      </div>

      {/* Customer Information */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-100">
        <h4 className="text-lg font-black text-gray-900 mb-4">Customer Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-600 mb-1">Customer Name</label>
            <p className="text-gray-900 font-medium">{complaint.customerName}</p>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-600 mb-1">Phone Number</label>
            <p className="text-gray-900 font-medium">{complaint.phoneNumber}</p>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-600 mb-1">Shop Name</label>
            <p className="text-gray-900 font-medium">{complaint.shopName}</p>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-600 mb-1">Location</label>
            <p className="text-gray-900 font-medium">{complaint.location}</p>
          </div>
        </div>
      </div>

      {/* Complaint Details */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h4 className="text-lg font-black text-gray-900 mb-4">Complaint Details</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-600 mb-2">Issue Description</label>
            <p className="text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200">
              {complaint.issue}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1">Submitted Date</label>
              <p className="text-gray-900 font-medium">
                {new Date(complaint.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1">Last Updated</label>
              <p className="text-gray-900 font-medium">
                {new Date(complaint.updatedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Status Update */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-6 border border-orange-100">
        <h4 className="text-lg font-black text-gray-900 mb-4">Update Status</h4>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex-1">
            <label className="block text-sm font-bold text-gray-600 mb-2">Current Status</label>
            <div className="flex items-center gap-2">
              {getStatusIcon(newStatus)}
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="resolved">Resolved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
          <button
            onClick={handleStatusChange}
            disabled={newStatus === complaint.status}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              newStatus === complaint.status
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg'
            }`}
          >
            Update Status
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <button
          onClick={onClose}
          className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ComplaintDetail;