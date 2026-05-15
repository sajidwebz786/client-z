import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaUser, FaSignOutAlt, FaChevronDown, FaChevronRight, FaSun, FaMoon } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Logo from './Logo';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [hoveredCat, setHoveredCat] = useState(null);
  const [categories, setCategories] = useState([]);
  const [coursesByCategory, setCoursesByCategory] = useState({});
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
    setCategoriesOpen(false);
  }, [location]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const [catRes, coursesRes] = await Promise.all([
          api.get('/courses/categories'),
          api.get('/courses'),
        ]);
        const cats = catRes.data.categories || [];
        setCategories(cats);
        const courses = coursesRes.data.courses || [];
        const grouped = {};
        courses.forEach(c => {
          const catName = c.category_name || 'Other';
          if (!grouped[catName]) grouped[catName] = [];
          grouped[catName].push(c);
        });
        setCoursesByCategory(grouped);
      } catch (err) {
        console.error('Failed to fetch categories', err);
      }
    };
    fetchCategories();
  }, []);

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
    { to: '/lms', label: 'LMS Portal' },
  ];

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''} ${isAuthPage ? 'auth-navbar' : ''}`}>
        <div className="container">
          <Link to="/" className="nav-brand">
            <Logo />
          </Link>

          <ul className="nav-links">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={isActive(link.to) ? 'active' : ''}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li
              style={{ position: 'relative' }}
              onMouseEnter={() => setCategoriesOpen(true)}
              onMouseLeave={() => { setCategoriesOpen(false); setHoveredCat(null); }}
            >
              <button
                style={{
                  background: 'none', border: 'none', color: isActive('/courses') ? 'var(--green-400)' : 'var(--text-secondary)',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px',
                  fontSize: '0.95rem', fontWeight: 500, fontFamily: 'var(--font-secondary)',
                  padding: '8px 0', transition: 'color 0.2s',
                }}
              >
                Course Categories <FaChevronDown style={{ fontSize: '0.6rem', transition: 'transform 0.2s', transform: categoriesOpen ? 'rotate(180deg)' : 'rotate(0)' }} />
              </button>
              {categoriesOpen && (
                <div
                  className="glass"
                  style={{
                    position: 'absolute', top: '100%', left: '-12px',
                    borderRadius: 'var(--radius-lg)', padding: '8px',
                    minWidth: '220px', boxShadow: 'var(--shadow-lg)',
                    zIndex: 1000, animation: 'fadeInUp 0.2s ease',
                  }}
                >
                  {categories.map((cat) => (
                    <div
                      key={cat.id || cat.slug}
                      style={{ position: 'relative' }}
                      onMouseEnter={() => setHoveredCat(cat.name)}
                      onMouseLeave={() => setHoveredCat(null)}
                    >
                      <Link
                        to={`/courses?category=${cat.slug}`}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          padding: '10px 14px', borderRadius: 'var(--radius-sm)',
                          color: hoveredCat === cat.name ? 'var(--green-400)' : 'var(--text-secondary)',
                          fontSize: '0.9rem', fontWeight: 500, transition: 'all 0.2s',
                          background: hoveredCat === cat.name ? 'rgba(0,200,83,0.08)' : 'transparent',
                        }}
                        onClick={() => setCategoriesOpen(false)}
                      >
                        {cat.name}
                        <FaChevronRight style={{ fontSize: '0.6rem' }} />
                      </Link>
                      {hoveredCat === cat.name && coursesByCategory[cat.name]?.length > 0 && (
                        <div
                          className="glass"
                          style={{
                            position: 'absolute', left: '100%', top: '0',
                            borderRadius: 'var(--radius-lg)', padding: '8px',
                            minWidth: '260px', boxShadow: 'var(--shadow-lg)',
                            zIndex: 1001, animation: 'fadeInUp 0.15s ease',
                          }}
                        >
                          {coursesByCategory[cat.name].map((course) => (
                            <Link
                              key={course.id || course.slug}
                              to={`/courses/${course.slug}`}
                              style={{
                                display: 'block', padding: '9px 14px',
                                borderRadius: 'var(--radius-sm)',
                                color: 'var(--text-secondary)', fontSize: '0.85rem',
                                transition: 'all 0.2s', whiteSpace: 'nowrap',
                                overflow: 'hidden', textOverflow: 'ellipsis',
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(25,118,210,0.08)'; e.currentTarget.style.color = 'var(--blue-400)'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                              onClick={() => { setCategoriesOpen(false); setHoveredCat(null); }}
                            >
                              {course.title}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </li>
          </ul>

          <div className="nav-actions">
            <button
              onClick={toggleTheme}
              className="btn btn-secondary btn-sm"
              style={{ padding: '8px 10px', minWidth: 'auto' }}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <FaSun style={{ color: '#fbbf24' }} /> : <FaMoon style={{ color: '#60a5fa' }} />}
            </button>
            {isAuthenticated ? (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="btn btn-secondary btn-sm"
                  style={{ gap: '6px' }}
                >
                  <FaUser />
                  <span>{user?.fullName?.split(' ')[0] || user?.name?.split(' ')[0] || 'User'}</span>
                  <FaChevronDown style={{ fontSize: '0.7rem' }} />
                </button>
                {dropdownOpen && (
                  <div
                    className="glass"
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      right: 0,
                      borderRadius: 'var(--radius-md)',
                      padding: '8px',
                      minWidth: '180px',
                      boxShadow: 'var(--shadow-lg)',
                    }}
                  >
                    <Link
                      to="/dashboard"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--text-secondary)',
                        fontSize: '0.9rem',
                      }}
                    >
                      <FaUser style={{ color: 'var(--blue-400)' }} />
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--text-secondary)',
                        fontSize: '0.9rem',
                        width: '100%',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      <FaSignOutAlt style={{ color: '#ef5350' }} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary btn-sm">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  Register
                </Link>
              </>
            )}
          </div>

          <button
            className="mobile-menu-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </nav>

      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
        <ul className="nav-links">
          {navLinks.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={isActive(link.to) ? 'active' : ''}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
            <li>
            <span style={{ color: 'var(--green-400)', fontWeight: 600, fontSize: '0.9rem', padding: '8px 0', display: 'block' }}>
              Course Categories
            </span>
            {categories.map((cat) => (
              <div key={cat.id || cat.slug} style={{ marginLeft: '12px' }}>
                <Link
                  to={`/courses?category=${cat.slug}`}
                  style={{ display: 'block', padding: '6px 0', color: 'var(--text-secondary)', fontSize: '0.85rem' }}
                  onClick={() => setMobileOpen(false)}
                >
                  {cat.name}
                </Link>
              </div>
            ))}
          </li>
          <li style={{ marginTop: '16px' }}>
            <button
              onClick={toggleTheme}
              className="btn btn-secondary"
              style={{ width: '100%', justifyContent: 'center', gap: '8px' }}
            >
              {theme === 'dark' ? <FaSun style={{ color: '#fbbf24' }} /> : <FaMoon style={{ color: '#60a5fa' }} />}
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
          </li>
          <li style={{ marginTop: '8px' }}>
            {isAuthenticated ? (
              <div className="flex-col gap-1">
                <Link
                  to="/dashboard"
                  className="btn btn-secondary"
                  style={{ width: '100%' }}
                  onClick={() => setMobileOpen(false)}
                >
                  <FaUser /> Dashboard
                </Link>
                <button
                  onClick={() => { handleLogout(); setMobileOpen(false); }}
                  className="btn btn-danger"
                  style={{ width: '100%' }}
                >
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            ) : (
              <div className="flex-col gap-1">
                <Link
                  to="/login"
                  className="btn btn-secondary"
                  style={{ width: '100%' }}
                  onClick={() => setMobileOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                  onClick={() => setMobileOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </li>
        </ul>
      </div>
    </>
  );
};

export default Navbar;
