import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaBook,
  FaUsers,
  FaChartLine,
  FaEnvelope,
  FaCreditCard,
  FaUserGraduate,
  FaCog,
  FaSignOutAlt,
  FaExternalLinkAlt,
  FaPlus,
  FaEye,
  FaQuoteRight,
  FaQuestionCircle,
  FaLayerGroup,
  FaChartBar,
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import Logo from '../../components/Logo';

const sidebarLinks = [
  { label: 'Dashboard', icon: FaTachometerAlt, to: '/admin' },
  { label: 'Courses', icon: FaBook, to: '/admin/courses' },
  { label: 'Categories', icon: FaLayerGroup, to: '/admin/categories' },
  { label: 'Testimonials', icon: FaQuoteRight, to: '/admin/testimonials' },
  { label: 'FAQs', icon: FaQuestionCircle, to: '/admin/faqs' },
  { label: 'Stats', icon: FaChartBar, to: '/admin/stats' },
  { label: 'Users', icon: FaUsers, to: '/admin/users' },
  { label: 'Enrollments', icon: FaUserGraduate, to: '/admin/enrollments' },
  { label: 'Payments', icon: FaCreditCard, to: '/admin/payments' },
  { label: 'Messages', icon: FaEnvelope, to: '/admin/messages' },
  { label: 'Settings', icon: FaCog, to: '/admin/settings' },
];

const statCards = [
  { key: 'totalUsers', label: 'Total Users', icon: FaUsers, color: '#42a5f5', glow: 'rgba(66,165,245,0.25)' },
  { key: 'totalCourses', label: 'Total Courses', icon: FaBook, color: '#00e676', glow: 'rgba(0,230,118,0.25)' },
  { key: 'totalEnrollments', label: 'Total Enrollments', icon: FaUserGraduate, color: '#ffa726', glow: 'rgba(255,167,38,0.25)' },
  { key: 'totalRevenue', label: 'Total Revenue', icon: FaChartLine, color: '#ab47bc', glow: 'rgba(171,71,188,0.25)' },
  { key: 'unreadMessages', label: 'Unread Messages', icon: FaEnvelope, color: '#ef5350', glow: 'rgba(239,83,80,0.25)' },
];

const styles = {
  layout: {
    display: 'flex',
    minHeight: '100vh',
  },
  sidebar: {
    width: 260,
    background: 'var(--bg-secondary)',
    borderRight: '1px solid rgba(255,255,255,0.06)',
    padding: '24px 0',
    position: 'fixed',
    height: '100vh',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  sidebarBrand: {
    padding: '0 24px 24px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    marginBottom: 16,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    textDecoration: 'none',
  },
  sidebarLinks: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    padding: '0 12px',
  },
  navItem: (isActive) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '11px 16px',
    color: isActive ? 'var(--blue-400)' : 'var(--text-muted)',
    background: isActive ? 'rgba(25,118,210,0.1)' : 'transparent',
    borderRadius: 'var(--radius-md)',
    transition: 'var(--transition)',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: 500,
    textDecoration: 'none',
    border: 'none',
    width: '100%',
    textAlign: 'left',
  }),
  sidebarFooter: {
    padding: '16px 12px',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  main: {
    flex: 1,
    marginLeft: 260,
    padding: '32px',
    minHeight: '100vh',
  },
  header: {
    marginBottom: 32,
  },
  welcomeTitle: {
    fontSize: '1.8rem',
    fontWeight: 700,
    fontFamily: 'var(--font-primary)',
    marginBottom: 4,
  },
  welcomeDate: {
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 20,
    marginBottom: 32,
  },
  statCard: (color, glow) => ({
    background: 'var(--gradient-card)',
    borderRadius: 'var(--radius-lg)',
    padding: 24,
    border: '1px solid rgba(255,255,255,0.06)',
    transition: 'var(--transition)',
    position: 'relative',
    overflow: 'hidden',
    cursor: 'default',
  }),
  statIcon: (color, glow) => ({
    width: 48,
    height: 48,
    borderRadius: 'var(--radius-md)',
    background: `${color}15`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: color,
    fontSize: '1.3rem',
    marginBottom: 16,
    boxShadow: `0 0 20px ${glow}`,
  }),
  statValue: {
    fontSize: '2rem',
    fontWeight: 800,
    fontFamily: 'var(--font-primary)',
    color: 'var(--text-primary)',
    marginBottom: 4,
  },
  statLabel: {
    color: 'var(--text-muted)',
    fontSize: '0.85rem',
    fontWeight: 500,
  },
  statGlow: (color) => ({
    position: 'absolute',
    top: -30,
    right: -30,
    width: 100,
    height: 100,
    borderRadius: '50%',
    background: color,
    opacity: 0.08,
    filter: 'blur(40px)',
  }),
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: '1.1rem',
    fontWeight: 700,
    fontFamily: 'var(--font-primary)',
    color: 'var(--text-primary)',
    margin: 0,
  },
  adminCard: {
    background: 'var(--bg-card)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid rgba(255,255,255,0.06)',
    padding: 24,
    marginBottom: 28,
  },
  tableContainer: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    padding: '12px 16px',
    textAlign: 'left',
    fontWeight: 600,
    color: 'var(--text-muted)',
    fontSize: '0.8rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  td: {
    padding: '12px 16px',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
    color: 'var(--text-secondary)',
    fontSize: '0.9rem',
  },
  quickActions: {
    display: 'flex',
    gap: 16,
    flexWrap: 'wrap',
  },
  actionBtn: (bg) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '12px 24px',
    borderRadius: 'var(--radius-full)',
    fontWeight: 600,
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'var(--transition)',
    border: 'none',
    textDecoration: 'none',
    color: '#fff',
    background: bg,
  }),
  loadingScreen: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '80vh',
    flexDirection: 'column',
    gap: 16,
  },
  spinner: {
    width: 44,
    height: 44,
    border: '3px solid rgba(255,255,255,0.1)',
    borderTopColor: 'var(--blue-400)',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  emptyState: {
    textAlign: 'center',
    padding: '32px 16px',
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
  },
  badge: (type) => {
    const colors = {
      success: { bg: 'rgba(0,200,83,0.15)', color: '#00e676' },
      pending: { bg: 'rgba(255,193,7,0.15)', color: '#ffd54f' },
      failed: { bg: 'rgba(239,83,80,0.15)', color: '#ef5350' },
    };
    const c = colors[type] || colors.success;
    return {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '3px 10px',
      borderRadius: 'var(--radius-full)',
      fontSize: '0.75rem',
      fontWeight: 600,
      background: c.bg,
      color: c.color,
    };
  },
  rowsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 24,
  },
};

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const formatCurrency = (amount) => {
  return `₹${Number(amount || 0).toLocaleString('en-IN')}`;
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({});
  const [enrollments, setEnrollments] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, enrollmentsRes, paymentsRes] = await Promise.all([
          api.get('/admin/dashboard'),
          api.get('/admin/enrollments', { params: { limit: 5 } }),
          api.get('/admin/payments', { params: { limit: 5 } }),
        ]);
        setStats(statsRes.data);
        setEnrollments(enrollmentsRes.data.enrollments || enrollmentsRes.data || []);
        setPayments(paymentsRes.data.payments || paymentsRes.data || []);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div style={styles.loadingScreen}>
        <div style={styles.spinner}></div>
        <p style={{ color: 'var(--text-muted)' }}>Loading dashboard...</p>
      </div>
    );
  }

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="admin-layout" style={styles.layout}>
      <aside className="admin-sidebar" style={styles.sidebar}>
        <div>
          <Link to="/admin" style={styles.sidebarBrand}>
            <Logo />
          </Link>

          <nav style={styles.sidebarLinks}>
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const isActive = window.location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  style={styles.navItem(isActive)}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'rgba(25,118,210,0.08)';
                      e.currentTarget.style.color = 'var(--blue-400)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'var(--text-muted)';
                    }
                  }}
                >
                  <Icon />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div style={styles.sidebarFooter}>
          <Link
            to="/"
            style={styles.navItem(false)}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(25,118,210,0.08)';
              e.currentTarget.style.color = 'var(--blue-400)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--text-muted)';
            }}
          >
            <FaExternalLinkAlt />
            Back to Website
          </Link>
          <button
            onClick={handleLogout}
            style={styles.navItem(false)}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(239,83,80,0.1)';
              e.currentTarget.style.color = '#ef5350';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--text-muted)';
            }}
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </aside>

      <main style={styles.main}>
        <div style={styles.header}>
          <h1 style={styles.welcomeTitle}>
            Welcome back, <span className="gradient-text">{user?.name || 'Admin'}</span>
          </h1>
          <p style={styles.welcomeDate}>{today}</p>
        </div>

        <div style={styles.statsGrid}>
          {statCards.map((card) => {
            const Icon = card.icon;
            const value = stats[card.key];
            return (
              <div
                key={card.key}
                className="card"
                style={styles.statCard(card.color, card.glow)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = card.color + '40';
                  e.currentTarget.style.boxShadow = `0 8px 30px ${card.glow}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={styles.statGlow(card.color)}></div>
                <div style={styles.statIcon(card.color, card.glow)}>
                  <Icon />
                </div>
                <div style={styles.statValue}>
                  {card.key === 'totalRevenue' ? formatCurrency(value) : (value ?? 0)}
                </div>
                <div style={styles.statLabel}>{card.label}</div>
              </div>
            );
          })}
        </div>

        <div style={styles.quickActions}>
          <Link
            to="/admin/courses/new"
            style={styles.actionBtn('var(--gradient-primary)')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 25px rgba(25,118,210,0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <FaPlus />
            Add Course
          </Link>
          <Link
            to="/admin/messages"
            style={styles.actionBtn('linear-gradient(135deg, #ab47bc 0%, #7b1fa2 100%)')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 25px rgba(171,71,188,0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <FaEye />
            View Messages
          </Link>
        </div>

        <div style={{ ...styles.rowsGrid, marginTop: 28 }}>
          <div style={styles.adminCard}>
            <div style={styles.sectionHeader}>
              <h3 style={styles.sectionTitle}>Recent Enrollments</h3>
              <Link
                to="/admin/enrollments"
                style={{ color: 'var(--blue-400)', fontSize: '0.85rem', fontWeight: 500, textDecoration: 'none' }}
              >
                View All
              </Link>
            </div>
            <div style={styles.tableContainer}>
              {enrollments.length > 0 ? (
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>User</th>
                      <th style={styles.th}>Course</th>
                      <th style={styles.th}>Date</th>
                      <th style={styles.th}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enrollments.map((enrollment, index) => (
                      <tr key={enrollment._id || index}>
                        <td style={styles.td}>{enrollment.user?.name || enrollment.userName || 'N/A'}</td>
                        <td style={styles.td}>{enrollment.course?.title || enrollment.courseName || 'N/A'}</td>
                        <td style={styles.td}>{formatDate(enrollment.createdAt)}</td>
                        <td style={styles.td}>
                          <span style={styles.badge(enrollment.status === 'active' ? 'success' : 'pending')}>
                            {enrollment.status || 'Active'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div style={styles.emptyState}>No enrollments yet</div>
              )}
            </div>
          </div>

          <div style={styles.adminCard}>
            <div style={styles.sectionHeader}>
              <h3 style={styles.sectionTitle}>Recent Payments</h3>
              <Link
                to="/admin/payments"
                style={{ color: 'var(--blue-400)', fontSize: '0.85rem', fontWeight: 500, textDecoration: 'none' }}
              >
                View All
              </Link>
            </div>
            <div style={styles.tableContainer}>
              {payments.length > 0 ? (
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>User</th>
                      <th style={styles.th}>Amount</th>
                      <th style={styles.th}>Date</th>
                      <th style={styles.th}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment, index) => (
                      <tr key={payment._id || index}>
                        <td style={styles.td}>{payment.user?.name || payment.userName || 'N/A'}</td>
                        <td style={{ ...styles.td, color: 'var(--green-400)', fontWeight: 600 }}>
                          {formatCurrency(payment.amount)}
                        </td>
                        <td style={styles.td}>{formatDate(payment.createdAt)}</td>
                        <td style={styles.td}>
                          <span style={styles.badge(payment.status === 'completed' ? 'success' : payment.status === 'failed' ? 'failed' : 'pending')}>
                            {payment.status || 'Pending'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div style={styles.emptyState}>No payments yet</div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
