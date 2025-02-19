import './Docs.css';

const Docs = () => {
  return (
    <div className="docs-page">
      <div className="docs-header">
        <h1>Markdown 编辑器使用文档</h1>
      </div>
      <div className="docs-body">
        <section className="docs-section">
          <h2>简介</h2>
          <p>Markdown是一种轻量级标记语言，让您使用易读易写的纯文本格式编写文档。</p>
        </section>

        <section className="docs-section">
          <h2>快速入门</h2>
          <ol>
            <li>点击"开始使用"进入编辑器</li>
            <li>在编辑区域输入Markdown文本</li>
            <li>实时预览将在编辑器下方显示</li>
            <li>使用工具栏快速插入常用格式</li>
          </ol>
        </section>

        <section className="docs-section">
          <h2>基本功能</h2>
          <ul>
            <li>支持标题（# 到 ######）</li>
            <li>支持加粗（**文本**）和斜体（*文本*）</li>
            <li>支持代码块（```）</li>
            <li>支持数学公式（$$...$$）</li>
            <li>支持列表（有序和无序）</li>
            <li>支持任务列表（- [ ] 和 - [x]）</li>
            <li>支持水平分割线（---）</li>
            <li>支持图片插入（![alt](url)）</li>
          </ul>
        </section>

        <section className="docs-section">
          <h2>常用语法示例</h2>
          <div className="syntax-example">
            <h3>标题</h3>
            <pre><code># 一级标题
## 二级标题
### 三级标题</code></pre>
          </div>

          <div className="syntax-example">
            <h3>文本格式</h3>
            <pre><code>**粗体文本**
*斜体文本*
~~删除线~~
`行内代码`</code></pre>
          </div>

          <div className="syntax-example">
            <h3>列表</h3>
            <pre><code>- 无序列表项
1. 有序列表项
- [ ] 待办事项
- [x] 已完成事项</code></pre>
          </div>

          <div className="syntax-example">
            <h3>链接和图片</h3>
            <pre><code>[链接文本](https://example.com)
![图片描述](image.jpg)</code></pre>
          </div>

          <div className="syntax-example">
            <h3>引用和分割线</h3>
            <pre><code>&gt; 这是一段引用文本

---

&gt; 多级引用
&gt;&gt; 二级引用</code></pre>
          </div>

          <div className="syntax-example">
            <h3>表格</h3>
            <pre><code>| 表头1 | 表头2 |
| ----- | ----- |
| 内容1 | 内容2 |
| 内容3 | 内容4 |</code></pre>
          </div>

          <div className="syntax-example">
            <h3>代码</h3>
            <pre><code>```javascript
console.log("Hello World");
```

```python
print("Hello World")
```</code></pre>
          </div>

          <div className="syntax-example">
            <h3>数学公式</h3>
            <pre><code>行内公式：$E = mc^2$

块级公式：
$$
\\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}
$$</code></pre>
          </div>
        </section>

        <section className="docs-section">
          <h2>快捷键</h2>
          <ul>
            <li><strong>Ctrl + B</strong>：加粗文本</li>
            <li><strong>Ctrl + I</strong>：斜体文本</li>
            <li><strong>Ctrl + K</strong>：插入链接</li>
            <li><strong>Ctrl + Shift + O</strong>：切换大纲面板</li>
            <li><strong>Ctrl + S</strong>：保存文档</li>
            <li><strong>Ctrl + O</strong>：导入文档</li>
            <li><strong>Ctrl + E</strong>：导出文档</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default Docs;