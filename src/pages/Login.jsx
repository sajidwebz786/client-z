import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGoogle, FaArrowRight } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recaptchaChecked, setRecaptchaChecked] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!recaptchaChecked) {
      toast.error('Please verify that you are human');
      return;
    }
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      navigate('/');
    }
  };

  const handleGoogleLogin = () => {
    toast.info('Google OAuth coming soon');
  };

  return (
    <>
      <Navbar />
      <ToastContainer position="top-right" theme="dark" />
      <div style={styles.page}>
        <div style={styles.bgOrb1}></div>
        <div style={styles.bgOrb2}></div>
        <div style={styles.card}>
          <div style={styles.header}>
            <h1 style={styles.title}>Welcome Back</h1>
            <p style={styles.subtitle}>Sign in to continue your learning journey</p>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <FaEnvelope style={styles.inputIcon} />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <FaLock style={styles.inputIcon} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={styles.input}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.toggleBtn}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <div
              style={{
                ...styles.recaptcha,
                borderColor: recaptchaChecked ? 'var(--green-500)' : 'rgba(255,255,255,0.1)',
              }}
              onClick={() => setRecaptchaChecked(!recaptchaChecked)}
            >
              <div
                style={{
                  ...styles.recaptchaCheckbox,
                  background: recaptchaChecked ? 'var(--green-500)' : 'transparent',
                  borderColor: recaptchaChecked ? 'var(--green-500)' : 'var(--text-muted)',
                }}
              >
                {recaptchaChecked && <span style={styles.recaptchaCheck}>&#10003;</span>}
              </div>
              <span style={styles.recaptchaLabel}>Verify you are human</span>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
              style={styles.submitBtn}
            >
              {loading ? (
                <>
                  <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div>
                  Signing In...
                </>
              ) : (
                <>
                  Sign In <FaArrowRight />
                </>
              )}
            </button>
          </form>

          <div style={styles.divider}>
            <div style={styles.dividerLine}></div>
            <span style={styles.dividerText}>or continue with</span>
            <div style={styles.dividerLine}></div>
          </div>

          <button onClick={handleGoogleLogin} style={styles.googleBtn}>
            <FaGoogle style={{ color: '#DB4437' }} />
            Sign in with Google
          </button>

          <p style={styles.footerText}>
            Don&apos;t have an account?{' '}
            <Link to="/register" style={styles.link}>Sign Up</Link>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #0a1628 0%, #0d2b5e 50%, #0a1628 100%)',
    position: 'relative',
    overflow: 'hidden',
    padding: '120px 24px 60px',
  },
  bgOrb1: {
    position: 'absolute',
    top: '-120px',
    right: '-120px',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'var(--blue-700)',
    filter: 'blur(100px)',
    opacity: 0.2,
  },
  bgOrb2: {
    position: 'absolute',
    bottom: '-100px',
    left: '-100px',
    width: '350px',
    height: '350px',
    borderRadius: '50%',
    background: 'var(--green-700)',
    filter: 'blur(100px)',
    opacity: 0.15,
  },
  card: {
    position: 'relative',
    zIndex: 2,
    width: '100%',
    maxWidth: '440px',
    background: 'var(--gradient-card)',
    borderRadius: 'var(--radius-xl)',
    border: '1px solid rgba(255,255,255,0.08)',
    padding: '40px',
    boxShadow: 'var(--shadow-lg)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  title: {
    fontSize: '1.75rem',
    marginBottom: '8px',
    background: 'var(--gradient-primary)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  subtitle: {
    color: 'var(--text-muted)',
    fontSize: '0.95rem',
    margin: 0,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  inputGroup: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '16px',
    color: 'var(--text-muted)',
    fontSize: '0.95rem',
    pointerEvents: 'none',
  },
  input: {
    width: '100%',
    padding: '14px 16px 14px 44px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--text-primary)',
    fontSize: '0.95rem',
    fontFamily: 'var(--font-secondary)',
    outline: 'none',
    transition: 'var(--transition)',
  },
  toggleBtn: {
    position: 'absolute',
    right: '12px',
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    fontSize: '0.95rem',
  },
  recaptcha: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 'var(--radius-md)',
    cursor: 'pointer',
    transition: 'var(--transition)',
    userSelect: 'none',
  },
  recaptchaCheckbox: {
    width: '22px',
    height: '22px',
    borderRadius: '4px',
    border: '2px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'var(--transition)',
  },
  recaptchaCheck: {
    color: '#fff',
    fontSize: '14px',
    fontWeight: 700,
    lineHeight: 1,
  },
  recaptchaLabel: {
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
  },
  submitBtn: {
    width: '100%',
    marginTop: '4px',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    margin: '24px 0',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    background: 'rgba(255,255,255,0.1)',
  },
  dividerText: {
    color: 'var(--text-muted)',
    fontSize: '0.85rem',
    whiteSpace: 'nowrap',
  },
  googleBtn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    padding: '14px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 'var(--radius-full)',
    color: 'var(--text-primary)',
    fontSize: '0.95rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'var(--transition)',
    fontFamily: 'var(--font-primary)',
  },
  footerText: {
    textAlign: 'center',
    marginTop: '24px',
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
  },
  link: {
    color: 'var(--blue-400)',
    fontWeight: 600,
    textDecoration: 'none',
  },
};

export default Login;
