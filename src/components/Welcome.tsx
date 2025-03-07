import { useNavigate } from 'react-router-dom';
import { useState, useCallback, useEffect } from 'react';
import MermaidRenderer from './MermaidRenderer';

const Welcome = () => {
    const navigate = useNavigate();
    const [showLogo, setShowLogo] = useState(false);
    const [clickCount, setClickCount] = useState(0);
    const [lastClickTime, setLastClickTime] = useState(0);
    const [showFeatures, setShowFeatures] = useState(false);

    // 处理标题点击
    const handleTitleClick = useCallback(() => {
        const currentTime = Date.now();
        
        // 检查是否是快速点击（500ms内）
        if (currentTime - lastClickTime < 500) {
            setClickCount(prev => prev + 1);
            // 连续点击3次显示Logo
            if (clickCount >= 2) {
                setShowLogo(true);
                setClickCount(0);
            }
        } else {
            setClickCount(1);
        }
        
        setLastClickTime(currentTime);
    }, [clickCount, lastClickTime]);

    // 处理键盘组合键
    const handleKeyPress = useCallback((e: KeyboardEvent) => {
        // Alt + S 组合键
        if (e.altKey && e.key.toLowerCase() === 's') {
            setShowLogo(true);
        }
        // Esc 键隐藏
        if (e.key === 'Escape') {
            setShowLogo(false);
        }
    }, []);

    // 添加键盘监听
    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [handleKeyPress]);

    // 在组件顶部添加样式
    const styleSheet = document.createElement("style");
    styleSheet.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px) scale(0.8);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }

    .logo-container:hover {
        transform: translateY(-5px);
        box-shadow: 0 6px 20px rgba(44, 62, 80, 0.15), 0 10px 40px rgba(52, 152, 219, 0.2);
        transition: all 0.3s ease;
    }

    .features-container {
        margin-top: 30px;
        padding: 20px;
        background-color: #f8f9fa;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        animation: fadeIn 0.5s ease-out;
    }

    .features-title {
        text-align: center;
        margin-bottom: 20px;
        color: #2c3e50;
    }

    .feature-item {
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        color: #2c3e50;
    }

    .feature-item:before {
        content: "✓";
        color: #2ecc71;
        font-weight: bold;
        margin-right: 10px;
    }

    .mermaid-example {
        margin-top: 20px;
        padding: 15px;
        background-color: white;
        border-radius: 6px;
        box-shadow: 0 1px 5px rgba(0, 0, 0, 0.05);
    }

    .mermaid-title {
        font-size: 18px;
        margin-bottom: 10px;
        color: #3498db;
    }
    `;
    document.head.appendChild(styleSheet);

    const simpleMermaidExample = `graph TD
    A[开始] --> B[处理]
    B --> C{判断}
    C -->|是| D[处理1]
    C -->|否| E[处理2]
    D --> F[结束]
    E --> F`;

    return (
        <div className="welcome-container">
            <div className="welcome-content">
                <h1 
                    onClick={handleTitleClick}
                    className="welcome-title" // 添加类名用于样式
                >
                    欢迎使用 Markdown 编辑器
                </h1>
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

                <button 
                    style={{
                        marginTop: '30px',
                        padding: '8px 15px',
                        backgroundColor: '#3498db',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s'
                    }}
                    onClick={() => setShowFeatures(!showFeatures)}
                >
                    {showFeatures ? '隐藏新功能' : '查看新功能'}
                </button>

                {showFeatures && (
                    <div className="features-container">
                        <h2 className="features-title">新增功能：Mermaid流程图、时序图、甘特图等</h2>
                        <div className="feature-item">支持流程图、时序图、甘特图等多种图表</div>
                        <div className="feature-item">使用简单的文本语法创建专业图表</div>
                        <div className="feature-item">实时预览，所见即所得</div>
                        <div className="feature-item">快捷键 Ctrl+M 快速插入流程图模板</div>
                        
                        <div className="mermaid-example">
                            <div className="mermaid-title">流程图示例：</div>
                            <MermaidRenderer chart={simpleMermaidExample} />
                        </div>
                    </div>
                )}
            </div>
            {/* 添加隐藏的Logo触发区域 */}
            <div 
                className="logo-trigger"
                onMouseEnter={() => setShowLogo(true)}
                onMouseLeave={() => setShowLogo(false)}
            >
                {showLogo && (
                    <div style={{
                        position: 'fixed',
                        bottom: '20px',
                        right: '20px',
                        background: 'rgba(255, 255, 255, 0.95)',
                        padding: '15px 25px',
                        borderRadius: '12px',
                        boxShadow: '0 4px 15px rgba(44, 62, 80, 0.1), 0 8px 30px rgba(52, 152, 219, 0.1)',
                        backdropFilter: 'blur(10px)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '8px',
                        animation: 'fadeIn 0.5s ease-out',
                        zIndex: 1000,
                        cursor: 'default'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px'
                        }}>
                            <span style={{
                                background: 'linear-gradient(135deg, #2c3e50, #3498db)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                fontSize: '32px',
                                fontWeight: 800,
                                fontStyle: 'italic',
                                textShadow: '2px 2px 4px rgba(44, 62, 80, 0.2)',
                                fontFamily: "'Playfair Display', serif"
                            }}>S</span>
                            <span style={{
                                background: 'linear-gradient(135deg, #34495e, #2980b9)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                fontSize: '28px',
                                fontWeight: 600,
                                letterSpacing: '3px',
                                fontFamily: "'Playfair Display', serif"
                            }}>loaner</span>
                        </div>
                        <div style={{
                            width: '100%',
                            height: '2px',
                            background: 'linear-gradient(90deg, transparent, #3498db, #2ecc71, #3498db, transparent)',
                            margin: '5px 0'
                        }} />
                        <div style={{
                            color: '#7f8c8d',
                            fontSize: '14px',
                            fontStyle: 'italic',
                            letterSpacing: '1px',
                            fontFamily: "'Cormorant Garamond', serif",
                            textAlign: 'center'
                        }}>
                            This project is provided by
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Welcome;
