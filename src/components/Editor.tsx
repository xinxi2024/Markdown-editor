import { useState, useEffect } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { saveAs } from 'file-saver';
import './Editor.css';

interface Heading {
  level: number;
  text: string;
  line: number;
}

const Editor = () => {
  const [value, setValue] = useState<string>(`# Markdown编辑器

欢迎使用Markdown编辑器！

## 基本功能

1. 支持标题 (# 到 ######)
2. 支持加粗 (**文本**) 和斜体 (*文本*)
3. 支持代码块 (\`\`\`)
4. 支持数学公式 (\$\$...\$\$)
5. 支持列表 (有序和无序)
6. 支持任务列表 (- [ ] 和 - [x])
7. 支持水平分割线 (---)
8. 支持图片插入 (![alt](url))

## 示例

### 代码块示例
\`\`\`javascript
console.log("Hello, World!");
\`\`\`

### 数学公式示例
\$\$
E = mc^2
\$\$

### 任务列表示例
- [x] 已完成任务
- [ ] 未完成任务
`);

  const [headings, setHeadings] = useState<Heading[]>([]);

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

  const handleExport = () => {
    const blob = new Blob([value], { type: 'text/markdown;charset=utf-8' });
    saveAs(blob, 'document.md');
  };

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
          <button className="navbar-button" onClick={handleExport}>
            导出
          </button>
        </div>
      </nav>
      <div className="main-content">
        <div className="editor-container">
          <MDEditor
            value={value}
            onChange={(val) => setValue(val || '')}
            preview="live"
            height="100%"
            hideToolbar={false}
            previewOptions={{
              showCodeRowNumbers: true,
              previewClass: "markdown-preview"
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
        <div className="outline-panel">
          <h2 className="outline-title">文档大纲</h2>
          <div className="outline-content">
            {headings.map((heading, index) => (
              <div
                key={index}
                className="outline-item"
                style={{ paddingLeft: `${heading.level * 12}px` }}
                onClick={() => {
                  const lines = value.split('\n');
                  const position = lines
                    .slice(0, heading.line)
                    .join('\n')
                    .length;
                  const textarea = document.querySelector('.w-md-editor-text-input') as HTMLTextAreaElement;
                  if (textarea) {
                    textarea.focus();
                    textarea.setSelectionRange(position, position);
                  }
                }}
              >
                {heading.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;