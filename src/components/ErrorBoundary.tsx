import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('错误详情:', error);
    console.error('错误堆栈:', errorInfo);
    this.setState({
      hasError: true,
      error,
      errorInfo
    });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '20px',
          textAlign: 'center',
          backgroundColor: '#fff3f3',
          borderRadius: '8px',
          margin: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: '#e74c3c', marginBottom: '10px' }}>抱歉，出现了一些问题</h2>
          <p style={{ color: '#666', marginBottom: '15px' }}>我们正在努力修复这个问题</p>
          {this.state.error && (
            <div style={{ 
              backgroundColor: '#fde8e8', 
              padding: '10px', 
              borderRadius: '4px',
              marginBottom: '15px',
              textAlign: 'left'
            }}>
              <p style={{ color: '#c53030', marginBottom: '5px' }}><strong>错误信息：</strong></p>
              <p style={{ color: '#742a2a', fontSize: '14px' }}>{this.state.error.message}</p>
            </div>
          )}
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '8px 16px',
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '10px',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2980b9'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3498db'}
          >
            刷新页面
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;