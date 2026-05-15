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
  FaEye,
  FaTrash,
  FaCheckCircle,
  FaTimes,
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
  actionBtn: (bg) => ({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    borderRadius: 'var(--radius-sm)',
    border: 'none',
    background: bg,
    color: '#fff',
    cursor: 'pointer',
    transition: 'var(--transition)',
    fontSize: '0.8rem',
  }),
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
  modal: {
    background: 'var(--bg-secondary)',
    borderRadius: 'var(--radius-xl)',
    border: '1px solid rgba(255,255,255,0.1)',
    maxWidth: 600,
    width: '95%',
    maxHeight: '92vh',
    overflowY: 'auto',
    padding: 32,
    animation: 'fadeInUp 0.3s ease',
  },
  unreadRow: {
    background: 'rgba(25,118,210,0.06)',
  },
  deleteConfirmOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.7)',
    backdropFilter: 'blur(8px)',
    zIndex: 1100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    animation: 'fadeIn 0.2s ease',
  },
  deleteConfirmBox: {
    background: 'var(--bg-secondary)',
    borderRadius: 'var(--radius-xl)',
    border: '1px solid rgba(255,255,255,0.1)',
    maxWidth: 440,
    width: '90%',
    padding: 32,
    animation: 'fadeInUp 0.3s ease',
    textAlign: 'center',
  },
};

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const truncate = (str, len = 50) => {
  if (!str) return '-';
  return str.length > len ? str.substring(0, len) + '...' : str;
};

export default function MessagesManager() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMessage, setViewMessage] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await api.get('/admin/messages');
      setMessages(res.data.messages || res.data || []);
    } catch {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`/admin/messages/${id}/read`);
      toast.success('Message marked as read');
      fetchMessages();
    } catch {
      toast.error('Failed to mark as read');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/admin/messages/${deleteTarget._id}`);
      toast.success('Message deleted');
      setDeleteTarget(null);
      fetchMessages();
    } catch {
      toast.error('Failed to delete message');
    } finally {
      setDeleting(false);
    }
  };

  const handleViewMessage = (msg) => {
    setViewMessage(msg);
    if (!msg.isRead) {
      handleMarkAsRead(msg._id);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const filteredMessages = messages.filter((msg) => {
    const term = searchTerm.toLowerCase();
    return (
      msg.name?.toLowerCase().includes(term) ||
      msg.email?.toLowerCase().includes(term) ||
      msg.subject?.toLowerCase().includes(term)
    );
  });

  if (loading) {
    return (
      <div style={styles.loadingScreen}>
        <div style={styles.spinner}></div>
        <p style={{ color: 'var(--text-muted)' }}>Loading messages...</p>
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
          <h1 style={styles.title}>Messages</h1>
        </div>

        <div style={styles.searchContainer}>
          <div style={styles.searchWrapper}>
            <FaSearch style={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search by name, email, or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
          </div>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
            {filteredMessages.length} message{filteredMessages.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div style={styles.adminCard}>
          <div style={styles.tableContainer}>
            {filteredMessages.length > 0 ? (
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Subject</th>
                    <th>Message</th>
                    <th>Read</th>
                    <th>Created At</th>
                    <th style={{ width: 100 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMessages.map((msg) => (
                    <tr
                      key={msg._id}
                      style={!msg.isRead ? styles.unreadRow : {}}
                    >
                      <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        {msg.name || 'N/A'}
                      </td>
                      <td>{msg.email || '-'}</td>
                      <td>{msg.subject || '-'}</td>
                      <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {truncate(msg.message, 50)}
                      </td>
                      <td>
                        {msg.isRead ? (
                          <FaCheckCircle style={{ color: '#00e676' }} />
                        ) : (
                          <span style={styles.badge('warning')}>Unread</span>
                        )}
                      </td>
                      <td>{formatDate(msg.createdAt)}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button
                            style={styles.actionBtn('rgba(25,118,210,0.3)')}
                            onClick={() => handleViewMessage(msg)}
                            title="View"
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'rgba(25,118,210,0.6)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'rgba(25,118,210,0.3)';
                            }}
                          >
                            <FaEye />
                          </button>
                          <button
                            style={styles.actionBtn('rgba(211,47,47,0.3)')}
                            onClick={() => setDeleteTarget(msg)}
                            title="Delete"
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'rgba(211,47,47,0.6)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'rgba(211,47,47,0.3)';
                            }}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={styles.emptyState}>
                {searchTerm ? 'No messages match your search' : 'No messages found'}
              </div>
            )}
          </div>
        </div>
      </main>

      {viewMessage && (
        <div className="modal-overlay" onClick={() => setViewMessage(null)}>
          <div className="modal" style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Message Details</h3>
              <button className="modal-close" onClick={() => setViewMessage(null)}>
                <FaTimes />
              </button>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4 }}>Name</div>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{viewMessage.name}</div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4 }}>Email</div>
              <div>{viewMessage.email}</div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4 }}>Subject</div>
              <div>{viewMessage.subject || '-'}</div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4 }}>Message</div>
              <div style={{
                padding: 16,
                background: 'rgba(0,0,0,0.2)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-secondary)',
                fontSize: '0.9rem',
                lineHeight: 1.6,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}>
                {viewMessage.message}
              </div>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Received: {formatDate(viewMessage.createdAt)}
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div style={styles.deleteConfirmOverlay} onClick={() => setDeleteTarget(null)}>
          <div style={styles.deleteConfirmBox} onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: 'rgba(211,47,47,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <FaTrash style={{ color: '#ef5350', fontSize: '1.3rem' }} />
            </div>
            <h3 style={{ marginBottom: 8, fontFamily: 'var(--font-primary)' }}>Delete Message</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: 24, fontSize: '0.9rem' }}>
              Are you sure you want to delete the message from "{deleteTarget.name}"? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button
                onClick={() => setDeleteTarget(null)}
                style={{
                  padding: '10px 24px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'transparent',
                  color: 'var(--text-secondary)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                style={{
                  padding: '10px 24px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  background: '#d32f2f',
                  color: '#fff',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                  opacity: deleting ? 0.6 : 1,
                }}
              >
                {deleting ? 'Deleting...' : 'Delete Message'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
