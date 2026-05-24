import { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaArrowRight, FaCheck, FaClock, FaGraduationCap, FaHome, FaLock, FaStar, FaUsers } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { courseDetails, getCourseImage, sourceCourses, useCourseImageError } from '../data/sourceContent';

const CourseDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const normalizedSlug = slug?.toLowerCase().trim();
  const sourceData = courseDetails[normalizedSlug];
  const [courseData, setCourseData] = useState(null);
  const [apiRelatedCourses, setApiRelatedCourses] = useState([]);
  const [loading, setLoading] = useState(Boolean(sourceData));

  useEffect(() => {
    let active = true;

    const fetchCourse = async () => {
      if (!sourceData) return;
      setLoading(true);
      try {
        const response = await api.get(`/courses/${normalizedSlug}`);
        if (!active) return;
        setCourseData(response.data.course || null);
        setApiRelatedCourses(response.data.relatedCourses || []);
      } catch {
        if (active) {
          setCourseData(null);
          setApiRelatedCourses([]);
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchCourse();
    return () => {
      active = false;
    };
  }, [normalizedSlug, sourceData]);

  const data = useMemo(() => {
    if (!sourceData && !courseData) return null;
    return {
      ...sourceData,
      ...courseData,
      desc: sourceData?.desc || courseData?.full_description || courseData?.short_description,
      curriculum: sourceData?.curriculum || [],
      outcomes: sourceData?.outcomes || [],
      tools: sourceData?.tools || [],
      thumbnail_url: courseData?.thumbnail_url || sourceData?.thumbnail_url,
      category_name: courseData?.category_name || sourceData?.category_name,
      price: Number(courseData?.price ?? sourceData?.price ?? 0),
      original_price: courseData?.original_price ?? sourceData?.original_price,
    };
  }, [courseData, sourceData]);

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
    if (!data.id) {
      toast.error('Course is still syncing. Please try again in a moment.');
      return;
    }
    try {
      const orderRes = await api.post('/payments/create-order', { courseId: data.id });
      if (orderRes.data.testMode || !window.Razorpay) {
        await api.post('/payments/verify', {
          razorpay_order_id: orderRes.data.orderId,
          razorpay_payment_id: `test_payment_${Date.now()}`,
          courseId: data.id,
        });
        toast.success('Enrolled!');
        navigate('/courses');
        return;
      }

      new window.Razorpay({
        key: orderRes.data.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderRes.data.amount,
        currency: orderRes.data.currency || 'INR',
        name: 'Zulanex',
        description: data.title,
        order_id: orderRes.data.orderId,
        handler: async (r) => {
          await api.post('/payments/verify', { ...r, courseId: data.id });
          toast.success('Enrolled!');
          navigate('/courses');
        },
        theme: { color: '#0072ce' },
      }).open();
    } catch {
      toast.error('Unable to start payment');
    }
  };

  const relatedCourses = (apiRelatedCourses.length > 0 ? apiRelatedCourses : sourceCourses)
    .filter((course) => course.slug !== data.slug)
    .slice(0, 3);
  const featureGroups = [
    ['What You Get', data.curriculum],
    ['Learning Outcomes', data.outcomes],
    ['Included Support', data.tools],
  ].filter(([, items]) => items.length > 0);

  return (
    <>
      <Navbar />
      <section className="course-focus-page">
        <div className="container course-focus-container">
          <div className="course-focus-breadcrumb">
            <Link to="/"><FaHome /> Home</Link>
            <span>/</span>
            <Link to="/courses">Courses</Link>
            <span>/</span>
            <strong>{data.title}</strong>
          </div>

          <div className="course-focus-shell">
            <div className="course-focus-copy">
              <div className="badge badge-primary">{data.category_name}</div>
              <h1>{data.title}</h1>
              <p>{data.desc}</p>

              <div className="course-focus-chips">
                <span className="detail-chip"><FaStar /> {data.rating}</span>
                <span className="detail-chip"><FaClock /> {data.duration}</span>
                <span className="detail-chip"><FaGraduationCap /> {data.level}</span>
                <span className="detail-chip"><FaUsers /> Zulanex learners</span>
              </div>

              <div className="course-focus-info-grid">
                {featureGroups.map(([title, items]) => (
                  <div className="course-focus-info-card" key={title}>
                    <h3>{title}</h3>
                    <div className="course-focus-list">
                      {items.slice(0, 5).map((item) => (
                        <div key={item}>
                          <FaCheck />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <aside className="course-focus-offer">
              <div className="course-focus-image-wrap">
                <img
                  src={getCourseImage(data.thumbnail_url, data.slug)}
                  alt={data.title}
                  onError={(event) => useCourseImageError(event, data.slug)}
                />
                {loading && <span className="course-sync-pill">Syncing price</span>}
              </div>
              <div className="course-focus-price-row">
                <div>
                  <span>Program price</span>
                  <strong>₹{data.price.toLocaleString('en-IN')}</strong>
                  {data.original_price && (
                    <small>₹{Number(data.original_price).toLocaleString('en-IN')}</small>
                  )}
                </div>
                <button className="btn btn-primary" onClick={handleEnroll}>
                  <FaLock /> Enroll Now
                </button>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="course-related-strip">
        <div className="container">
          <div className="course-related-inline">
            {relatedCourses.map((course) => (
              <Link key={course.slug} to={`/courses/${course.slug}`} className="course-related-pill">
                <span>{course.category_name || 'Course'}</span>
                <strong>{course.title}</strong>
                <small>₹{Number(course.price).toLocaleString('en-IN')}</small>
                <em>
                  View <FaArrowRight />
                </em>
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
