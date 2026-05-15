import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaBook,
  FaUsers,
  FaEnvelope,
  FaCreditCard,
  FaUserGraduate,
  FaCog,
  FaSignOutAlt,
  FaExternalLinkAlt,
  FaSearch,
  FaQuoteRight,
  FaQuestionCircle,
  FaLayerGroup,
  FaChartBar,
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import Logo from '../../components/Logo';
import { toast } from 'react-toastify';

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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  title: {
    fontSize: '1.6rem',
    fontWeight: 700,
    fontFamily: 'var(--font-primary)',
  },
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    maxWidth: 400,
    padding: '10px 16px',
    paddingLeft: 40,
    background: 'rgba(0,0,0,0.3)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 'var(--radius-full)',
    color: 'var(--text-primary)',
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'var(--transition)',
  },
  searchIcon: {
    position: 'absolute',
    left: 14,
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
  },
  searchWrapper: {
    position: 'relative',
    flex: 1,
    maxWidth: 400,
  },
  adminCard: {
    background: 'var(--bg-card)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid rgba(255,255,255,0.06)',
    padding: 24,
    marginBottom: 24,
  },
  tableContainer: {
    overflowX: 'auto',
  },
  badge: (type) => {
    const colors = {
      success: { bg: 'rgba(0,200,83,0.15)', color: '#00e676' },
      warning: { bg: 'rgba(255,193,7,0.15)', color: '#ffd54f' },
      danger: { bg: 'rgba(239,83,80,0.15)', color: '#ef5350' },
      info: { bg: 'rgba(66,165,245,0.15)', color: '#42a5f5' },
    };
    const c = colors[type] || colors.info;
    return {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '3px 10px',
      borderRadius: 'var(--radius-full)',
      fontSize: '0.72rem',
      fontWeight: 600,
      background: c.bg,
      color: c.color,
    };
  },
  emptyState: {
    textAlign: 'center',
    padding: '48px 16px',
    color: 'var(--text-muted)',
    fontSize: '0.95rem',
  },
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
  progressBar: {
    width: 100,
    height: 6,
    borderRadius: 3,
    background: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  progressFill: (pct) => ({
    height: '100%',
    width: `${pct}%`,
    borderRadius: 3,
    background: pct >= 100 ? '#00e676' : 'var(--blue-400)',
    transition: 'width 0.3s ease',
  }),
};

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export default function EnrollmentsManager() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const res = await api.get('/admin/enrollments');
      setEnrollments(res.data.enrollments || res.data || []);
    } catch {
      toast.error('Failed to load enrollments');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const filteredEnrollments = enrollments.filter((enrollment) => {
    const term = searchTerm.toLowerCase();
    return (
      enrollment.user?.name?.toLowerCase().includes(term) ||
      enrollment.userName?.toLowerCase().includes(term) ||
      enrollment.course?.title?.toLowerCase().includes(term) ||
      enrollment.courseName?.toLowerCase().includes(term)
    );
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'active':
        return 'info';
      case 'dropped':
        return 'danger';
      default:
        return 'warning';
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingScreen}>
        <div style={styles.spinner}></div>
        <p style={{ color: 'var(--text-muted)' }}>Loading enrollments...</p>
      </div>
    );
  }

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
          <h1 style={styles.title}>Enrollments</h1>
        </div>

        <div style={styles.searchContainer}>
          <div style={styles.searchWrapper}>
            <FaSearch style={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search by student name or course..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
          </div>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
            {filteredEnrollments.length} enrollment{filteredEnrollments.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div style={styles.adminCard}>
          <div style={styles.tableContainer}>
            {filteredEnrollments.length > 0 ? (
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Student Name</th>
                    <th>Email</th>
                    <th>Course Title</th>
                    <th>Enrolled At</th>
                    <th>Progress</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEnrollments.map((enrollment) => {
                    const progress = enrollment.progress ?? 0;
                    return (
                      <tr key={enrollment._id}>
                        <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {enrollment._id?.slice(-8) || '-'}
                        </td>
                        <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                          {enrollment.user?.name || enrollment.userName || 'N/A'}
                        </td>
                        <td>{enrollment.user?.email || enrollment.userEmail || '-'}</td>
                        <td>{enrollment.course?.title || enrollment.courseName || 'N/A'}</td>
                        <td>{formatDate(enrollment.createdAt)}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={styles.progressBar}>
                              <div style={styles.progressFill(progress)}></div>
                            </div>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                              {progress}%
                            </span>
                          </div>
                        </td>
                        <td>
                          <span style={styles.badge(getStatusBadge(enrollment.status))}>
                            {enrollment.status || 'Active'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div style={styles.emptyState}>
                {searchTerm ? 'No enrollments match your search' : 'No enrollments found'}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
