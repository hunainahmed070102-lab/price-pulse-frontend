import { useState } from 'react';
import { Lock, Eye, EyeOff, Check, AlertCircle, Bell, User, Sun, Moon } from 'lucide-react';
import axios from 'axios';
import './Settings.css';

const API_URL = 'http://192.168.1.101:5000/api';

const Settings = ({ theme, setTheme }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [adminName, setAdminName] = useState(localStorage.getItem('adminEmail') || 'Admin');
  const [notifications, setNotifications] = useState({
    newComplaints: true,
    statusUpdates: true,
    productChanges: false
  });

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.post(
        `${API_URL}/auth/change-password`,
        {
          currentPassword,
          newPassword
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setMessage({ type: 'success', text: 'Password changed successfully! Logging out...' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        
        // Logout after 2 seconds
        setTimeout(() => {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminEmail');
          window.location.reload();
        }, 2000);
      }
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.error || 'Failed to change password' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleThemeToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('adminTheme', newTheme);
    setMessage({ type: 'success', text: `Theme changed to ${newTheme === 'light' ? 'Light' : 'Dark'} mode` });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleNotificationToggle = (key) => {
    setNotifications(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      localStorage.setItem('adminNotifications', JSON.stringify(updated));
      return updated;
    });
    setMessage({ type: 'success', text: 'Notification preferences updated' });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleClearCache = () => {
    localStorage.removeItem('adminNotifications');
    setMessage({ type: 'success', text: 'Cache cleared successfully!' });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <div>
          <h2>Settings</h2>
          <p>Manage your account preferences and security</p>
        </div>
      </div>

      {message.text && (
        <div className={`settings-message ${message.type}`}>
          {message.type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
          <span>{message.text}</span>
        </div>
      )}

      <div className="settings-content">
        {/* Account Info */}
        <div className="settings-section">
          <div className="section-header">
            <User size={24} />
            <div>
              <h2>Account Information</h2>
              <p>View your account details</p>
            </div>
          </div>

          <div className="account-info">
            <div className="info-item">
              <span className="info-label">Email</span>
              <span className="info-value">{adminName}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Role</span>
              <span className="info-value">Administrator</span>
            </div>
            <div className="info-item">
              <span className="info-label">Last Login</span>
              <span className="info-value">{new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</span>
            </div>
          </div>
        </div>

        {/* Notification Preferences & Password Change */}
        <div className="settings-grid">
          <div className="settings-section-left">
            <div className="settings-section">
              <div className="section-header">
                <Bell size={24} />
                <div>
                  <h2>Notifications</h2>
                  <p>Manage your notification preferences</p>
                </div>
              </div>

              <div className="notification-settings">
                <div className="notification-item">
                  <div className="notification-info">
                    <h4>New Complaints</h4>
                    <p>Get notified when new complaints are submitted</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={notifications.newComplaints}
                      onChange={() => handleNotificationToggle('newComplaints')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="notification-item">
                  <div className="notification-info">
                    <h4>Status Updates</h4>
                    <p>Get notified when complaint status changes</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={notifications.statusUpdates}
                      onChange={() => handleNotificationToggle('statusUpdates')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="notification-item">
                  <div className="notification-info">
                    <h4>Product Changes</h4>
                    <p>Get notified when products are added or updated</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={notifications.productChanges}
                      onChange={() => handleNotificationToggle('productChanges')}
                    />
                    <span className="toggle-slider"></span>
                </label>
                </div>
              </div>
            </div>

            <div className="settings-section">
              <div className="section-header">
                {theme === 'light' ? <Sun size={24} /> : <Moon size={24} />}
                <div>
                  <h2>Appearance</h2>
                  <p>Switch between light and dark mode</p>
                </div>
              </div>

              <div className="theme-toggle-container">
                <button 
                  className={`theme-toggle-btn ${theme === 'light' ? 'active' : ''}`}
                  onClick={handleThemeToggle}
                >
                  <Sun size={20} />
                  <span>Light Mode</span>
                  {theme === 'light' && <Check size={18} />}
                </button>
                
                <button 
                  className={`theme-toggle-btn ${theme === 'dark' ? 'active' : ''}`}
                  onClick={handleThemeToggle}
                >
                  <Moon size={20} />
                  <span>Dark Mode</span>
                  {theme === 'dark' && <Check size={18} />}
                </button>
              </div>
            </div>
          </div>

          <div className="settings-section">
            <div className="section-header">
              <Lock size={24} />
              <div>
                <h2>Change Password</h2>
                <p>Update your password to keep your account secure</p>
              </div>
            </div>

            <form onSubmit={handlePasswordChange} className="password-form">
              <div className="form-group">
                <label>Current Password</label>
                <div className="input-wrapper">
                  <Lock size={20} />
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    disabled={loading}
                  >
                    {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>New Password</label>
                <div className="input-wrapper">
                  <Lock size={20} />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    disabled={loading}
                  >
                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Confirm New Password</label>
                <div className="input-wrapper">
                  <Lock size={20} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={loading}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Changing Password...
                  </>
                ) : (
                  'Change Password'
                )}
              </button>

              <div className="password-note">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1.5C4.41 1.5 1.5 4.41 1.5 8C1.5 11.59 4.41 14.5 8 14.5C11.59 14.5 14.5 11.59 14.5 8C14.5 4.41 11.59 1.5 8 1.5ZM8 11C7.72 11 7.5 10.78 7.5 10.5V8C7.5 7.72 7.72 7.5 8 7.5C8.28 7.5 8.5 7.72 8.5 8V10.5C8.5 10.78 8.28 11 8 11ZM8.5 6H7.5V5H8.5V6Z" fill="#6B7280"/>
                </svg>
                <span>Your password is encrypted and stored securely. Never share your password with anyone.</span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
