import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaGraduationCap, FaBook, FaChalkboardTeacher, FaChartLine,
  FaStar, FaClock, FaUsers, FaPlay, FaArrowRight, FaCheck,
  FaQuoteLeft, FaChevronDown, FaLaptopCode, FaPython,
  FaBrain, FaCertificate, FaDollarSign,
  FaBriefcase, FaInfinity
} from 'react-icons/fa';
import api from '../api/axios';
import Logo from '../components/Logo';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import heroImage from '../assets/zulanex-student-pass.jpeg';
import { getCourseImage, sourceCourses, sourceTrainingSections, useCourseImageError } from '../data/sourceContent';


const categories = [
  { name: 'Python Full Stack', icon: FaPython, slug: 'industry-ready-courses', color: '#0072ce' },
  { name: 'Java Full Stack', icon: FaLaptopCode, slug: 'industry-ready-courses', color: '#00a3e0' },
  { name: 'Data Science & AI', icon: FaBrain, slug: 'industry-ready-courses', color: '#15c4e8' },
  { name: 'AI Implementation', icon: FaBrain, slug: 'ai-implementation', color: '#061b68' },
];

const features = [
  {
    icon: FaBriefcase,
    title: 'Live Projects',
    desc: 'Work on real-world industry projects that prepare you for actual job scenarios and build a strong portfolio.',
    img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400',
  },
  {
    icon: FaChalkboardTeacher,
    title: 'Expert Instructors',
    desc: 'Learn from industry professionals with years of hands-on experience in top tech companies.',
    img: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400',
  },
  {
    icon: FaGraduationCap,
    title: 'Placement Assistance',
    desc: 'Get dedicated placement support with resume building, mock interviews, and job referrals.',
    img: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400',
  },
  {
    icon: FaCertificate,
    title: 'Certificates',
    desc: 'Earn industry-recognized certificates upon successful completion of your training programs.',
    img: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400',
  },
  {
    icon: FaInfinity,
    title: 'Learn Anytime, Anywhere',
    desc: 'Learn with flexible access supported by live and recorded sessions.',
    img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400',
  },
  {
    icon: FaDollarSign,
    title: 'Affordable Pricing',
    desc: 'Quality education at competitive prices with flexible payment options and EMI available.',
    img: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400',
  },
];

const Home = () => {
  const [stats, setStats] = useState(null);
  const [courses, setCourses] = useState(sourceCourses);
  const [testimonials, setTestimonials] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [trainingPrograms, setTrainingPrograms] = useState([]);
  const [activeFaq, setActiveFaq] = useState(null);
  const [activeFaqTab, setActiveFaqTab] = useState('All');
  const [loading, setLoading] = useState(true);

  const trainingFaqs = [
    { question: 'What is included in the Trial Pass?', answer: 'The source material lists selected courses, limited live classes, skill assessments, community support, and a certificate of participation for the 7-day Trial Pass.', tag: 'Trial Pass' },
    { question: 'What is included in Career Boost?', answer: 'Career Boost includes trending tech courses, resume building support, mock interviews, internship projects, placement training, dedicated support, certificates, and community access.', tag: 'Career Boost' },
    { question: 'What is included in Elite Success Pro?', answer: 'Elite Success Pro includes 1:1 mentorship, live domain projects, portfolio building, HR interview mastery, a global job-ready program, and priority support.', tag: 'Elite Success Pro' },
    { question: 'Does Zulanex include project internships?', answer: 'Yes. The PDF describes live domain specific project internships, project documents, task list plans, intern ID card, internship certificate, and reviewed project work.', tag: 'Internship' },
    { question: 'Which learning support is shown in the source files?', answer: 'The source files mention expert mentors, one-to-one guidance, live and recorded sessions, certificate courses, placement support, mock tests, resume/profile building, and community support.', tag: 'All' },
  ];

  const filteredFaqs = activeFaqTab === 'All'
    ? trainingFaqs
    : trainingFaqs.filter(f => f.tag === 'All' || activeFaqTab.includes(f.tag));
  const passProgramTitles = ['Trial Pass', 'Career Boost', 'Elite Success Pro'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, coursesRes, testimonialsRes, faqsRes, programsRes] = await Promise.allSettled([
          api.get('/courses/meta/stats'),
          api.get('/courses?featured=true'),
          api.get('/courses/meta/testimonials'),
          api.get('/courses/meta/faqs'),
          api.get('/training-programs'),
        ]);

        if (statsRes.status === 'fulfilled') {
          const statsArr = statsRes.value.data.stats || [];
          const statsObj = {};
          statsArr.forEach(s => {
            const key = s.label.toLowerCase().replace(/\s+/g, '');
            if (key.includes('student')) statsObj.totalStudents = s.value + (s.suffix || '');
            if (key.includes('course')) statsObj.totalCourses = s.value + (s.suffix || '');
            if (key.includes('instructor')) statsObj.totalInstructors = s.value + (s.suffix || '');
            if (key.includes('placement')) statsObj.placementRate = s.value + (s.suffix || '');
          });
          setStats(statsObj);
        }
        if (coursesRes.status === 'fulfilled') {
          const supportedSlugs = new Set(sourceCourses.map((course) => course.slug));
          const supportedCourses = (coursesRes.value.data.courses || []).filter((course) => supportedSlugs.has(course.slug));
          if (supportedCourses.length > 0) setCourses(supportedCourses);
        }
        if (testimonialsRes.status === 'fulfilled') setTestimonials(testimonialsRes.value.data.testimonials || []);
        if (faqsRes.status === 'fulfilled') setFaqs(faqsRes.value.data.faqs || []);
        if (programsRes.status === 'fulfilled') setTrainingPrograms(programsRes.value.data.programs || []);
      } catch (err) {
        console.error('Failed to fetch home data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const statsData = stats ? [
    { icon: FaGraduationCap, value: '1 Crore', label: 'Learners' },
    { icon: FaBook, value: '100+', label: 'Top MNCs' },
    { icon: FaChalkboardTeacher, value: '300+', label: 'Training Experts' },
    { icon: FaChartLine, value: '2500+', label: 'Start Ups' },
  ] : [];

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading-screen" style={{ minHeight: '100vh', paddingTop: '80px' }}>
          <div className="spinner"></div>
          <p style={{ color: 'var(--text-muted)' }}>Loading amazing content...</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <section className="hero-section">
        <div className="hero-bg-shapes">
          <div className="shape shape-1" style={{ animation: 'float 6s ease-in-out infinite' }}></div>
          <div className="shape shape-2" style={{ animation: 'float 8s ease-in-out infinite 1s' }}></div>
          <div className="shape" style={{ width: '200px', height: '200px', background: 'var(--blue-500)', top: '40%', left: '15%', position: 'absolute', borderRadius: '50%', filter: 'blur(80px)', opacity: '0.2', animation: 'float 7s ease-in-out infinite 0.5s' }}></div>
        </div>

        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'center' }}>
            <div className="hero-content" style={{ animation: 'fadeInUp 0.8s ease' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, rgba(5,7,13,0.94), rgba(6,27,104,0.92))', padding: '7px 16px', borderRadius: 'var(--radius-full)', marginBottom: '16px', border: '1px solid rgba(120,222,242,0.5)', boxShadow: '0 12px 30px rgba(0,0,0,0.32), 0 0 0 1px rgba(255,255,255,0.05)' }}>
                <FaPlay style={{ color: 'var(--green-300)', fontSize: '0.6rem' }} />
                <span style={{ color: '#ffffff', fontSize: '0.8rem', fontWeight: 700 }}>Trial Pass &bull; Career Boost &bull; Elite Success Pro</span>
              </div>
              <h1 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.8rem)' }}>
                Learn Skills. Get Job Ready.{' '}
                <span className="gradient-text">Grow Career.</span>
              </h1>
              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                Affordable, practical, job-focused learning for rural and urban students with AI implementation,
                live domain projects, mentorship, resume building, mock interviews, and placement support.
              </p>
              <div className="hero-buttons">
                <Link to="/courses" className="btn btn-primary btn-lg">
                  Explore Courses <FaArrowRight />
                </Link>
                <Link to="/register" className="btn btn-secondary btn-lg">
                  Enroll Now <FaPlay />
                </Link>
              </div>
            </div>
            <div className="hero-image" style={{ animation: 'fadeInUp 0.8s ease 0.2s both' }}>
              <div style={{ position: 'relative', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
                <img
                  src={heroImage}
                  alt="Zulanex Student Pass"
                  style={{ width: '100%', height: '420px', objectFit: 'cover', objectPosition: 'top' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(25,118,210,0.3) 0%, rgba(0,200,83,0.2) 100%)' }}></div>
                <div style={{ position: 'absolute', bottom: '24px', left: '24px', right: '24px' }} className="glass" >
                  <div style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Zulanex Student Pass</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Trial &bull; Career Boost &bull; Elite</div>
                    </div>
                    <Link to="/courses" className="btn btn-primary btn-sm">Explore</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="container">
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

      <section className="section">
        <div className="container">
          <div className="section-title">
            <h2>Featured <span className="gradient-text">Courses</span></h2>
              <p>Explore Zulanex passes and job-ready learning drawn from the source materials</p>
          </div>
          <div className="grid grid-3">
            {courses.map((course, i) => (
              <div key={course.id || i} className="course-card" style={{ animation: `fadeInUp 0.6s ease ${i * 0.1}s both` }}>
                <div className="card-image">
                  <img
                    src={getCourseImage(course.thumbnail_url, course.slug)}
                    alt={course.title}
                    onError={(event) => useCourseImageError(event, course.slug)}
                  />
                  <div className="card-badge">{course.category_name || 'Featured'}</div>
                </div>
                <div className="card-body">
                  <div className="card-category">{course.category_name}</div>
                  <h4 className="card-title">
                    <Link to={`/courses/${course.slug}`}>{course.title}</Link>
                  </h4>
                  <p className="card-description">{course.short_description}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ffd54f', fontSize: '0.85rem' }}>
                      <FaStar /> {course.rating || '4.8'}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      <FaClock /> {course.duration || ''}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      <FaUsers /> Zulanex learners
                    </span>
                  </div>
                  <div className="card-meta">
                    <div className="card-price">
                      {course.price ? `₹${Number(course.price).toLocaleString('en-IN')}` : '₹14,999'}
                      {course.original_price && (
                        <span className="original">₹{Number(course.original_price).toLocaleString('en-IN')}</span>
                      )}
                    </div>
                    <Link to={`/courses/${course.slug}`} className="btn btn-primary btn-sm">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <Link to="/courses" className="btn btn-outline">
              View All Courses <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="section-title">
            <h2>Explore <span className="gradient-text">Categories</span></h2>
              <p>Categories below are only the ones visible in the source PDF and image</p>
          </div>
          <div className="grid grid-4">
            {categories.map((cat, i) => (
              <Link
                key={`${cat.slug}-${cat.name}`}
                to={`/courses?category=${cat.slug}`}
                className="card"
                style={{
                  padding: '32px 24px',
                  textAlign: 'center',
                  textDecoration: 'none',
                  animation: `fadeInUp 0.6s ease ${i * 0.1}s both`,
                }}
              >
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: 'var(--radius-lg)',
                  background: `${cat.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  fontSize: '1.5rem',
                  color: cat.color,
                }}>
                  <cat.icon />
                </div>
                <h4 style={{ marginBottom: '8px' }}>{cat.name}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Explore {cat.name} courses
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-title">
            <h2>Why <span className="gradient-text">Zulanex</span>?</h2>
            <p>We provide everything you need to succeed in your tech career</p>
          </div>
          <div className="grid grid-3">
            {features.map((feature, i) => (
              <div
                key={i}
                className="card"
                style={{
                  overflow: 'hidden',
                  animation: `fadeInUp 0.6s ease ${i * 0.1}s both`,
                }}
              >
                <div style={{ height: '160px', overflow: 'hidden', position: 'relative' }}>
                  <img
                    src={feature.img}
                    alt={feature.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, transparent 40%, var(--bg-card) 100%)',
                  }}></div>
                </div>
                <div style={{ padding: '24px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(25,118,210,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--blue-400)',
                    fontSize: '1.2rem',
                    marginBottom: '16px',
                    marginTop: '-40px',
                    position: 'relative',
                    border: '2px solid rgba(25,118,210,0.2)',
                  }}>
                    <feature.icon />
                  </div>
                  <h4 style={{ marginBottom: '8px' }}>{feature.title}</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
          {sourceTrainingSections.map((section) => (
            <div key={section.slug} style={{ marginTop: 36 }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 16,
                flexWrap: 'wrap',
                marginBottom: 18,
                padding: '18px 20px',
                borderRadius: 'var(--radius-lg)',
                background: 'linear-gradient(135deg, rgba(6,27,104,0.92), rgba(0,114,206,0.88), rgba(21,196,232,0.72))',
                border: '1px solid rgba(120,222,242,0.35)',
                boxShadow: '0 16px 42px rgba(0,114,206,0.16)',
              }}>
                <div>
                  <h3 style={{ color: '#fff', marginBottom: 4, fontSize: '1.15rem' }}>{section.title}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.84)', margin: 0, fontSize: '0.9rem' }}>{section.description}</p>
                </div>
                <span style={{
                  color: '#061b68',
                  background: '#ffffff',
                  borderRadius: 'var(--radius-full)',
                  padding: '6px 12px',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                }}>
                  {section.items.length} Tracks
                </span>
              </div>
              <div className="grid grid-4">
                {section.items.map((item, i) => (
                  <div key={item} className="card source-topic-card" style={{
                    padding: '18px',
                    minHeight: 92,
                    display: 'flex',
                    alignItems: 'center',
                    borderColor: 'rgba(0,163,224,0.18)',
                    background: 'linear-gradient(145deg, var(--bg-card) 0%, rgba(6,27,104,0.18) 100%)',
                    animation: `fadeInUp 0.6s ease ${i * 0.03}s both`,
                  }}>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
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
              {testimonials.map((t, i) => (
                <div key={t.id || i} className="testimonial-card" style={{ animation: `fadeInUp 0.6s ease ${i * 0.1}s both` }}>
                  <FaQuoteLeft style={{ color: 'var(--blue-400)', fontSize: '1.5rem', marginBottom: '16px', opacity: 0.5 }} />
                  <div className="stars">
                    {[...Array(5)].map((_, j) => (
                      <FaStar key={j} style={{ color: j < (t.rating || 5) ? '#ffd54f' : 'rgba(255,255,255,0.1)' }} />
                    ))}
                  </div>
                  <p className="quote">&ldquo;{t.content}&rdquo;</p>
                  <div className="author">
                    <img src={t.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name || 'Student')}&background=1976d2&color=fff`} alt={t.name} />
                    <div className="author-info">
                      <h5>{t.name}</h5>
                      <p>{t.role}{t.company ? ` at ${t.company}` : ''}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Training Programs Comparison */}
      <section className="section">
        <div className="container">
          <div className="section-title">
            <h2>Our <span className="gradient-text">Training Programs</span></h2>
            <p>Choose the program that fits your career goals and time commitment</p>
          </div>
          <div className="grid grid-3">
            {trainingPrograms
              .filter((program) => passProgramTitles.includes(program.title))
              .map((program, i) => (
              <div
                key={program.id || i}
                style={{
                  background: 'var(--gradient-card)',
                  borderRadius: 'var(--radius-xl)',
                  border: `2px solid ${program.is_popular ? program.color : 'rgba(255,255,255,0.06)'}`,
                  padding: '32px 28px',
                  position: 'relative',
                  overflow: 'hidden',
                  animation: `fadeInUp 0.6s ease ${i * 0.15}s both`,
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = `0 12px 40px ${program.color}40`; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                {program.is_popular && (
                  <div style={{
                    position: 'absolute', top: '16px', right: '-28px',
                    background: program.color, color: '#0a1628',
                    padding: '4px 40px', fontSize: '0.7rem', fontWeight: 700,
                    transform: 'rotate(45deg)', letterSpacing: '1px',
                  }}>
                    POPULAR
                  </div>
                )}
                <div style={{
                  width: '56px', height: '56px', borderRadius: '16px',
                  background: `${program.color}15`, display: 'flex',
                  alignItems: 'center', justifyContent: 'center', marginBottom: '20px',
                }}>
                  <FaGraduationCap style={{ color: program.color, fontSize: '1.5rem' }} />
                </div>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '4px' }}>{program.title}</h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '2rem', fontWeight: 800, color: program.color }}>{program.duration}</span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '24px' }}>{program.tagline}</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
                  {(program.features || []).map((f, j) => (
                    <li key={j} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      <FaCheck style={{ color: program.color, fontSize: '0.75rem', flexShrink: 0 }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/courses" className={`btn ${program.is_popular ? 'btn-primary' : 'btn-secondary'}`} style={{ width: '100%' }}>
                  View Courses <FaArrowRight />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="section faq-section">
        <div className="container">
          <div className="section-title">
            <h2>Frequently Asked <span className="gradient-text">Questions</span></h2>
            <p>Find answers about our training programs</p>
          </div>
          <div className="tabs" style={{ justifyContent: 'center', marginBottom: '32px' }}>
            {['All', 'Trial Pass', 'Career Boost', 'Elite Success Pro', 'Internship'].map(tab => (
              <button
                key={tab}
                className={`tab ${activeFaqTab === tab ? 'active' : ''}`}
                onClick={() => { setActiveFaqTab(tab); setActiveFaq(null); }}
              >
                {tab}
              </button>
            ))}
          </div>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {filteredFaqs.map((faq, i) => (
              <div
                key={i}
                className={`faq-item ${activeFaq === i ? 'active' : ''}`}
                style={{ animation: `fadeInUp 0.6s ease ${i * 0.05}s both` }}
              >
                <div className="faq-question" onClick={() => toggleFaq(i)}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {faq.tag && (
                      <span style={{
                        background: faq.tag === 'Trial Pass' ? 'rgba(0,114,206,0.16)' : faq.tag === 'Career Boost' ? 'rgba(0,163,224,0.18)' : 'rgba(6,27,104,0.16)',
                        color: faq.tag === 'Trial Pass' ? 'var(--blue-400)' : faq.tag === 'Career Boost' ? 'var(--green-400)' : 'var(--blue-300)',
                        padding: '2px 10px', borderRadius: 'var(--radius-full)',
                        fontSize: '0.7rem', fontWeight: 600, whiteSpace: 'nowrap',
                      }}>
                        {faq.tag}
                      </span>
                    )}
                    {faq.question}
                  </span>
                  <FaChevronDown style={{
                    transition: 'transform 0.3s ease',
                    transform: activeFaq === i ? 'rotate(180deg)' : 'rotate(0)',
                    color: 'var(--blue-400)', flexShrink: 0,
                  }} />
                </div>
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

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
          <h2 style={{ marginBottom: '16px' }}>
            Ready to Start Your <span className="gradient-text">Journey</span>?
          </h2>
          <p style={{ fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 32px', color: 'var(--text-secondary)' }}>
            Join Zulanex today and transform your career with real learning, real projects, and real job-ready skills.
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

export default Home;
