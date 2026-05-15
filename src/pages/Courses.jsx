import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  FaSearch, FaStar, FaClock, FaUserTie, FaFilter,
  FaArrowRight, FaHome, FaChevronRight, FaUsers
} from 'react-icons/fa';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getCourseImage, sourceCategories, sourceCourses, sourceTrainingSections, useCourseImageFallback } from '../data/sourceContent';

const supportedSlugs = new Set(sourceCourses.map((course) => course.slug));

const Courses = () => {
  const [courses, setCourses] = useState(sourceCourses);
  const [categories, setCategories] = useState(sourceCategories);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, categoriesRes] = await Promise.all([
          api.get('/courses'),
          api.get('/courses/categories'),
        ]);
        const supportedCourses = (coursesRes.data.courses || []).filter((course) => supportedSlugs.has(course.slug));
        if (supportedCourses.length > 0) setCourses(supportedCourses);
        const supportedCategoryNames = new Set(sourceCategories.map((cat) => cat.name));
        const supportedCategories = (categoriesRes.data.categories || []).filter((cat) => supportedCategoryNames.has(cat.name));
        if (supportedCategories.length > 0) setCategories([{ name: 'All', slug: 'all' }, ...supportedCategories]);
      } catch (err) {
        console.log('Using default courses');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam && categories.length > 0) {
      const match = categories.find(c => c.slug === categoryParam);
      if (match) setActiveCategory(match.name);
    }
  }, [searchParams, categories]);

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.short_description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' ||
      course.category_name?.toLowerCase() === activeCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const groupedCourses = {};
  filteredCourses.forEach(course => {
    const cat = course.category_name || 'Other';
    if (!groupedCourses[cat]) groupedCourses[cat] = [];
    groupedCourses[cat].push(course);
  });

  const SkeletonCard = () => (
    <div className="course-card">
      <div className="skeleton" style={{ height: '200px' }}></div>
      <div style={{ padding: '20px' }}>
        <div className="skeleton" style={{ height: '14px', width: '80px', marginBottom: '12px' }}></div>
        <div className="skeleton" style={{ height: '20px', width: '90%', marginBottom: '10px' }}></div>
        <div className="skeleton" style={{ height: '14px', width: '100%', marginBottom: '6px' }}></div>
        <div className="skeleton" style={{ height: '14px', width: '70%', marginBottom: '16px' }}></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="skeleton" style={{ height: '20px', width: '80px' }}></div>
          <div className="skeleton" style={{ height: '32px', width: '100px', borderRadius: 'var(--radius-full)' }}></div>
        </div>
      </div>
    </div>
  );

  const CourseCard = ({ course, i }) => (
    <div
      key={course.id || i}
      className="course-card"
      style={{ animation: `fadeInUp 0.6s ease ${i * 0.05}s both`, cursor: 'pointer' }}
      onClick={() => navigate(`/courses/${course.slug}`)}
    >
      <div className="card-image">
        <img
          src={getCourseImage(course.thumbnail_url)}
          alt={course.title}
          onError={useCourseImageFallback}
        />
        <div className="card-badge">{course.category_name || 'Course'}</div>
      </div>
      <div className="card-body">
        <div className="card-category">{course.category_name}</div>
        <h4 className="card-title">
          <Link to={`/courses/${course.slug}`} onClick={(e) => e.stopPropagation()}>
            {course.title}
          </Link>
        </h4>
        <p className="card-description">{course.short_description}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ffd54f', fontSize: '0.85rem' }}>
            <FaStar /> {course.rating || '4.8'}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <FaClock /> {course.duration || '100 Days'}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <FaUserTie /> {course.instructor_name || 'Expert Instructor'}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <FaUsers /> Zulanex learners
          </span>
        </div>
        <div className="card-meta">
          <div className="card-price">
            {course.price ? `₹${Number(course.price).toLocaleString('en-IN')}` : 'Contact us'}
            {course.original_price && (
              <span className="original">₹{Number(course.original_price).toLocaleString('en-IN')}</span>
            )}
          </div>
          <Link
            to={`/courses/${course.slug}`}
            className="btn btn-primary btn-sm"
            onClick={(e) => e.stopPropagation()}
          >
            View Details <FaArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Navbar />

      <section style={{
        background: 'var(--gradient-hero)',
        padding: '120px 0 60px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '-80px', right: '-80px',
          width: '300px', height: '300px', borderRadius: '50%',
          background: 'var(--blue-700)', filter: 'blur(80px)', opacity: '0.25',
        }}></div>
        <div style={{
          position: 'absolute', bottom: '-60px', left: '-60px',
          width: '250px', height: '250px', borderRadius: '50%',
          background: 'var(--green-700)', filter: 'blur(80px)', opacity: '0.2',
        }}></div>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Link to="/" style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem' }}>
              <FaHome /> Home
            </Link>
            <FaChevronRight style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }} />
            <span style={{ color: 'var(--blue-400)', fontSize: '0.9rem', fontWeight: 500 }}>Courses</span>
          </div>
          <h1 style={{ marginBottom: '12px' }}>
            Our <span className="gradient-text">Courses</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '600px' }}>
            Discover source-backed Zulanex passes and job-ready learning built around practical training, real projects, certificates, mentoring, and placement support.
          </p>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          {sourceTrainingSections.map((section) => (
            <div key={section.slug}>
              <div className="section-title" style={{ marginBottom: 28 }}>
                <h2><span className="gradient-text">{section.title}</span></h2>
                <p>{section.description}</p>
              </div>
              <div style={{
                padding: '18px 20px',
                borderRadius: 'var(--radius-lg)',
                background: 'linear-gradient(135deg, rgba(6,27,104,0.92), rgba(0,114,206,0.88), rgba(21,196,232,0.72))',
                border: '1px solid rgba(120,222,242,0.35)',
                boxShadow: '0 16px 42px rgba(0,114,206,0.16)',
                marginBottom: 20,
                color: '#fff',
                fontWeight: 800,
              }}>
                {section.items.length} PDF-listed training tracks
              </div>
              <div className="grid grid-4">
                {section.items.map((item, i) => (
                  <div
                    key={item}
                    className="card source-topic-card"
                    style={{
                      padding: '18px',
                      minHeight: 92,
                      display: 'flex',
                      alignItems: 'center',
                      borderColor: 'rgba(0,163,224,0.18)',
                      background: 'linear-gradient(145deg, var(--bg-card) 0%, rgba(6,27,104,0.18) 100%)',
                      animation: `fadeInUp 0.6s ease ${i * 0.03}s both`,
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
            <div className="tabs">
              {categories.map(cat => (
                <button
                  key={cat.slug || cat.name}
                  className={`tab ${activeCategory === cat.name ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat.name)}
                >
                  {cat.name}
                </button>
              ))}
            </div>
            <div style={{ position: 'relative', minWidth: '280px' }}>
              <FaSearch style={{
                position: 'absolute', left: '16px', top: '50%',
                transform: 'translateY(-50%)', color: 'var(--text-muted)',
              }} />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-control"
                style={{ paddingLeft: '44px', borderRadius: 'var(--radius-full)' }}
              />
            </div>
          </div>

          {loading ? (
            <div className="grid grid-3">
              {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : filteredCourses.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <FaFilter style={{ fontSize: '3rem', color: 'var(--text-muted)', marginBottom: '16px' }} />
              <h3 style={{ marginBottom: '8px' }}>No courses found</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
                Try adjusting your search or filter criteria
              </p>
              <button
                className="btn btn-primary"
                onClick={() => { setSearchTerm(''); setActiveCategory('All'); }}
              >
                Clear Filters
              </button>
            </div>
          ) : activeCategory === 'All' && !searchTerm ? (
            Object.entries(groupedCourses).map(([catName, catCourses]) => (
              <div key={catName} style={{ marginBottom: '48px' }}>
                <h2 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className="gradient-text">{catName}</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                    ({catCourses.length} course{catCourses.length !== 1 ? 's' : ''})
                  </span>
                </h2>
                <div className="grid grid-3">
                  {catCourses.map((course, i) => (
                    <CourseCard key={course.id || i} course={course} i={i} />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <>
              <div style={{ marginBottom: '16px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Showing {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''}
              </div>
              <div className="grid grid-3">
                {filteredCourses.map((course, i) => (
                  <CourseCard key={course.id || i} course={course} i={i} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Courses;
