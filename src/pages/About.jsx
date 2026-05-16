import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaGraduationCap, FaBook, FaChalkboardTeacher, FaChartLine,
  FaStar, FaQuoteLeft, FaHome, FaChevronRight, FaArrowRight,
  FaBriefcase, FaCertificate, FaDollarSign, FaInfinity,
  FaUsers, FaRocket, FaGlobe, FaHeart
} from 'react-icons/fa';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const features = [
  {
    icon: FaBriefcase,
    title: 'Live Projects',
    description: 'Work on real-world industry projects that prepare you for actual job scenarios.',
  },
  {
    icon: FaChalkboardTeacher,
    title: 'Expert Instructors',
    description: 'Learn from industry professionals with years of hands-on experience.',
  },
  {
    icon: FaGraduationCap,
    title: 'Placement Assistance',
    description: 'Get dedicated placement support with resume building and mock interviews.',
  },
  {
    icon: FaCertificate,
    title: 'Industry Certificates',
    description: 'Earn recognized certificates upon successful completion of programs.',
  },
  {
    icon: FaInfinity,
    title: 'Learn Anytime, Anywhere',
    description: 'Flexible learning is listed in the source materials through live/recorded sessions and learn-anytime-anywhere support.',
  },
  {
    icon: FaDollarSign,
    title: 'Affordable Pricing',
    description: 'Quality education at competitive prices with flexible payment options.',
  },
];

const About = () => {
  const [stats, setStats] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, testimonialsRes] = await Promise.all([
          api.get('/courses/meta/stats'),
          api.get('/courses/meta/testimonials'),
        ]);
        setStats(statsRes.data.data || statsRes.data);
        setTestimonials(testimonialsRes.data.data || testimonialsRes.data);
      } catch (err) {
        console.error('Failed to fetch about data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statsData = stats ? [
    { icon: FaUsers, value: '500+', label: 'Learners' },
    { icon: FaBook, value: '25+', label: 'Hiring Partners' },
    { icon: FaChalkboardTeacher, value: '40+', label: 'Training Experts' },
    { icon: FaChartLine, value: '80+', label: 'Project Tracks' },
  ] : [];

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading-screen" style={{ minHeight: '100vh', paddingTop: '80px' }}>
          <div className="spinner"></div>
          <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
        </div>
        <Footer />
      </>
    );
  }

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
          position: 'absolute',
          top: '-80px',
          right: '-80px',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'var(--blue-700)',
          filter: 'blur(80px)',
          opacity: '0.25',
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '-60px',
          left: '-60px',
          width: '250px',
          height: '250px',
          borderRadius: '50%',
          background: 'var(--green-700)',
          filter: 'blur(80px)',
          opacity: '0.2',
        }}></div>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Link to="/" style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem' }}>
              <FaHome /> Home
            </Link>
            <FaChevronRight style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }} />
            <span style={{ color: 'var(--blue-400)', fontSize: '0.9rem', fontWeight: 500 }}>About Us</span>
          </div>
          <h1 style={{ marginBottom: '12px', animation: 'fadeInUp 0.8s ease' }}>
            About <span className="gradient-text">Zulanex</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', animation: 'fadeInUp 0.8s ease 0.2s both' }}>
            Affordable, practical, job-focused learning for rural and urban students.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="split-media-grid about-story-grid">
            <div className="split-content" style={{ animation: 'fadeInUp 0.8s ease' }}>
              <h2 style={{ marginBottom: '20px' }}>Our <span className="gradient-text">Story</span></h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.8, marginBottom: '16px' }}>
                Zulanex is presented in the source materials as an affordable, practical, job-focused learning platform for real learning and real success.
              </p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.8, marginBottom: '16px' }}>
                The source materials describe practical learning, real-world projects, expert mentors, AI implementation, job-ready programs, affordable pricing, certificate courses, and placement support.
              </p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.8, marginBottom: '24px' }}>
                The student journey in the PDF moves from foundation to build and practice, master and specialize, and get job ready with resume/profile building, mock interviews, communication skills, and placement assistance.
              </p>
              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--blue-400)', fontFamily: 'var(--font-primary)' }}>500+</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Learners</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--green-400)', fontFamily: 'var(--font-primary)' }}>25+</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Hiring Partners</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffd54f', fontFamily: 'var(--font-primary)' }}>40+</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Training Experts</div>
                </div>
              </div>
            </div>
            <div className="split-media" style={{ animation: 'fadeInUp 0.8s ease 0.2s both' }}>
              <div className="responsive-media-card">
                <img
                  src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800"
                  alt="About Zulanex"
                  className="responsive-media-image"
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(25,118,210,0.3) 0%, rgba(0,200,83,0.2) 100%)' }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="section-title">
            <h2>Mission & <span className="gradient-text">Vision</span></h2>
            <p>Guiding principles that drive everything we do</p>
          </div>
          <div className="grid grid-2">
            <div className="card" style={{ padding: '40px', animation: 'fadeInUp 0.6s ease' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(25,118,210,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--blue-400)',
                fontSize: '1.5rem',
                marginBottom: '20px',
              }}>
                <FaRocket />
              </div>
              <h3 style={{ marginBottom: '12px' }}>Our Mission</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.8 }}>
                To empower learners with real-world skills and career opportunities, bridging the gap between education and employment.
              </p>
            </div>
            <div className="card" style={{ padding: '40px', animation: 'fadeInUp 0.6s ease 0.1s both' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(0,200,83,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--green-400)',
                fontSize: '1.5rem',
                marginBottom: '20px',
              }}>
                <FaGlobe />
              </div>
              <h3 style={{ marginBottom: '12px' }}>Our Vision</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.8 }}>
                To become a leading global EdTech platform that transforms learners into job-ready, future-ready professionals through practical, skill-based education.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-title">
            <h2>Why Choose <span className="gradient-text">Us</span></h2>
            <p>What sets Zulanex apart from the rest</p>
          </div>
          <div className="grid grid-3">
            {features.map((feature, i) => (
              <div
                key={i}
                className="card"
                style={{
                  padding: '32px 24px',
                  textAlign: 'center',
                  animation: `fadeInUp 0.6s ease ${i * 0.1}s both`,
                }}
              >
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: 'var(--radius-lg)',
                  background: 'rgba(25,118,210,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  fontSize: '1.5rem',
                  color: 'var(--blue-400)',
                }}>
                  <feature.icon />
                </div>
                <h4 style={{ marginBottom: '10px' }}>{feature.title}</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="container">
          <div className="section-title">
            <h2>Our <span className="gradient-text">Numbers</span></h2>
            <p>Numbers that reflect our commitment to excellence</p>
          </div>
          <div className="grid grid-4">
            {statsData.map((stat, i) => (
              <div key={i} className="stat-item" style={{ animation: `fadeInUp 0.6s ease ${i * 0.1}s both` }}>
                <div className="stat-icon"><stat.icon /></div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {testimonials.length > 0 && (
        <section className="section" style={{ background: 'var(--bg-secondary)' }}>
          <div className="container">
            <div className="section-title">
              <h2>What Our <span className="gradient-text">Students Say</span></h2>
              <p>Hear from our successful alumni about their learning experience</p>
            </div>
            <div className="grid grid-3">
              {testimonials.slice(0, 6).map((t, i) => (
                <div key={t._id || i} className="testimonial-card" style={{ animation: `fadeInUp 0.6s ease ${i * 0.1}s both` }}>
                  <FaQuoteLeft style={{ color: 'var(--blue-400)', fontSize: '1.5rem', marginBottom: '16px', opacity: 0.5 }} />
                  <div className="stars">
                    {[...Array(5)].map((_, j) => (
                      <FaStar key={j} style={{ color: j < (t.rating || 5) ? '#ffd54f' : 'rgba(255,255,255,0.1)' }} />
                    ))}
                  </div>
                  <p className="quote">"{t.message || t.content || t.text}"</p>
                  <div className="author">
                    <img src={t.avatar || t.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name || 'Student')}&background=1976d2&color=fff`} alt={t.name} />
                    <div className="author-info">
                      <h5>{t.name}</h5>
                      <p>{t.course || t.role || 'Student'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section" style={{
        background: 'linear-gradient(135deg, var(--blue-900) 0%, var(--bg-primary) 50%, var(--green-900) 100%)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          top: '-100px',
          right: '-100px',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'var(--blue-700)',
          filter: 'blur(100px)',
          opacity: '0.2',
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '-100px',
          left: '-100px',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'var(--green-700)',
          filter: 'blur(100px)',
          opacity: '0.2',
        }}></div>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <FaHeart style={{ color: '#ef5350', fontSize: '1.2rem' }} />
            <span style={{ color: 'var(--blue-300)', fontSize: '0.9rem', fontWeight: 500 }}>Join Our Community</span>
          </div>
          <h2 style={{ marginBottom: '16px' }}>
            Ready to Start Your <span className="gradient-text">Journey</span>?
          </h2>
          <p style={{ fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 32px', color: 'var(--text-secondary)' }}>
            Join Zulanex today and follow the source-backed path: connect, learn, grow, and prepare for job-ready success.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary btn-lg">
              Enroll Now <FaArrowRight />
            </Link>
            <Link to="/courses" className="btn btn-secondary btn-lg">
              Browse Courses
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default About;
