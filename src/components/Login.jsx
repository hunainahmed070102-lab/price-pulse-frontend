import { useState } from 'react';
import { Lock, Mail, Eye, EyeOff, AlertCircle, GraduationCap } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://192.168.1.101:5000/api';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });

      if (response.data.success) {
        // Store token securely
        localStorage.setItem('adminToken', response.data.data.token);
        localStorage.setItem('adminEmail', response.data.data.admin.email);
        onLogin();
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #6B0EFF 0%, #8A4FFF 100%)',
      padding: '20px',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 9999
    },
    card: {
      background: 'white',
      borderRadius: '20px',
      padding: '32px',
      width: '100%',
      maxWidth: '400px',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
    },
    header: {
      textAlign: 'center',
      marginBottom: '28px'
    },
    logoIcon: {
      width: '90px',
      height: '90px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 20px'
    },
    logoImg: {
      width: '100%',
      height: '100%',
      objectFit: 'contain'
    },
    h1: {
      fontSize: '32px',
      fontWeight: 900,
      color: '#1A1A1A',
      margin: '0 0 8px 0',
      letterSpacing: '-0.5px'
    },
    p: {
      fontSize: '16px',
      color: '#666666',
      margin: 0
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    },
    error: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '14px 16px',
      background: '#FFF5F5',
      border: '2px solid #FFE5E5',
      borderRadius: '12px',
      color: '#FF4B4B',
      fontSize: '14px',
      fontWeight: 600
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    },
    label: {
      fontSize: '13px',
      fontWeight: 700,
      color: '#1A1A1A',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    inputContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '14px 16px',
      background: '#F8F9FA',
      border: '2px solid #EBEBEB',
      borderRadius: '12px',
      transition: 'all 0.3s ease'
    },
    input: {
      flex: 1,
      border: 'none',
      background: 'transparent',
      fontSize: '15px',
      color: '#1A1A1A',
      outline: 'none',
      fontWeight: 500
    },
    toggleBtn: {
      background: 'none',
      border: 'none',
      padding: 0,
      cursor: 'pointer',
      color: '#666666',
      display: 'flex',
      alignItems: 'center'
    },
    submitBtn: {
      width: '100%',
      padding: '16px 24px',
      background: 'linear-gradient(135deg, #6B0EFF 0%, #8A4FFF 100%)',
      border: 'none',
      borderRadius: '12px',
      color: 'white',
      fontSize: '16px',
      fontWeight: 700,
      cursor: loading ? 'not-allowed' : 'pointer',
      boxShadow: '0 4px 16px rgba(107, 14, 255, 0.3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      marginTop: '8px',
      opacity: loading ? 0.7 : 1
    },
    spinner: {
      width: '20px',
      height: '20px',
      border: '3px solid rgba(255, 255, 255, 0.3)',
      borderTopColor: 'white',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite'
    },
    footer: {
      marginTop: '32px',
      textAlign: 'center',
      paddingTop: '24px',
      borderTop: '2px solid #F0F0F0'
    },
    footerText: {
      fontSize: '13px',
      color: isHovered ? '#6B0EFF' : '#999999',
      margin: 0,
      fontWeight: 400,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      cursor: 'pointer',
      transition: 'color 0.3s ease'
    }
  };

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes logoBounce {
          0% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0); }
        }
        @keyframes logoPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logoIcon}>
            <img src="/logo.png" alt="Logo" style={styles.logoImg} />
          </div>
          <h1 style={styles.h1}>Admin Portal</h1>
          <p style={styles.p}>Kotli District Administration</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {error && (
            <div style={styles.error}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <div style={styles.formGroup}>
            <label style={styles.label}>Email Address</label>
            <div style={styles.inputContainer}>
              <Mail size={20} color="#666666" />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.inputContainer}>
              <Lock size={20} color="#666666" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                style={styles.input}
              />
              <button
                type="button"
                style={styles.toggleBtn}
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button type="submit" style={styles.submitBtn} disabled={loading}>
            {loading ? (
              <>
                <span style={styles.spinner}></span>
                Signing In...
              </>
            ) : (
              'Sign In to Dashboard'
            )}
          </button>
        </form>

        <div style={styles.footer}>
          <p 
            style={styles.footerText}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <GraduationCap size={16} />
            FINAL YEAR PROJECT BY STUDENTS OF UOK
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
