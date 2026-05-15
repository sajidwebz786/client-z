import logoImage from '../assets/images/logo.png';

const LogoIcon = ({ size = 44, className = '' }) => {
  return (
    <span
      className={`logo-image-wrap logo-icon ${className}`.trim()}
      style={{ '--logo-size': `${size}px` }}
      aria-hidden="true"
    >
      <img src={logoImage} alt="" />
    </span>
  );
};

const Logo = ({ collapsed = false }) => {
  return (
    <div className={`logo-container ${collapsed ? 'is-collapsed' : ''}`}>
      <span className="logo-image-wrap">
        <img src={logoImage} alt="Zulanex" />
      </span>
    </div>
  );
};

export { LogoIcon };
export default Logo;
