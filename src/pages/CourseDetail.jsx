import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaArrowRight, FaCheck, FaClock, FaGraduationCap, FaHome, FaLock, FaStar, FaUsers } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { courseDetails, sourceCourses } from '../data/sourceContent';

const CourseDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const data = courseDetails[slug?.toLowerCase().trim()];

  if (!data) {
    return (
      <>
        <Navbar />
        <section style={{ padding: '140px 0 80px', textAlign: 'center' }}>
          <div className="container">
            <h1 style={{ marginBottom: '16px' }}>Course Not Found</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>This item is not listed in the Zulanex source materials.</p>
            <Link to="/courses" className="btn btn-primary">Browse Source-Backed Courses</Link>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      const orderRes = await api.post('/payments/create-order', { courseId: data.id });
      new window.Razorpay({
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.price * 100,
        currency: 'INR',
        name: 'Zulanex',
        description: data.title,
        order_id: orderRes.data.orderId,
        handler: async (r) => {
          await api.post('/payments/verify', { ...r, courseId: data.id });
          toast.success('Enrolled!');
          navigate('/dashboard');
        },
        theme: { color: '#0072ce' },
      }).open();
    } catch {
      toast.error('Unable to start payment');
    }
  };

  const relatedCourses = sourceCourses.filter((course) => course.slug !== data.slug).slice(0, 3);

  return (
    <>
      <Navbar />
      <section style={{ background: 'var(--gradient-hero)', padding: '120px 0 56px' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, alignItems: 'center', flexWrap: 'wrap' }}>
            <Link to="/" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 4 }}><FaHome /> Home</Link>
            <span style={{ color: 'var(--text-muted)' }}>/</span>
            <Link to="/courses" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Courses</Link>
            <span style={{ color: 'var(--text-muted)' }}>/</span>
            <span style={{ color: 'var(--blue-300)', fontSize: '0.85rem', fontWeight: 700 }}>{data.title}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr minmax(280px, 360px)', gap: 32, alignItems: 'start' }}>
            <div>
              <div className="badge badge-primary" style={{ marginBottom: 14 }}>{data.category_name}</div>
              <h1 style={{ marginBottom: 12 }}>{data.title}</h1>
              <p style={{ maxWidth: 760, color: 'var(--text-secondary)' }}>{data.desc}</p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 20 }}>
                <span className="detail-chip"><FaStar /> {data.rating}</span>
                <span className="detail-chip"><FaClock /> {data.duration}</span>
                <span className="detail-chip"><FaGraduationCap /> {data.level}</span>
                <span className="detail-chip"><FaUsers /> Zulanex learners</span>
              </div>
            </div>

            <div className="card" style={{ padding: 20, position: 'sticky', top: 96 }}>
              <img src={data.thumbnail_url} alt={data.title} style={{ width: '100%', height: 180, objectFit: 'cover', objectPosition: 'top', borderRadius: 12, marginBottom: 16 }} />
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--green-400)', marginBottom: 16 }}>₹{data.price.toLocaleString('en-IN')}</div>
              <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleEnroll}>
                <FaLock /> Enroll Now
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid grid-3">
            {[
              ['What You Get', data.curriculum],
              ['Learning Outcomes', data.outcomes],
              ['Included Support', data.tools],
            ].map(([title, items]) => (
              <div className="card" style={{ padding: 24 }} key={title}>
                <h3 style={{ marginBottom: 18 }}>{title}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {items.map((item) => (
                    <div key={item} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', color: 'var(--text-secondary)' }}>
                      <FaCheck style={{ color: 'var(--green-400)', marginTop: 5, flexShrink: 0 }} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="section-title">
            <h2>Related <span className="gradient-text">Source-Backed</span> Options</h2>
          </div>
          <div className="grid grid-3">
            {relatedCourses.map((course) => (
              <Link key={course.slug} to={`/courses/${course.slug}`} className="card" style={{ padding: 22, textDecoration: 'none' }}>
                <div className="badge badge-primary" style={{ marginBottom: 12 }}>{course.category_name}</div>
                <h4 style={{ marginBottom: 10 }}>{course.title}</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{course.short_description}</p>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 16, color: 'var(--blue-300)', fontWeight: 700 }}>
                  View <FaArrowRight />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default CourseDetail;
