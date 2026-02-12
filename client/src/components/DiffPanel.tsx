import React, { useState } from 'react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneDark, atomOneLight } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { DiffData } from '../types';
import { Theme } from '../theme';

// Import languages for syntax highlighter
import javascript from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import typescript from 'react-syntax-highlighter/dist/esm/languages/hljs/typescript';
import json from 'react-syntax-highlighter/dist/esm/languages/hljs/json';
import css from 'react-syntax-highlighter/dist/esm/languages/hljs/css';
import markdown from 'react-syntax-highlighter/dist/esm/languages/hljs/markdown';
import python from 'react-syntax-highlighter/dist/esm/languages/hljs/python';

SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('css', css);
SyntaxHighlighter.registerLanguage('markdown', markdown);
SyntaxHighlighter.registerLanguage('python', python);

interface DiffPanelProps {
  diffData: DiffData | null;
  onClose: () => void;
  theme: Theme;
}

const DiffPanel: React.FC<DiffPanelProps> = ({ diffData, onClose, theme }) => {
  const [activeTab, setActiveTab] = useState<'code' | 'diff'>('code');

  if (!diffData) {
    return null;
  }

  const isDarkMode = theme.background === '#0d0d0d';
  const syntaxTheme = isDarkMode ? atomOneDark : atomOneLight;

  return (
    <div style={{ ...styles.overlay, backgroundColor: theme.surface, borderLeftColor: theme.border }}>
      <div style={styles.panel}>
        <div style={{ ...styles.header, borderBottomColor: theme.border, backgroundColor: theme.background }}>
          <div style={styles.title}>
            <h3 style={{ ...styles.fileName, color: theme.accent }}>{diffData.filePath.split('/').pop()}</h3>
            <p style={{ ...styles.filePath, color: theme.text.secondary }}>{diffData.filePath}</p>
          </div>
          <button onClick={onClose} style={{ ...styles.closeButton, color: theme.text.secondary }}>
            ✕
          </button>
        </div>

        <div style={{ ...styles.tabs, borderBottomColor: theme.border }}>
          <button
            onClick={() => setActiveTab('code')}
            style={{
              ...styles.tab,
              ...(activeTab === 'code' ? { ...styles.activeTab, borderBottomColor: theme.accent, color: theme.accent } : { color: theme.text.secondary })
            }}
          >
            Code
          </button>
          <button
            onClick={() => setActiveTab('diff')}
            style={{
              ...styles.tab,
              ...(activeTab === 'diff' ? { ...styles.activeTab, borderBottomColor: theme.accent, color: theme.accent } : { color: theme.text.secondary })
            }}
          >
            Git Diff
          </button>
        </div>

        <div style={styles.content}>
          {activeTab === 'code' && diffData.content ? (
            <SyntaxHighlighter
              language={diffData.language || 'plaintext'}
              style={syntaxTheme}
              showLineNumbers={true}
              customStyle={{
                margin: 0,
                padding: '16px',
                fontSize: '13px',
                lineHeight: '1.6',
                backgroundColor: 'transparent',
                fontFamily: 'Monaco, Consolas, "Courier New", monospace'
              }}
              lineNumberStyle={{
                minWidth: '3em',
                paddingRight: '1em',
                color: theme.text.secondary,
                opacity: 0.5
              }}
            >
              {diffData.content}
            </SyntaxHighlighter>
          ) : activeTab === 'diff' ? (
            <div style={styles.diffContainer}>
              {diffData.diff.split('\n').map((line, idx) => {
                let lineStyle = { ...styles.diffLine };
                let lineColor = theme.text.primary;

                if (line.startsWith('+') && !line.startsWith('+++')) {
                  lineStyle = { ...lineStyle, ...styles.diffLineAdded };
                  lineColor = '#22c55e'; // Green for additions
                } else if (line.startsWith('-') && !line.startsWith('---')) {
                  lineStyle = { ...lineStyle, ...styles.diffLineDeleted };
                  lineColor = '#ef4444'; // Red for deletions
                } else if (line.startsWith('@@')) {
                  lineColor = theme.accent; // Highlight line numbers
                  lineStyle = { ...lineStyle, fontWeight: 600 };
                }

                return (
                  <div key={idx} style={{ ...lineStyle, color: lineColor }}>
                    {line || ' '}
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ ...styles.emptyState, color: theme.text.secondary }}>
              No content available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    width: '480px',
    borderLeft: '1px solid',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
    animation: 'slideIn 0.3s ease-out',
    transition: 'all 0.2s'
  },
  panel: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '20px',
    borderBottom: '1px solid',
    transition: 'all 0.2s'
  },
  title: {
    flex: 1
  },
  fileName: {
    margin: '0 0 5px 0',
    fontSize: '18px',
    fontWeight: 600,
    fontFamily: 'monospace',
    transition: 'color 0.2s'
  },
  filePath: {
    margin: 0,
    fontSize: '12px',
    fontFamily: 'monospace',
    wordBreak: 'break-all',
    transition: 'color 0.2s'
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    padding: '0 10px',
    transition: 'color 0.2s',
    marginLeft: '10px'
  },
  tabs: {
    display: 'flex',
    gap: '8px',
    padding: '0 20px',
    borderBottom: '1px solid',
    transition: 'border-color 0.2s'
  },
  tab: {
    background: 'none',
    border: 'none',
    padding: '12px 16px',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    borderBottom: '2px solid transparent',
    transition: 'all 0.2s',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif'
  },
  activeTab: {
    fontWeight: 600
  },
  content: {
    flex: 1,
    overflow: 'auto',
    padding: 0
  },
  diffContainer: {
    padding: '16px 0',
    fontSize: '13px',
    lineHeight: '1.6',
    fontFamily: 'Monaco, Consolas, "Courier New", monospace'
  },
  diffLine: {
    padding: '2px 20px',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word'
  },
  diffLineAdded: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)', // Light green background
    borderLeft: '3px solid #22c55e'
  },
  diffLineDeleted: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)', // Light red background
    borderLeft: '3px solid #ef4444'
  },
  diffText: {
    margin: 0,
    padding: '20px',
    fontSize: '13px',
    lineHeight: '1.6',
    fontFamily: 'Monaco, Consolas, "Courier New", monospace',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    transition: 'color 0.2s'
  },
  emptyState: {
    padding: '40px 20px',
    textAlign: 'center',
    fontSize: '14px'
  }
};

export default DiffPanel;
