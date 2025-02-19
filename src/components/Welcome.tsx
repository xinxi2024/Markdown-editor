import { useNavigate } from 'react-router-dom';

const Welcome = () => {
    const navigate = useNavigate();

    return (
        <div className="welcome-container">
            <div className="welcome-content">
                <h1>欢迎使用 Markdown 编辑器</h1>
                {/* p标签居中 并且与按钮相隔固定距离*/}
                <p style={{ textAlign: "center", marginBottom: "20px"}}>一个简单、强大的 Markdown 文档编辑工具</p>
                <div
                    className="welcome-buttons"
                    style={{ display: "flex", justifyContent: "center", gap: "50px" }}
                >
                    <button
                        className="welcome-button docs-button"
                        onClick={() => navigate('/docs')}
                    >
                        使用文档
                    </button>
                    <button
                        className="welcome-button editor-button"
                        onClick={() => navigate('/editor')}
                    >
                        开始使用
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Welcome;
