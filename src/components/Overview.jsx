import { useState, useEffect } from 'react';
import { Package, ClipboardList, Clock, CheckCircle, RefreshCw, Plus, FileCheck, BarChart3, Bell, BellRing, TrendingUp } from 'lucide-react';
import { productAPI, complaintAPI } from '../services/api';
import './Overview.css';

const Overview = ({ onNavigate }) => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalComplaints: 0,
    pendingComplaints: 0,
    resolvedComplaints: 0
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastComplaintCount, setLastComplaintCount] = useState(0);
  const [productDistribution, setProductDistribution] = useState([]);
  const [complaintsData, setComplaintsData] = useState({
    today: 0,
    last7Days: 0,
    lastMonth: 0
  });
  const [hoveredSegment, setHoveredSegment] = useState(null);

  // Sync unread count whenever notifications change
  useEffect(() => {
    const unread = notifications.filter(n => !n.read).length;
    setUnreadCount(unread);
  }, [notifications]);

  useEffect(() => {
    loadStoredNotifications();
    fetchStats();
    
    // Poll for new complaints every 5 seconds
    const pollInterval = setInterval(() => {
      fetchStats(true);
    }, 5000);

    // Update time every second
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Close notification dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (showNotifications && !event.target.closest('.notification-wrapper')) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      clearInterval(pollInterval);
      clearInterval(timeInterval);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  const loadStoredNotifications = () => {
    const stored = localStorage.getItem('adminNotifications');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const notifs = parsed.map(n => ({
          ...n,
          time: new Date(n.time)
        }));
        setNotifications(notifs);
        
        // Count unread notifications
        const unread = notifs.filter(n => !n.read).length;
        console.log('Loaded notifications. Unread count:', unread, 'Total:', notifs.length);
        setUnreadCount(unread);
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
    }
  };

  const saveNotifications = (notifs) => {
    localStorage.setItem('adminNotifications', JSON.stringify(notifs));
  };

  const fetchStats = async (isPolling = false, isRefreshing = false) => {
    try {
      if (!isPolling && !isRefreshing) setLoading(true);
      if (isRefreshing) setRefreshing(true);
      
      const [productsRes, complaintsRes] = await Promise.all([
        productAPI.getAll(),
        complaintAPI.getAll()
      ]);

      console.log('API Responses:', { productsRes: productsRes.data, complaintsRes: complaintsRes.data });

      // Access data correctly from axios response
      const products = productsRes.data.data || productsRes.data || [];
      const complaints = complaintsRes.data.data || complaintsRes.data || [];
      
      const newComplaintCount = complaints.length;
      
      // Check for new complaints
      if (isPolling && lastComplaintCount > 0 && newComplaintCount > lastComplaintCount) {
        const newComplaints = complaints.slice(0, newComplaintCount - lastComplaintCount);
        newComplaints.forEach(complaint => {
          addNotification({
            id: complaint._id,
            title: 'New Complaint Received',
            message: `${complaint.customerName} reported an issue with ${complaint.productName}`,
            time: new Date(),
            type: 'complaint',
            icon: 'complaint'
          });
        });
        
        // Play notification sound (optional)
        playNotificationSound();
      }
      
      // Set initial complaint count on first load
      if (!isPolling && lastComplaintCount === 0) {
        setLastComplaintCount(newComplaintCount);
      } else if (isPolling) {
        setLastComplaintCount(newComplaintCount);
      }
      
      // Generate recent activity from complaints (last 10)
      const recentComplaints = [...complaints]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10)
        .map(complaint => ({
          id: complaint._id,
          title: 'New Complaint',
          message: `${complaint.customerName} - ${complaint.productName}`,
          time: new Date(complaint.createdAt),
          type: 'complaint',
          icon: 'complaint',
          read: true // Mark initial complaints as read
        }));
      
      // Only set initial notifications if:
      // 1. No notifications in state
      // 2. Not polling
      // 3. No stored notifications in localStorage
      // 4. Notifications were not intentionally cleared
      const wasCleared = localStorage.getItem('notificationsCleared') === 'true';
      const hasStoredNotifications = localStorage.getItem('adminNotifications');
      
      if (notifications.length === 0 && !isPolling && !hasStoredNotifications && !wasCleared) {
        setNotifications(recentComplaints);
        saveNotifications(recentComplaints);
      }
      
      setStats({
        totalProducts: products.length,
        totalComplaints: complaints.length,
        pendingComplaints: complaints.filter(c => c.status === 'pending').length,
        resolvedComplaints: complaints.filter(c => c.status === 'resolved').length
      });

      // Calculate product distribution by category
      const distribution = {};
      products.forEach(product => {
        distribution[product.category] = (distribution[product.category] || 0) + 1;
      });
      
      const distributionArray = Object.entries(distribution).map(([category, count]) => ({
        category,
        count,
        percentage: ((count / products.length) * 100).toFixed(1)
      }));
      
      console.log('Product Distribution:', distributionArray);
      setProductDistribution(distributionArray);

      // Calculate complaints data for different time periods
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const last7DaysStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const lastMonthStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      setComplaintsData({
        today: complaints.filter(c => new Date(c.createdAt) >= todayStart).length,
        last7Days: complaints.filter(c => new Date(c.createdAt) >= last7DaysStart).length,
        lastMonth: complaints.filter(c => new Date(c.createdAt) >= lastMonthStart).length
      });
      
      console.log('Stats:', {
        totalProducts: products.length,
        totalComplaints: complaints.length,
        distribution: distributionArray
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      if (!isPolling && !isRefreshing) setLoading(false);
      if (isRefreshing) {
        // Keep spinning for at least 500ms for visual feedback
        setTimeout(() => setRefreshing(false), 500);
      }
    }
  };

  const addNotification = (notification) => {
    setNotifications(prev => {
      const updated = [{ ...notification, read: false }, ...prev].slice(0, 50); // Keep last 50 notifications
      saveNotifications(updated);
      // Clear the "cleared" flag since we have new notifications
      localStorage.removeItem('notificationsCleared');
      // Update unread count
      const newUnreadCount = updated.filter(n => !n.read).length;
      console.log('Adding notification. New unread count:', newUnreadCount);
      setUnreadCount(newUnreadCount);
      return updated;
    });
  };

  // Function to add activity from external components
  window.addAdminActivity = (activity) => {
    addNotification({
      id: Date.now().toString(),
      title: activity.title,
      message: activity.message,
      time: new Date(),
      type: activity.type || 'general',
      icon: activity.icon || 'general'
    });
  };

  const playNotificationSound = () => {
    // Create a simple beep sound
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const formatPakistanTime = () => {
    const timeString = currentTime.toLocaleString('en-PK', {
      timeZone: 'Asia/Karachi',
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
    // Replace lowercase am/pm with uppercase AM/PM
    return timeString.replace(/am/gi, 'AM').replace(/pm/gi, 'PM');
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    
    // Mark all notifications as read when opening dropdown
    if (!showNotifications) {
      console.log('Marking all notifications as read');
      setNotifications(prev => {
        const updated = prev.map(n => ({ ...n, read: true }));
        saveNotifications(updated);
        return updated;
      });
      setUnreadCount(0);
    }
  };

  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
    // Mark that notifications were cleared intentionally
    localStorage.setItem('adminNotifications', JSON.stringify([]));
    localStorage.setItem('notificationsCleared', 'true');
  };

  const getCategoryColor = (category, index) => {
    const colors = {
      fruit: '#6B0EFF',
      vegetable: '#8A4FFF',
      meat: '#6B21A8',
      grocery: '#581C87',
      dairy: '#A855F7',
      tailor: '#C084FC',
      'street food': '#9333EA',
      barber: '#7C3AED'
    };
    const defaultColors = ['#6B0EFF', '#8A4FFF', '#6B21A8', '#581C87', '#A855F7', '#C084FC', '#9333EA', '#7C3AED'];
    return colors[category] || defaultColors[index % defaultColors.length];
  };

  const createPieChart = () => {
    if (productDistribution.length === 0) return null;

    let currentAngle = 0;
    const radius = 80;
    const centerX = 100;
    const centerY = 100;

    return productDistribution.map((item, index) => {
      const percentage = parseFloat(item.percentage);
      const angle = (percentage / 100) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;
      
      currentAngle = endAngle;

      const startRad = (startAngle - 90) * (Math.PI / 180);
      const endRad = (endAngle - 90) * (Math.PI / 180);

      const x1 = centerX + radius * Math.cos(startRad);
      const y1 = centerY + radius * Math.sin(startRad);
      const x2 = centerX + radius * Math.cos(endRad);
      const y2 = centerY + radius * Math.sin(endRad);

      const largeArc = angle > 180 ? 1 : 0;

      const pathData = [
        `M ${centerX} ${centerY}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
        'Z'
      ].join(' ');

      return (
        <path
          key={item.category}
          d={pathData}
          fill={getCategoryColor(item.category, index)}
          stroke="white"
          strokeWidth="2"
          style={{ cursor: 'pointer' }}
          onMouseEnter={() => setHoveredSegment(index)}
          onMouseLeave={() => setHoveredSegment(null)}
        />
      );
    });
  };

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      color: '#6B0EFF',
      bgColor: '#f5f0ff'
    },
    {
      title: 'Total Complaints',
      value: stats.totalComplaints,
      icon: ClipboardList,
      color: '#6B0EFF',
      bgColor: '#f5f0ff'
    },
    {
      title: 'Pending',
      value: stats.pendingComplaints,
      icon: Clock,
      color: '#6B0EFF',
      bgColor: '#f5f0ff'
    },
    {
      title: 'Resolved',
      value: stats.resolvedComplaints,
      icon: CheckCircle,
      color: '#6B0EFF',
      bgColor: '#f5f0ff'
    }
  ];

  return (
    <div className="overview-container">
      <div className="overview-header">
        <div className="overview-header-content">
          <div>
            <h2>Dashboard Overview</h2>
            <p>Welcome back! Here's what's happening today</p>
          </div>
        </div>
        <div className="header-actions">
          <div className="time-display">
            <Clock size={16} />
            <span>{formatPakistanTime()}</span>
          </div>
          
          <div className="notification-wrapper">
            <button 
              className={`notification-btn ${unreadCount > 0 ? 'has-notification' : ''}`}
              onClick={handleNotificationClick}
            >
              {unreadCount > 0 ? <BellRing size={20} /> : <Bell size={20} />}
              {unreadCount > 0 && (
                <span className="notification-badge">{unreadCount}</span>
              )}
            </button>
            
            {showNotifications && (
              <div className="notification-dropdown">
                <div className="notification-header">
                  <h4>Notifications</h4>
                  {notifications.length > 0 && (
                    <button className="clear-btn" onClick={clearNotifications}>
                      Clear all
                    </button>
                  )}
                </div>
                <div className="notification-list">
                  {notifications.length === 0 ? (
                    <div className="no-notifications">
                      <Bell size={32} />
                      <p>No notifications yet</p>
                    </div>
                  ) : (
                    notifications.map(notif => (
                      <div key={notif.id} className="notification-item">
                        <div className="notif-icon">
                          <ClipboardList size={20} />
                        </div>
                        <div className="notif-content">
                          <h5>{notif.title}</h5>
                          <p>{notif.message}</p>
                          <span className="notif-time">{getTimeAgo(notif.time)}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          
          <button className="refresh-btn" onClick={() => fetchStats(false, true)} disabled={refreshing}>
            <RefreshCw className={refreshing ? 'spinning' : ''} size={20} />
            Refresh
          </button>
        </div>
      </div>

      <div className="stats-grid">
        {statCards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <div key={index} className="stat-card" style={{ '--card-color': card.color, '--card-bg': card.bgColor }}>
              <div className="stat-icon">
                <IconComponent size={32} strokeWidth={2.5} />
              </div>
              <div className="stat-content">
                <h3>{card.title}</h3>
                <p className="stat-value">{card.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="content-grid">
        <div className="quick-actions">
          <h3>Quick Actions</h3>
          <div className="actions-list">
            <div className="action-card" onClick={() => onNavigate && onNavigate('products')}>
              <div className="action-icon">
                <Plus size={24} strokeWidth={2.5} />
              </div>
              <div className="action-content">
                <h4>Add Product</h4>
                <p>Create a new product entry</p>
              </div>
            </div>
            
            <div className="action-card" onClick={() => onNavigate && onNavigate('complaints')}>
              <div className="action-icon">
                <FileCheck size={24} strokeWidth={2.5} />
              </div>
              <div className="action-content">
                <h4>Review Complaints</h4>
                <p>Check pending complaints</p>
              </div>
            </div>
            
            <div className="action-card" onClick={() => onNavigate && onNavigate('analytics')}>
              <div className="action-icon">
                <BarChart3 size={24} strokeWidth={2.5} />
              </div>
              <div className="action-content">
                <h4>View Analytics</h4>
                <p>Export data and reports</p>
              </div>
            </div>
          </div>
        </div>

        <div className="recent-activity">
          <h3>Recent Activity</h3>
          <div className="activity-list">
            {notifications.length === 0 ? (
              <div className="no-activity">
                <ClipboardList size={48} strokeWidth={1.5} />
                <p>No recent activity</p>
                <span>Activity will appear here</span>
              </div>
            ) : (
              notifications.slice(0, 5).map((notif, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-icon">
                    <ClipboardList size={20} />
                  </div>
                  <div className="activity-content">
                    <h5>{notif.title}</h5>
                    <p>{notif.message}</p>
                    <span className="activity-time">{getTimeAgo(notif.time)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="product-distribution">
        <h3>Product Distribution</h3>
        <div className="chart-container">
          {productDistribution.length > 0 ? (
            <>
              <div className="pie-chart">
                <svg viewBox="0 0 200 200" className="pie-svg">
                  {createPieChart()}
                </svg>
                <div className="chart-center">
                  {hoveredSegment !== null ? (
                    <>
                      <span className="center-value">{productDistribution[hoveredSegment].count}</span>
                      <span className="center-label">{productDistribution[hoveredSegment].category}</span>
                    </>
                  ) : (
                    <>
                      <span className="center-value">{stats.totalProducts}</span>
                      <span className="center-label">Products</span>
                    </>
                  )}
                </div>
              </div>
              <div className="chart-legend">
                {productDistribution.map((item, index) => (
                  <div 
                    key={item.category} 
                    className="legend-item"
                    onMouseEnter={() => setHoveredSegment(index)}
                    onMouseLeave={() => setHoveredSegment(null)}
                    style={{ cursor: 'pointer' }}
                  >
                    <span 
                      className="legend-color" 
                      style={{ backgroundColor: getCategoryColor(item.category, index) }}
                    ></span>
                    <span className="legend-label">{item.category}</span>
                    <span className="legend-value">{item.count} ({item.percentage}%)</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="no-data">
              <Package size={48} strokeWidth={1.5} />
              <p>No products yet</p>
              <span>Add products to see distribution</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Overview;
