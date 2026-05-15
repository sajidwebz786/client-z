import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaYoutube, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import Logo from './Logo';

const Footer = () => {
  const quickLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About Us' },
    { to: '/courses', label: 'Courses' },
    { to: '/contact', label: 'Contact' },
    { to: '/lms', label: 'LMS Portal' },
    { to: '/privacy', label: 'Privacy Policy' },
  ];

  const courses = [
    { to: '/courses/trial-pass', label: 'Trial Pass' },
    { to: '/courses/career-boost', label: 'Career Boost' },
    { to: '/courses/elite-success-pro', label: 'Elite Success Pro' },
    { to: '/courses/ai-job-ready-bootcamp', label: 'AI Job Ready Bootcamp' },
    { to: '/courses?category=industry-ready-courses', label: 'Industry-Ready Courses' },
    { to: '/courses?category=live-domain-projects', label: 'Live Domain Projects' },
  ];

  const socialLinks = [
    { icon: FaFacebook, href: '#', label: 'Facebook' },
    { icon: FaTwitter, href: '#', label: 'Twitter' },
    { icon: FaLinkedin, href: '#', label: 'LinkedIn' },
    { icon: FaInstagram, href: '#', label: 'Instagram' },
    { icon: FaYoutube, href: '#', label: 'YouTube' },
  ];

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Logo />
            <p>
              Affordable, practical, job-focused learning with real projects, certificates,
              mentoring, and placement support.
            </p>
            <div className="footer-social">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.icon />
                </a>
              ))}
            </div>
          </div>

          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h4>Courses</h4>
            <ul>
              {courses.map((course) => (
                <li key={course.to}>
                  <Link to={course.to}>{course.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h4>Contact Info</h4>
            <ul>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <FaMapMarkerAlt style={{ color: 'var(--blue-400)', marginTop: '4px', flexShrink: 0 }} />
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Online learning for rural and urban students
                </span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FaPhone style={{ color: 'var(--blue-400)', flexShrink: 0 }} />
                <a href="tel:+919381556648" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  +91 93815 56648
                </a>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FaEnvelope style={{ color: 'var(--blue-400)', flexShrink: 0 }} />
                <a href="mailto:info@zulanex.com" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  info@zulanex.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Zulanex. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
