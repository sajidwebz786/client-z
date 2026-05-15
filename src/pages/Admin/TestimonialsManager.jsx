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
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaTimes,
  FaSave,
  FaStar,
  FaCheck,
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

const initialFormData = {
  name: '',
  role: '',
  company: '',
  avatarUrl: '',
  rating: 5,
  content: '',
  isActive: true,
  displayOrder: '',
};

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
  addBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 24px',
    borderRadius: 'var(--radius-full)',
    fontWeight: 600,
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'var(--transition)',
    border: 'none',
    color: '#fff',
    background: 'var(--gradient-primary)',
    textDecoration: 'none',
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
      danger: { bg: 'rgba(239,83,80,0.15)', color: '#ef5350' },
    };
    const c = colors[type] || colors.success;
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
  modalWide: {
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
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 16,
  },
  formGroup: {
    marginBottom: 18,
  },
  formLabel: {
    display: 'block',
    marginBottom: 6,
    fontWeight: 500,
    color: 'var(--text-secondary)',
    fontSize: '0.85rem',
  },
  formControl: {
    width: '100%',
    padding: '10px 14px',
    background: 'rgba(0,0,0,0.3)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--text-primary)',
    fontSize: '0.9rem',
    transition: 'var(--transition)',
    fontFamily: 'var(--font-secondary)',
    outline: 'none',
  },
  checkboxRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 0',
  },
  checkboxLabel: {
    color: 'var(--text-secondary)',
    fontSize: '0.9rem',
    cursor: 'pointer',
    userSelect: 'none',
  },
  checkbox: {
    width: 18,
    height: 18,
    cursor: 'pointer',
    accentColor: 'var(--blue-400)',
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

export default function TestimonialsManager() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const res = await api.get('/admin/testimonials');
      setTestimonials(res.data.testimonials || res.data || []);
    } catch {
      toast.error('Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newVal = type === 'checkbox' ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: newVal }));
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormData(initialFormData);
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name || '',
      role: item.role || '',
      company: item.company || '',
      avatarUrl: item.avatarUrl || '',
      rating: item.rating ?? 5,
      content: item.content || '',
      isActive: item.isActive !== undefined ? item.isActive : true,
      displayOrder: item.displayOrder ?? '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...formData,
        rating: Number(formData.rating),
        displayOrder: formData.displayOrder !== '' ? Number(formData.displayOrder) : undefined,
      };
      if (editingItem) {
        await api.put(`/admin/testimonials/${editingItem._id}`, payload);
        toast.success('Testimonial updated successfully');
      } else {
        await api.post('/admin/testimonials', payload);
        toast.success('Testimonial created successfully');
      }
      setShowModal(false);
      fetchTestimonials();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save testimonial');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/admin/testimonials/${deleteTarget._id}`);
      toast.success('Testimonial deleted successfully');
      setDeleteTarget(null);
      fetchTestimonials();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete testimonial');
    } finally {
      setDeleting(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const filteredTestimonials = testimonials.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      item.name?.toLowerCase().includes(term) ||
      item.role?.toLowerCase().includes(term) ||
      item.company?.toLowerCase().includes(term) ||
      item.content?.toLowerCase().includes(term)
    );
  });

  if (loading) {
    return (
      <div style={styles.loadingScreen}>
        <div style={styles.spinner}></div>
        <p style={{ color: 'var(--text-muted)' }}>Loading testimonials...</p>
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
          <h1 style={styles.title}>Testimonial Management</h1>
          <button style={styles.addBtn} onClick={openAddModal}>
            <FaPlus /> Add Testimonial
          </button>
        </div>

        <div style={styles.searchContainer}>
          <div style={styles.searchWrapper}>
            <FaSearch style={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search testimonials by name, role, company, or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
          </div>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
            {filteredTestimonials.length} testimonial{filteredTestimonials.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div style={styles.adminCard}>
          <div style={styles.tableContainer}>
            {filteredTestimonials.length > 0 ? (
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Company</th>
                    <th>Rating</th>
                    <th>Content</th>
                    <th>Active</th>
                    <th style={{ width: 100 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTestimonials.map((item) => (
                    <tr key={item._id}>
                      <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.name}</td>
                      <td>{item.role || '-'}</td>
                      <td>{item.company || '-'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 2 }}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar
                              key={star}
                              style={{
                                color: star <= (item.rating || 0) ? '#ffd54f' : 'rgba(255,255,255,0.15)',
                                fontSize: '0.8rem',
                              }}
                            />
                          ))}
                        </div>
                      </td>
                      <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.content || '-'}
                      </td>
                      <td>
                        <span style={styles.badge(item.isActive !== false ? 'success' : 'danger')}>
                          {item.isActive !== false ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button
                            style={styles.actionBtn('rgba(25,118,210,0.3)')}
                            onClick={() => openEditModal(item)}
                            title="Edit"
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'rgba(25,118,210,0.6)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'rgba(25,118,210,0.3)';
                            }}
                          >
                            <FaEdit />
                          </button>
                          <button
                            style={styles.actionBtn('rgba(211,47,47,0.3)')}
                            onClick={() => setDeleteTarget(item)}
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
                {searchTerm ? 'No testimonials match your search' : 'No testimonials found. Click "Add Testimonial" to create one.'}
              </div>
            )}
          </div>
        </div>
      </main>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" style={styles.modalWide} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingItem ? 'Edit Testimonial' : 'Add New Testimonial'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    style={styles.formControl}
                    placeholder="Person name"
                    required
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Role</label>
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    style={styles.formControl}
                    placeholder="e.g. Software Engineer"
                  />
                </div>
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Company</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    style={styles.formControl}
                    placeholder="e.g. Google"
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Avatar URL</label>
                  <input
                    type="url"
                    name="avatarUrl"
                    value={formData.avatarUrl}
                    onChange={handleInputChange}
                    style={styles.formControl}
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Rating</label>
                  <select
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                    style={styles.formControl}
                  >
                    <option value={1}>1 Star</option>
                    <option value={2}>2 Stars</option>
                    <option value={3}>3 Stars</option>
                    <option value={4}>4 Stars</option>
                    <option value={5}>5 Stars</option>
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Display Order</label>
                  <input
                    type="number"
                    name="displayOrder"
                    value={formData.displayOrder}
                    onChange={handleInputChange}
                    style={styles.formControl}
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Content *</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  style={{ ...styles.formControl, minHeight: 100, resize: 'vertical' }}
                  placeholder="Testimonial content"
                  rows={4}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.checkboxRow}>
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    style={styles.checkbox}
                  />
                  <span style={styles.checkboxLabel}>Active</span>
                </label>
              </div>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    ...styles.addBtn,
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={styles.addBtn}
                  disabled={saving}
                >
                  <FaSave /> {saving ? 'Saving...' : editingItem ? 'Update Testimonial' : 'Create Testimonial'}
                </button>
              </div>
            </form>
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
            <h3 style={{ marginBottom: 8, fontFamily: 'var(--font-primary)' }}>Delete Testimonial</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: 24, fontSize: '0.9rem' }}>
              Are you sure you want to delete the testimonial from "{deleteTarget.name}"? This action cannot be undone.
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
                {deleting ? 'Deleting...' : 'Delete Testimonial'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
