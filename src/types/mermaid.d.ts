declare module 'mermaid' {
  interface MermaidConfig {
    startOnLoad?: boolean;
    theme?: 'default' | 'forest' | 'dark' | 'neutral';
    logLevel?: 'debug' | 'info' | 'warn' | 'error' | 'fatal';
    securityLevel?: 'strict' | 'loose' | 'antiscript';
    fontFamily?: string;
    flowchart?: {
      htmlLabels?: boolean;
      curve?: string;
    };
    sequence?: {
      diagramMarginX?: number;
      diagramMarginY?: number;
      actorMargin?: number;
      width?: number;
      height?: number;
      boxMargin?: number;
      boxTextMargin?: number;
      noteMargin?: number;
      messageMargin?: number;
    };
    gantt?: {
      titleTopMargin?: number;
      barHeight?: number;
      barGap?: number;
      topPadding?: number;
      leftPadding?: number;
      gridLineStartPadding?: number;
      fontSize?: number;
      fontFamily?: string;
      numberSectionStyles?: number;
    };
  }

  interface RenderResult {
    svg: string;
    bindFunctions?: (element: Element) => void;
  }

  function initialize(config: MermaidConfig): void;
  function render(id: string, text: string): Promise<RenderResult>;

  export { initialize, render };
  export default { initialize, render };
}

declare module '@uiw/react-md-editor' {
  import React from 'react';

  interface MDEditorProps {
    value?: string;
    onChange?: (value?: string) => void;
    preview?: 'live' | 'edit' | 'preview';
    height?: string | number;
    hideToolbar?: boolean;
    className?: string;
    previewOptions?: {
      showCodeRowNumbers?: boolean;
      previewClass?: string;
      components?: Record<string, React.ComponentType<any>>;
    };
    components?: {
      preview?: (source: string) => React.ReactNode;
    };
    textareaProps?: React.TextareaHTMLAttributes<HTMLTextAreaElement>;
  }

  const MDEditor: React.FC<MDEditorProps> & {
    Markdown: React.FC<{ source?: string }>;
  };

  export default MDEditor;
}

declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
} 