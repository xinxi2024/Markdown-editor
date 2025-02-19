// 添加position属性的类型定义
interface LogoProps {
  position?: 'left-bottom' | 'right-bottom' | 'bottom-center';
}

const Logo = ({ position = 'left-bottom' }: LogoProps) => {
  return (
    <div className={`logo ${position}`}>
      <div className="logo-content">
        <span className="logo-text">
          <span className="logo-s">S</span>
          <span className="logo-rest">loaner</span>
        </span>
        <div className="logo-line"></div>
        <span className="logo-tagline">Code & Write</span>
      </div>
    </div>
  );
};

export default Logo; 