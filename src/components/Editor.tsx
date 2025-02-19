import { useState, useEffect, useCallback } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { saveAs } from 'file-saver';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import './Editor.css';

interface Heading {
  level: number;
  text: string;
  line: number;
}

interface MathProps {
  children: string;
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
  }, [value]);

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

  return (
    <div className="container">
      <nav className="navbar">
        <h1 className="navbar-title">Markdown文档编辑器</h1>
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
                }
              }
            }}
            components={{
              preview: (source) => {
                try {
                  return <MDEditor.Markdown source={source} />
                } catch (error) {
                  console.error('Markdown渲染错误:', error);
                  return <div className="error-message">内容渲染出错</div>
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
  );
};

export default Editor;