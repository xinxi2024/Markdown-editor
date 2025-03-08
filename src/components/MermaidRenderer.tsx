import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

interface MermaidRendererProps {
  chart: string;
}

const MermaidRenderer: React.FC<MermaidRendererProps> = ({ chart }) => {
  const mermaidRef = useRef<HTMLDivElement>(null);
  const [renderAttempt, setRenderAttempt] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 清除之前的错误
    setError(null);

    // 如果图表内容为空，则不进行渲染
    if (!chart || chart.trim() === '') {
      if (mermaidRef.current) {
        mermaidRef.current.innerHTML = '<div class="error-message">流程图内容为空</div>';
      }
      return;
    }

    // 判断图表类型
    const isGantt = chart.trim().startsWith('gantt');
    
    try {
      // 预处理甘特图，确保使用简化格式
      let processedChart = chart.trim();
      
      if (isGantt) {
        // 确保甘特图使用简化的日期格式
        if (!processedChart.includes('dateFormat X')) {
          processedChart = processedChart.replace(/dateFormat\s+[^\n]+/, 'dateFormat X');
          processedChart = processedChart.replace(/axisFormat\s+[^\n]+/, 'axisFormat %d');
        }
        
        // 确保甘特图有足够的宽度配置
        if (!processedChart.includes('ganttConfig')) {
          processedChart = processedChart.replace('gantt', 'gantt\n    ganttConfig {\n      barGap: 20,\n      barHeight: 30,\n      fontSize: 14\n    }');
        }
      } else {
        // 非甘特图去除分号
        processedChart = processedChart.replace(/;/g, '');
      }
      
      console.log('预处理后的图表:', processedChart);
      
      // 初始化Mermaid配置
      mermaid.initialize({
        startOnLoad: false,
        theme: 'default',
        securityLevel: 'loose',
        fontFamily: 'monospace',
        logLevel: 'error',
        flowchart: {
          htmlLabels: true,
          curve: 'linear'
        },
        gantt: {
          titleTopMargin: 25,
          barHeight: 30,
          barGap: 20,
          topPadding: 50,
          leftPadding: 75,
          gridLineStartPadding: 35,
          fontSize: 14,
          numberSectionStyles: 4
        }
      });
      
      // 清除容器内容
      if (mermaidRef.current) {
        mermaidRef.current.innerHTML = '';
        
        // 为甘特图设置特殊样式
        if (isGantt) {
          mermaidRef.current.style.minHeight = '300px';
          mermaidRef.current.style.minWidth = '100%';
          mermaidRef.current.style.overflow = 'auto';
        }
      }
      
      // 特殊处理甘特图
      if (isGantt && renderAttempt > 0) {
        // 提供备用显示
        createFallbackGanttChart(processedChart);
        return;
      }
      
      // 生成唯一ID
      const id = `mermaid-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      // 尝试渲染
      try {
        mermaid.render(id, processedChart)
          .then(({ svg }) => {
            console.log('渲染成功');
            if (mermaidRef.current) {
              mermaidRef.current.innerHTML = svg;
              
              // 调整SVG尺寸
              const svgElement = mermaidRef.current.querySelector('svg');
              if (svgElement) {
                svgElement.style.width = '100%';
                svgElement.style.maxWidth = '100%';
                svgElement.style.height = 'auto';
                svgElement.style.minHeight = isGantt ? '300px' : 'auto';
                
                // 修复甘特图中的文本颜色
                if (isGantt) {
                  const texts = svgElement.querySelectorAll('text');
                  texts.forEach(text => {
                    if (!text.getAttribute('fill') || text.getAttribute('fill') === 'undefined') {
                      text.setAttribute('fill', '#333');
                    }
                  });
                }
              }
            }
          })
          .catch(error => {
            console.error('渲染错误:', error);
            
            // 渲染失败时重试一次，使用备用方案
            if (renderAttempt === 0) {
              setRenderAttempt(1);
            } else {
              createFallbackGanttChart(processedChart);
            }
          });
      } catch (error) {
        console.error('渲染过程错误:', error);
        if (isGantt) {
          createFallbackGanttChart(processedChart);
        } else {
          setError('渲染出错: ' + (error instanceof Error ? error.message : '未知错误'));
        }
      }
    } catch (error) {
      console.error('初始化错误:', error);
      setError('初始化出错: ' + (error instanceof Error ? error.message : '未知错误'));
    }
    
    // 创建备用甘特图显示
    function createFallbackGanttChart(chartText: string) {
      if (!mermaidRef.current) return;
      
      try {
        // 从图表文本中提取标题和任务
        const titleMatch = chartText.match(/title\s+([^\n]+)/);
        const title = titleMatch ? titleMatch[1] : '项目计划';
        
        // 解析任务和分组
        const sections: {name: string, tasks: Array<{name: string, start: number, duration: number}>}[] = [];
        let currentSection = { name: '任务', tasks: [] as Array<{name: string, start: number, duration: number}> };
        
        const lines = chartText.split('\n');
        for (const line of lines) {
          const trimmedLine = line.trim();
          
          // 处理分组
          if (trimmedLine.startsWith('section ')) {
            // 保存前一个分组（如果有任务）
            if (currentSection.tasks.length > 0) {
              sections.push(currentSection);
            }
            
            // 创建新分组
            currentSection = {
              name: trimmedLine.substring(8).trim(),
              tasks: []
            };
          } 
          // 处理任务
          else if (trimmedLine.includes(':')) {
            const parts = trimmedLine.split(':');
            const taskName = parts[0].trim();
            const taskData = parts[1].trim();
            
            // 尝试解析任务数据
            let start = 0;
            let duration = 10;
            
            const dataMatch = taskData.match(/(\d+)\s*,\s*(\d+)d/);
            if (dataMatch) {
              start = parseInt(dataMatch[1]);
              duration = parseInt(dataMatch[2]);
            }
            
            currentSection.tasks.push({
              name: taskName,
              start,
              duration
            });
          }
        }
        
        // 添加最后一个分组
        if (currentSection.tasks.length > 0) {
          sections.push(currentSection);
        }
        
        // 计算总时间范围
        let maxEnd = 0;
        sections.forEach(section => {
          section.tasks.forEach(task => {
            maxEnd = Math.max(maxEnd, task.start + task.duration);
          });
        });
        
        // 创建HTML
        let html = `
          <div class="gantt-fallback">
            <h3 class="gantt-title">${title}</h3>
            <div class="gantt-chart">
        `;
        
        // 添加头部时间线
        html += '<div class="gantt-timeline-header">';
        for (let i = 0; i <= maxEnd; i += 10) {
          html += `<div class="gantt-timeline-marker">${i}</div>`;
        }
        html += '</div>';
        
        // 添加各个部分
        sections.forEach(section => {
          html += `<div class="gantt-section">
            <div class="gantt-section-name">${section.name}</div>
            <div class="gantt-section-tasks">`;
            
          section.tasks.forEach(task => {
            const leftPos = (task.start / maxEnd) * 100;
            const widthPercent = (task.duration / maxEnd) * 100;
            
            html += `
              <div class="gantt-task-row">
                <div class="gantt-task-name">${task.name}</div>
                <div class="gantt-task-timeline">
                  <div class="gantt-task-bar" style="left: ${leftPos}%; width: ${widthPercent}%;">
                    <span class="gantt-task-label">${task.duration}天</span>
                  </div>
                </div>
              </div>
            `;
          });
          
          html += '</div></div>';
        });
        
        html += '</div></div>';
        
        // 设置HTML
        mermaidRef.current.innerHTML = html;
      } catch (error) {
        console.error('创建备用甘特图错误:', error);
        mermaidRef.current.innerHTML = '<div class="error-message">无法显示甘特图</div>';
      }
    }
  }, [chart, renderAttempt]);

  // 如果有错误，显示错误消息和原始代码
  if (error) {
    return (
      <div className="mermaid-error">
        <div className="error-message">渲染错误: {error}</div>
        <pre className="mermaid-source-code">{chart}</pre>
      </div>
    );
  }

  return <div className="mermaid-container" ref={mermaidRef} />;
};

export default MermaidRenderer; 