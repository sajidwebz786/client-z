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
  FaEdit,
  FaTrash,
  FaSearch,
  FaTimes,
  FaSave,
  FaImage,
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

const levelOptions = [
  'Beginner',
  'Intermediate',
  'Advanced',
  'Beginner to Advanced',
  'Intermediate to Advanced',
];

const initialFormData = {
  title: '',
  slug: '',
  shortDescription: '',
  fullDescription: '',
  categoryId: '',
  price: '',
  originalPrice: '',
  duration: '',
  level: 'Beginner',
  thumbnailUrl: '',
  bannerUrl: '',
  instructorName: '',
  instructorBio: '',
  instructorAvatar: '',
  rating: '',
  totalHours: '',
  totalLectures: '',
  isFeatured: false,
  isBestseller: false,
  isActive: true,
  displayOrder: '',
};

const initialHighlightData = {
  text: '',
  icon: '',
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
  thumbnail: {
    width: 56,
    height: 40,
    borderRadius: 'var(--radius-sm)',
    objectFit: 'cover',
    border: '1px solid rgba(255,255,255,0.1)',
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
  checkbox: {
    width: 18,
    height: 18,
    cursor: 'pointer',
    accentColor: 'var(--blue-400)',
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
  modalWide: {
    background: 'var(--bg-secondary)',
    borderRadius: 'var(--radius-xl)',
    border: '1px solid rgba(255,255,255,0.1)',
    maxWidth: 750,
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
  formRow3: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
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
  sectionDivider: {
    width: '100%',
    height: 1,
    background: 'rgba(255,255,255,0.06)',
    margin: '20px 0',
  },
  sectionTitle: {
    fontSize: '1rem',
    fontWeight: 700,
    fontFamily: 'var(--font-primary)',
    color: 'var(--blue-400)',
    marginBottom: 16,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  highlightItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '10px 14px',
    background: 'rgba(0,0,0,0.2)',
    borderRadius: 'var(--radius-md)',
    marginBottom: 8,
    border: '1px solid rgba(255,255,255,0.06)',
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

export default function CoursesManager() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [showHighlights, setShowHighlights] = useState(false);
  const [highlightsCourseId, setHighlightsCourseId] = useState(null);
  const [highlights, setHighlights] = useState([]);
  const [highlightForm, setHighlightForm] = useState(initialHighlightData);
  const [editingHighlightId, setEditingHighlightId] = useState(null);
  const [loadingHighlights, setLoadingHighlights] = useState(false);

  useEffect(() => {
    fetchCourses();
    fetchCategories();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await api.get('/admin/courses');
      setCourses(res.data.courses || res.data || []);
    } catch {
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/admin/categories');
      setCategories(res.data.categories || res.data || []);
    } catch {
    }
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newVal = type === 'checkbox' ? checked : value;
    setFormData((prev) => {
      const updated = { ...prev, [name]: newVal };
      if (name === 'title') {
        updated.slug = generateSlug(value);
      }
      return updated;
    });
  };

  const openAddModal = () => {
    setEditingCourse(null);
    setFormData(initialFormData);
    setShowHighlights(false);
    setHighlightsCourseId(null);
    setHighlights([]);
    setShowModal(true);
  };

  const openEditModal = (course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title || '',
      slug: course.slug || '',
      shortDescription: course.shortDescription || '',
      fullDescription: course.fullDescription || '',
      categoryId: course.categoryId?._id || course.categoryId || '',
      price: course.price ?? '',
      originalPrice: course.originalPrice ?? '',
      duration: course.duration || '',
      level: course.level || 'Beginner',
      thumbnailUrl: course.thumbnailUrl || '',
      bannerUrl: course.bannerUrl || '',
      instructorName: course.instructorName || '',
      instructorBio: course.instructorBio || '',
      instructorAvatar: course.instructorAvatar || '',
      rating: course.rating ?? '',
      totalHours: course.totalHours ?? '',
      totalLectures: course.totalLectures ?? '',
      isFeatured: course.isFeatured || false,
      isBestseller: course.isBestseller || false,
      isActive: course.isActive !== undefined ? course.isActive : true,
      displayOrder: course.displayOrder ?? '',
    });
    setShowHighlights(false);
    setHighlightsCourseId(null);
    setHighlights([]);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...formData,
        price: formData.price !== '' ? Number(formData.price) : 0,
        originalPrice: formData.originalPrice !== '' ? Number(formData.originalPrice) : undefined,
        rating: formData.rating !== '' ? Number(formData.rating) : undefined,
        totalHours: formData.totalHours !== '' ? Number(formData.totalHours) : undefined,
        totalLectures: formData.totalLectures !== '' ? Number(formData.totalLectures) : undefined,
        displayOrder: formData.displayOrder !== '' ? Number(formData.displayOrder) : undefined,
      };
      if (editingCourse) {
        await api.put(`/admin/courses/${editingCourse._id}`, payload);
        toast.success('Course updated successfully');
      } else {
        const res = await api.post('/admin/courses', payload);
        toast.success('Course created successfully');
        const newId = res.data.course?._id || res.data._id;
        if (newId) {
          setHighlightsCourseId(newId);
          setShowHighlights(true);
          setEditingCourse({ _id: newId, ...payload });
        }
      }
      fetchCourses();
      if (editingCourse) {
        setShowHighlights(true);
        setHighlightsCourseId(editingCourse._id);
        fetchHighlights(editingCourse._id);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save course');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/admin/courses/${deleteTarget._id}`);
      toast.success('Course deleted successfully');
      setDeleteTarget(null);
      fetchCourses();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete course');
    } finally {
      setDeleting(false);
    }
  };

  const fetchHighlights = async (courseId) => {
    setLoadingHighlights(true);
    try {
      const res = await api.get(`/admin/courses/${courseId}/highlights`);
      setHighlights(res.data.highlights || res.data || []);
    } catch {
    } finally {
      setLoadingHighlights(false);
    }
  };

  const handleManageHighlights = () => {
    const id = highlightsCourseId || editingCourse?._id;
    if (!id) return;
    setShowHighlights(true);
    setHighlightsCourseId(id);
    fetchHighlights(id);
  };

  const handleHighlightInputChange = (e) => {
    const { name, value } = e.target;
    setHighlightForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveHighlight = async () => {
    const id = highlightsCourseId;
    if (!id || !highlightForm.text.trim()) return;
    try {
      if (editingHighlightId) {
        await api.put(`/admin/courses/${id}/highlights/${editingHighlightId}`, highlightForm);
        toast.success('Highlight updated');
      } else {
        await api.post(`/admin/courses/${id}/highlights`, highlightForm);
        toast.success('Highlight added');
      }
      setHighlightForm(initialHighlightData);
      setEditingHighlightId(null);
      fetchHighlights(id);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save highlight');
    }
  };

  const handleEditHighlight = (highlight) => {
    setHighlightForm({
      text: highlight.text || '',
      icon: highlight.icon || '',
    });
    setEditingHighlightId(highlight._id);
  };

  const handleDeleteHighlight = async (highlightId) => {
    const id = highlightsCourseId;
    if (!id) return;
    try {
      await api.delete(`/admin/courses/${id}/highlights/${highlightId}`);
      toast.success('Highlight deleted');
      fetchHighlights(id);
    } catch {
      toast.error('Failed to delete highlight');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const filteredCourses = courses.filter((course) => {
    const term = searchTerm.toLowerCase();
    return (
      course.title?.toLowerCase().includes(term) ||
      course.categoryId?.name?.toLowerCase().includes(term) ||
      course.categoryName?.toLowerCase().includes(term) ||
      course.instructorName?.toLowerCase().includes(term)
    );
  });

  if (loading) {
    return (
      <div style={styles.loadingScreen}>
        <div style={styles.spinner}></div>
        <p style={{ color: 'var(--text-muted)' }}>Loading courses...</p>
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
          <h1 style={styles.title}>Course Management</h1>
          <button style={styles.addBtn} onClick={openAddModal}>
            <FaPlus /> Add Course
          </button>
        </div>

        <div style={styles.searchContainer}>
          <div style={styles.searchWrapper}>
            <FaSearch style={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search courses by title, category, or instructor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
          </div>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
            {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div style={styles.adminCard}>
          <div style={styles.tableContainer}>
            {filteredCourses.length > 0 ? (
              <table className="table">
                <thead>
                  <tr>
                    <th style={{ width: 70 }}>Thumb</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Duration</th>
                    <th>Level</th>
                    <th>Featured</th>
                    <th>Bestseller</th>
                    <th>Active</th>
                    <th style={{ width: 100 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCourses.map((course) => (
                    <tr key={course._id}>
                      <td>
                        {course.thumbnailUrl ? (
                          <img
                            src={course.thumbnailUrl}
                            alt={course.title}
                            style={styles.thumbnail}
                          />
                        ) : (
                          <div
                            style={{
                              ...styles.thumbnail,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: 'rgba(255,255,255,0.05)',
                            }}
                          >
                            <FaImage style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }} />
                          </div>
                        )}
                      </td>
                      <td style={{ fontWeight: 600, color: 'var(--text-primary)', maxWidth: 220 }}>
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {course.title}
                        </div>
                      </td>
                      <td>{course.categoryId?.name || course.categoryName || '-'}</td>
                      <td style={{ color: 'var(--green-400)', fontWeight: 600 }}>
                        ₹{Number(course.price || 0).toLocaleString('en-IN')}
                      </td>
                      <td>{course.duration || '-'}</td>
                      <td>
                        <span style={styles.badge('info')}>{course.level || 'Beginner'}</span>
                      </td>
                      <td>
                        {course.isFeatured ? (
                          <FaStar style={{ color: '#ffd54f' }} />
                        ) : (
                          <span style={{ color: 'var(--text-muted)' }}>-</span>
                        )}
                      </td>
                      <td>
                        {course.isBestseller ? (
                          <FaCheck style={{ color: 'var(--green-400)' }} />
                        ) : (
                          <span style={{ color: 'var(--text-muted)' }}>-</span>
                        )}
                      </td>
                      <td>
                        <span style={styles.badge(course.isActive !== false ? 'success' : 'danger')}>
                          {course.isActive !== false ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button
                            style={styles.actionBtn('rgba(25,118,210,0.3)')}
                            onClick={() => openEditModal(course)}
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
                            onClick={() => setDeleteTarget(course)}
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
                {searchTerm ? 'No courses match your search' : 'No courses found. Click "Add Course" to create one.'}
              </div>
            )}
          </div>
        </div>
      </main>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" style={styles.modalWide} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingCourse ? 'Edit Course' : 'Add New Course'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={styles.sectionTitle}>
                <FaBook /> Basic Information
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  style={styles.formControl}
                  placeholder="Course title"
                  required
                />
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Slug</label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    style={styles.formControl}
                    placeholder="auto-generated-from-title"
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Category *</label>
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    style={styles.formControl}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Short Description</label>
                <textarea
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleInputChange}
                  style={{ ...styles.formControl, minHeight: 80, resize: 'vertical' }}
                  placeholder="Brief course description"
                  rows={3}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Full Description</label>
                <textarea
                  name="fullDescription"
                  value={formData.fullDescription}
                  onChange={handleInputChange}
                  style={{ ...styles.formControl, minHeight: 120, resize: 'vertical' }}
                  placeholder="Detailed course description with HTML support"
                  rows={5}
                />
              </div>

              <div style={styles.sectionDivider}></div>
              <div style={styles.sectionTitle}>
                <FaImage /> Media
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Thumbnail URL</label>
                  <input
                    type="url"
                    name="thumbnailUrl"
                    value={formData.thumbnailUrl}
                    onChange={handleInputChange}
                    style={styles.formControl}
                    placeholder="https://example.com/thumbnail.jpg"
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Banner URL</label>
                  <input
                    type="url"
                    name="bannerUrl"
                    value={formData.bannerUrl}
                    onChange={handleInputChange}
                    style={styles.formControl}
                    placeholder="https://example.com/banner.jpg"
                  />
                </div>
              </div>

              <div style={styles.sectionDivider}></div>
              <div style={styles.sectionTitle}>
                <FaStar /> Pricing & Details
              </div>

              <div style={styles.formRow3}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Price (₹) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    style={styles.formControl}
                    placeholder="499"
                    min="0"
                    required
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Original Price (₹)</label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleInputChange}
                    style={styles.formControl}
                    placeholder="999"
                    min="0"
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Duration</label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    style={styles.formControl}
                    placeholder="e.g. 8 weeks"
                  />
                </div>
              </div>

              <div style={styles.formRow3}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Level</label>
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleInputChange}
                    style={styles.formControl}
                  >
                    {levelOptions.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Total Hours</label>
                  <input
                    type="number"
                    name="totalHours"
                    value={formData.totalHours}
                    onChange={handleInputChange}
                    style={styles.formControl}
                    placeholder="40"
                    min="0"
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Total Lectures</label>
                  <input
                    type="number"
                    name="totalLectures"
                    value={formData.totalLectures}
                    onChange={handleInputChange}
                    style={styles.formControl}
                    placeholder="120"
                    min="0"
                  />
                </div>
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Rating</label>
                  <input
                    type="number"
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                    style={styles.formControl}
                    placeholder="4.5"
                    min="0"
                    max="5"
                    step="0.1"
                  />
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

              <div style={styles.sectionDivider}></div>
              <div style={styles.sectionTitle}>
                <FaUsers /> Instructor
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Instructor Name</label>
                  <input
                    type="text"
                    name="instructorName"
                    value={formData.instructorName}
                    onChange={handleInputChange}
                    style={styles.formControl}
                    placeholder="John Doe"
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Instructor Avatar URL</label>
                  <input
                    type="url"
                    name="instructorAvatar"
                    value={formData.instructorAvatar}
                    onChange={handleInputChange}
                    style={styles.formControl}
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Instructor Bio</label>
                <textarea
                  name="instructorBio"
                  value={formData.instructorBio}
                  onChange={handleInputChange}
                  style={{ ...styles.formControl, minHeight: 80, resize: 'vertical' }}
                  placeholder="Brief bio about the instructor"
                  rows={3}
                />
              </div>

              <div style={styles.sectionDivider}></div>
              <div style={styles.sectionTitle}>
                <FaCheck /> Status
              </div>

              <div style={{ display: 'flex', gap: 32, marginBottom: 24 }}>
                <label style={styles.checkboxRow}>
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleInputChange}
                    style={styles.checkbox}
                  />
                  <span style={styles.checkboxLabel}>Featured Course</span>
                </label>
                <label style={styles.checkboxRow}>
                  <input
                    type="checkbox"
                    name="isBestseller"
                    checked={formData.isBestseller}
                    onChange={handleInputChange}
                    style={styles.checkbox}
                  />
                  <span style={styles.checkboxLabel}>Bestseller</span>
                </label>
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

              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                {editingCourse && (
                  <button
                    type="button"
                    onClick={handleManageHighlights}
                    style={{
                      ...styles.addBtn,
                      background: 'linear-gradient(135deg, #ab47bc 0%, #7b1fa2 100%)',
                    }}
                  >
                    <FaStar /> Highlights
                  </button>
                )}
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
                  <FaSave /> {saving ? 'Saving...' : editingCourse ? 'Update Course' : 'Create Course'}
                </button>
              </div>
            </form>

            {showHighlights && (highlightsCourseId || editingCourse?._id) && (
              <>
                <div style={styles.sectionDivider}></div>
                <div style={styles.sectionTitle}>
                  <FaStar /> Course Highlights
                </div>

                {loadingHighlights ? (
                  <div style={{ textAlign: 'center', padding: 20, color: 'var(--text-muted)' }}>
                    Loading highlights...
                  </div>
                ) : (
                  <>
                    {highlights.length > 0 && (
                      <div style={{ marginBottom: 16 }}>
                        {highlights.map((h) => (
                          <div key={h._id} style={styles.highlightItem}>
                            {h.icon && (
                              <span style={{ color: 'var(--blue-400)', fontSize: '1.1rem' }}>{h.icon}</span>
                            )}
                            <span style={{ flex: 1, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                              {h.text}
                            </span>
                            <div style={{ display: 'flex', gap: 6 }}>
                              <button
                                type="button"
                                style={styles.actionBtn('rgba(25,118,210,0.3)')}
                                onClick={() => handleEditHighlight(h)}
                              >
                                <FaEdit />
                              </button>
                              <button
                                type="button"
                                style={styles.actionBtn('rgba(211,47,47,0.3)')}
                                onClick={() => handleDeleteHighlight(h._id)}
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
                      <div style={{ flex: 1 }}>
                        <label style={styles.formLabel}>Highlight Text</label>
                        <input
                          type="text"
                          name="text"
                          value={highlightForm.text}
                          onChange={handleHighlightInputChange}
                          style={styles.formControl}
                          placeholder="e.g. Hands-on projects with real-world scenarios"
                        />
                      </div>
                      <div style={{ width: 120 }}>
                        <label style={styles.formLabel}>Icon (emoji/text)</label>
                        <input
                          type="text"
                          name="icon"
                          value={highlightForm.icon}
                          onChange={handleHighlightInputChange}
                          style={styles.formControl}
                          placeholder="🎯"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleSaveHighlight}
                        style={{
                          ...styles.addBtn,
                          padding: '10px 18px',
                        }}
                      >
                        <FaPlus /> {editingHighlightId ? 'Update' : 'Add'}
                      </button>
                      {editingHighlightId && (
                        <button
                          type="button"
                          onClick={() => {
                            setHighlightForm(initialHighlightData);
                            setEditingHighlightId(null);
                          }}
                          style={{
                            ...styles.addBtn,
                            padding: '10px 18px',
                            background: 'transparent',
                            border: '1px solid rgba(255,255,255,0.2)',
                            color: 'var(--text-secondary)',
                          }}
                        >
                          <FaTimes />
                        </button>
                      )}
                    </div>
                  </>
                )}
              </>
            )}
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
            <h3 style={{ marginBottom: 8, fontFamily: 'var(--font-primary)' }}>Delete Course</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: 24, fontSize: '0.9rem' }}>
              Are you sure you want to delete "{deleteTarget.title}"? This action cannot be undone.
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
                {deleting ? 'Deleting...' : 'Delete Course'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
