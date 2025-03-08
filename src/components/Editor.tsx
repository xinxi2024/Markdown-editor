import { useState, useEffect, useCallback } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { saveAs } from 'file-saver';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import './Editor.css';
import BackButton from './BackButton';
import MermaidRenderer from './MermaidRenderer';

interface Heading {
  level: number;
  text: string;
  line: number;
}

interface MathProps {
  children: string;
}

interface CodeProps {
  children: string;
  className?: string;
}

const Editor = () => {
  const [value, setValue] = useState<string>('# Markdown编辑器');
  const [showOutline, setShowOutline] = useState(false);
  const [headings, setHeadings] = useState<Heading[]>([]);

  // 处理快捷键
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.altKey) {
      switch (e.key.toLowerCase()) {
        case 'o': // 改为 Alt + O：显示/隐藏大纲
          e.preventDefault();
          setShowOutline(prev => !prev);
          break;
        
        case 'g': // Alt + G：插入甘特图
          e.preventDefault();
          const ganttTemplate = `\n\`\`\`mermaid
gantt
    title 项目计划
    dateFormat X
    axisFormat %d
    
    section 阶段1
    需求分析    :0, 10d
    设计        :10, 15d
    
    section 阶段2
    开发        :25, 20d
    测试        :45, 10d
\`\`\`\n`;
          setValue(prev => prev + ganttTemplate);
          break;
          
        case 's': // Alt + S：插入时序图
          e.preventDefault();
          const sequenceTemplate = `\n\`\`\`mermaid
sequenceDiagram
    participant 用户
    participant 系统
    用户->>系统: 登录请求
    系统-->>用户: 返回登录结果
    用户->>系统: 查询数据
    系统-->>用户: 返回数据
\`\`\`\n`;
          setValue(prev => prev + sequenceTemplate);
          break;
      }
    } else if (e.ctrlKey) {
      switch (e.key) {
        case 'b': // Ctrl + B：粗体
          e.preventDefault();
          document.execCommand('insertText', false, '****');
          // 光标移动到中间
          const selection = window.getSelection();
          if (selection) {
            const range = selection.getRangeAt(0);
            range.setStart(range.startContainer, range.startOffset - 2);
          }
          break;
        
        case 'i': // Ctrl + I：斜体
          e.preventDefault();
          document.execCommand('insertText', false, '**');
          break;

        case 't': // Ctrl + T：插入表格
          e.preventDefault();
          const rows = prompt('请输入表格行数：', '3');
          const cols = prompt('请输入表格列数：', '3');
          if (rows && cols) {
            const numRows = parseInt(rows);
            const numCols = parseInt(cols);
            let tableText = '\n';
            // 表头
            tableText += '|' + ' 表头 |'.repeat(numCols) + '\n';
            // 分隔线
            tableText += '|' + ' --- |'.repeat(numCols) + '\n';
            // 数据行
            for (let i = 0; i < numRows - 1; i++) {
              tableText += '|' + ' 内容 |'.repeat(numCols) + '\n';
            }
            setValue(prev => prev + tableText);
          }
          break;

        case 's': // Ctrl + S：保存
          e.preventDefault();
          const blob = new Blob([value], { type: 'text/markdown;charset=utf-8' });
          saveAs(blob, 'document.md');
          break;

        case 'm': // Ctrl + M：插入Mermaid流程图
          e.preventDefault();
          const mermaidTemplate = `\n\`\`\`mermaid
graph TD
    A[开始] --> B[处理]
    B --> C{判断}
    C -->|是| D[处理1]
    C -->|否| E[处理2]
    D --> F[结束]
    E --> F
\`\`\`\n`;
          setValue(prev => prev + mermaidTemplate);
          break;

        default:
          // 处理标题快捷键 Ctrl + 1~6
          if (e.key >= '1' && e.key <= '6') {
            e.preventDefault();
            const level = parseInt(e.key);
            const prefix = '#'.repeat(level) + ' ';
            setValue(prev => {
              const lines = prev.split('\n');
              const currentLine = lines[lines.length - 1];
              if (currentLine.startsWith('#')) {
                lines[lines.length - 1] = prefix + currentLine.replace(/^#+\s/, '');
              } else {
                lines[lines.length - 1] = prefix + currentLine;
              }
              return lines.join('\n');
            });
          }
      }
    } else if (e.ctrlKey && e.shiftKey) {
      switch (e.key) {
        case ']': // Ctrl + Shift + ]：无序列表
          e.preventDefault();
          setValue(prev => prev + '\n- ');
          break;

        case '[': // Ctrl + Shift + [：有序列表
          e.preventDefault();
          setValue(prev => prev + '\n1. ');
          break;

        case 'k': // Ctrl + Shift + K：代码块
          e.preventDefault();
          setValue(prev => prev + '\n```\n\n```');
          // 将光标移动到代码块中间
          const textarea = document.querySelector('.w-md-editor-text-input') as HTMLTextAreaElement;
          if (textarea) {
            const position = textarea.value.length - 4;
            textarea.setSelectionRange(position, position);
            textarea.focus();
          }
          break;
      }
    }
  }, [value, setShowOutline, setValue]);

  // 添加和移除事件监听器
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setValue(content);
      };
      reader.readAsText(file);
    }
  };

  useEffect(() => {
    const lines = value.split('\n');
    const newHeadings: Heading[] = [];
    
    lines.forEach((line, index) => {
      const match = line.match(/^(#{1,6})\s+(.+)$/);
      if (match) {
        newHeadings.push({
          level: match[1].length,
          text: match[2],
          line: index
        });
      }
    });
    
    setHeadings(newHeadings);
  }, [value]);

  // 自定义渲染函数，处理带有mermaid代码块的Markdown
  const customRender = (markdownText: string) => {
    try {
      // 正则表达式匹配```mermaid代码块
      const mermaidRegex = /```mermaid\s+([\s\S]*?)```/g;
      let match;
      let lastIndex = 0;
      const segments = [];

      // 查找所有mermaid代码块
      while ((match = mermaidRegex.exec(markdownText)) !== null) {
        // 添加代码块前的普通Markdown内容
        if (match.index > lastIndex) {
          const normalText = markdownText.substring(lastIndex, match.index);
          segments.push(
            <MDEditor.Markdown key={`text-${lastIndex}`} source={normalText} />
          );
        }

        // 添加Mermaid渲染内容
        const mermaidCode = match[1].trim();
        console.log("找到Mermaid代码:", mermaidCode);
        segments.push(
          <div key={`mermaid-${match.index}`} className="mermaid-block">
            <MermaidRenderer chart={mermaidCode} />
          </div>
        );

        lastIndex = match.index + match[0].length;
      }

      // 添加最后一部分普通Markdown内容
      if (lastIndex < markdownText.length) {
        const normalText = markdownText.substring(lastIndex);
        segments.push(
          <MDEditor.Markdown key={`text-${lastIndex}`} source={normalText} />
        );
      }

      // 如果没有找到mermaid代码块，直接渲染整个内容
      if (segments.length === 0) {
        return <MDEditor.Markdown source={markdownText} />;
      }

      return <div className="custom-markdown-preview">{segments}</div>;
    } catch (error) {
      console.error("自定义渲染错误:", error);
      // 出错时回退到默认渲染
      return <MDEditor.Markdown source={markdownText} />;
    }
  };

  return (
    <>
      <div className="container">
        <nav className="navbar">
          <div className="navbar-left">
            <BackButton />
          </div>
          <div className="navbar-buttons">
            <label className="navbar-button">
              导入
              <input
                type="file"
                accept=".md"
                style={{ display: 'none' }}
                onChange={handleImport}
              />
            </label>
            <button className="navbar-button" onClick={() => {
              const blob = new Blob([value], { type: 'text/markdown;charset=utf-8' });
              saveAs(blob, 'document.md');
            }}>
              导出
            </button>
            <button 
              className={`navbar-button ${showOutline ? 'active' : ''}`}
              onClick={() => setShowOutline(prev => !prev)}
              title="显示/隐藏大纲 (Alt+O)"
            >
              大纲
            </button>
            <button 
              className="navbar-button"
              onClick={() => {
                const mermaidTemplate = `\n\`\`\`mermaid
graph TD
    A[开始] --> B[处理]
    B --> C{判断}
    C -->|是| D[处理1]
    C -->|否| E[处理2]
    D --> F[结束]
    E --> F
\`\`\`\n`;
                setValue(prev => prev + mermaidTemplate);
              }}
              title="插入流程图 (Ctrl+M)"
            >
              流程图
            </button>
            <button 
              className="navbar-button"
              onClick={() => {
                const ganttTemplate = `\n\`\`\`mermaid
gantt
    title 项目计划
    dateFormat X
    axisFormat %d
    
    section 阶段1
    需求分析    :0, 10d
    设计        :10, 15d
    
    section 阶段2
    开发        :25, 20d
    测试        :45, 10d
\`\`\`\n`;
                setValue(prev => prev + ganttTemplate);
              }}
              title="插入甘特图 (Alt+G)"
            >
              甘特图
            </button>
            <button 
              className="navbar-button"
              onClick={() => {
                const sequenceTemplate = `\n\`\`\`mermaid
sequenceDiagram
    participant 用户
    participant 系统
    用户->>系统: 登录请求
    系统-->>用户: 返回登录结果
    用户->>系统: 查询数据
    系统-->>用户: 返回数据
\`\`\`\n`;
                setValue(prev => prev + sequenceTemplate);
              }}
              title="插入时序图 (Alt+S)"
            >
              时序图
            </button>
          </div>
        </nav>
        <div className={`main-content`}>
          <div className={`editor-container ${showOutline ? 'with-outline' : ''}`}>
            <MDEditor
              value={value}
              onChange={(val) => setValue(val || '')}
              preview="live"
              height="100%"
              hideToolbar={false}
              className={showOutline ? 'with-outline' : ''}
              previewOptions={{
                showCodeRowNumbers: true,
                previewClass: "markdown-preview",
                components: {
                  math: ({ children }: MathProps) => {
                    try {
                      return <div dangerouslySetInnerHTML={{ __html: katex.renderToString(children, { throwOnError: false }) }} />;
                    } catch (error) {
                      console.error('数学公式渲染错误:', error);
                      return <div className="error-message">公式渲染出错</div>;
                    }
                  },
                  code: ({ children, className }: CodeProps) => {
                    const language = className?.replace(/language-/, '');
                    
                    if (language === 'mermaid') {
                      console.log('发现代码块mermaid组件:', children);
                      try {
                        return <MermaidRenderer chart={children} />;
                      } catch (error) {
                        console.error('Mermaid组件错误:', error);
                        return <div className="error-message">流程图渲染出错: {String(error)}</div>;
                      }
                    }
                    
                    return <code className={className}>{children}</code>;
                  }
                }
              }}
              components={{
                preview: (source) => {
                  try {
                    // 使用自定义渲染逻辑
                    console.log('源代码长度:', source?.length);
                    
                    // 检查源码中是否包含mermaid代码块
                    if (source && source.includes('```mermaid')) {
                      console.log('检测到mermaid代码块，使用自定义渲染');
                      return customRender(source);
                    }
                    
                    // 没有mermaid代码块时使用默认渲染
                    return <MDEditor.Markdown source={source} />;
                  } catch (error) {
                    console.error('Markdown渲染错误:', error);
                    return <div className="error-message">内容渲染出错: {String(error)}</div>;
                  }
                }
              }}
              textareaProps={{
                placeholder: "在此输入Markdown文本..."
              }}
            />
          </div>
          {showOutline && (
            <div className="outline-panel">
              <h3 className="outline-title">文档大纲</h3>
              <div className="outline-content">
                {headings.map((heading, index) => (
                  <div
                    key={index}
                    className="outline-item"
                    style={{ paddingLeft: `${(heading.level - 1) * 20}px` }}
                    onClick={() => {
                      const lines = value.split('\n');
                      const position = lines.slice(0, heading.line).join('\n').length;
                      const textarea = document.querySelector('.w-md-editor-text-input') as HTMLTextAreaElement;
                      if (textarea) {
                        textarea.setSelectionRange(position, position);
                        textarea.focus();
                      }
                    }}
                  >
                    {heading.text}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Editor;
