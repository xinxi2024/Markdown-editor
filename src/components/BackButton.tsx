import { useNavigate } from 'react-router-dom';
import './BackButton.css';

const BackButton = () => {
    const navigate = useNavigate();

    return (
        <button 
            className="back-button"
            onClick={() => navigate('/')}
            title="返回首页"
        >
            <svg 
                viewBox="0 0 24 24" 
                width="24" 
                height="24" 
                stroke="currentColor" 
                strokeWidth="2" 
                fill="none"
            >
                <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span>返回</span>
        </button>
    );
};

export default BackButton;
