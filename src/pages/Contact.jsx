import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaPhone, FaWhatsapp, FaEnvelope,
  FaPaperPlane, FaHome, FaChevronRight, FaChevronDown,
  FaStar, FaQuoteLeft
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const contactInfo = [
  {
    icon: FaPhone,
    title: 'Call / WhatsApp',
    detail: '+91 93815 56648',
    link: 'tel:+919381556648',
  },
  {
    icon: FaWhatsapp,
    title: 'WhatsApp',
    detail: '9381556648',
    link: 'https://wa.me/919381556648',
  },
  {
    icon: FaEnvelope,
    title: 'Email',
    detail: 'info@zulanex.com',
    link: 'mailto:info@zulanex.com',
  },
];

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [faqs, setFaqs] = useState([]);
  const [activeFaq, setActiveFaq] = useState(null);
  const [loadingFaqs, setLoadingFaqs] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await api.get('/courses/meta/faqs');
        setFaqs(res.data.data || res.data);
      } catch (err) {
        console.error('Failed to fetch FAQs', err);
      } finally {
        setLoadingFaqs(false);
      }
    };
    fetchFaqs();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/contact', formData);
      toast.success('Message sent successfully! We will get back to you soon.');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

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
            <span style={{ color: 'var(--blue-400)', fontSize: '0.9rem', fontWeight: 500 }}>Contact Us</span>
          </div>
          <h1 style={{ marginBottom: '12px', animation: 'fadeInUp 0.8s ease' }}>
            Contact <span className="gradient-text">Us</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', animation: 'fadeInUp 0.8s ease 0.2s both' }}>
            Have questions? We would love to hear from you. Send us a message and we will respond as soon as possible.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="contact-grid">
            <div style={{ animation: 'fadeInUp 0.8s ease' }}>
              <h2 style={{ marginBottom: '8px' }}>Get in <span className="gradient-text">Touch</span></h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '0.95rem' }}>
                Fill out the form below and our team will get back to you within 24 hours.
              </p>
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="form-control"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="form-control"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className="form-control"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="subject">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      className="form-control"
                      placeholder="What is this about?"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    className="form-control"
                    placeholder="Write your message here..."
                    rows="6"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  disabled={submitting}
                  style={{ width: '100%' }}
                >
                  {submitting ? (
                    <>
                      <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane /> Send Message
                    </>
                  )}
                </button>
              </form>
            </div>

            <div style={{ animation: 'fadeInUp 0.8s ease 0.2s both' }}>
              <h2 style={{ marginBottom: '8px' }}>Contact <span className="gradient-text">Information</span></h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '0.95rem' }}>
                Reach out to us through any of the following channels.
              </p>
              {contactInfo.map((info, i) => (
                <a
                  key={i}
                  href={info.link}
                  className="contact-info-card"
                  style={{ textDecoration: 'none', animation: `fadeInUp 0.6s ease ${i * 0.1}s both` }}
                >
                  <div className="icon">
                    <info.icon />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', marginBottom: '4px', color: 'var(--text-primary)' }}>{info.title}</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>{info.detail}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {faqs.length > 0 && (
        <section className="section faq-section" style={{ background: 'var(--bg-secondary)' }}>
          <div className="container">
            <div className="section-title">
              <h2>Frequently Asked <span className="gradient-text">Questions</span></h2>
              <p>Find answers to common questions about our programs</p>
            </div>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              {faqs.map((faq, i) => (
                <div
                  key={faq._id || i}
                  className={`faq-item ${activeFaq === i ? 'active' : ''}`}
                  style={{ animation: `fadeInUp 0.6s ease ${i * 0.05}s both` }}
                >
                  <div className="faq-question" onClick={() => toggleFaq(i)}>
                    <span>{faq.question}</span>
                    <FaChevronDown
                      style={{
                        transition: 'transform 0.3s ease',
                        transform: activeFaq === i ? 'rotate(180deg)' : 'rotate(0)',
                        color: 'var(--blue-400)',
                        flexShrink: 0,
                      }}
                    />
                  </div>
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </>
  );
};

export default Contact;
