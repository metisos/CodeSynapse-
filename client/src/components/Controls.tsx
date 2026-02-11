import React, { useState, useEffect } from 'react';
import { Theme } from '../theme';

interface ControlsProps {
  isConnected: boolean;
  isWatching: boolean;
  onStartWatch: (path: string) => void;
  onStopWatch: () => void;
  defaultPath?: string;
  theme: Theme;
  onToggleTheme: () => void;
  isDarkMode: boolean;
}

const Controls: React.FC<ControlsProps> = ({
  isConnected,
  isWatching,
  onStartWatch,
  onStopWatch,
  defaultPath,
  theme,
  onToggleTheme,
  isDarkMode
}) => {
  const [watchPath, setWatchPath] = useState('');

  useEffect(() => {
    if (defaultPath && !watchPath) {
      setWatchPath(defaultPath);
    }
  }, [defaultPath, watchPath]);

  const handleStart = () => {
    if (watchPath.trim()) {
      onStartWatch(watchPath.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleStart();
    }
  };

  return (
    <div style={{ ...styles.container, backgroundColor: theme.surface, borderBottomColor: theme.border }}>
      <div style={styles.header}>
        <h1 style={{ ...styles.title, color: theme.text.primary }}>CodeSynapse</h1>
        <div style={styles.rightHeader}>
          <button onClick={onToggleTheme} style={{ ...styles.themeToggle, color: theme.text.secondary, borderColor: theme.border }}>
            {isDarkMode ? '☀' : '☾'}
          </button>
          <div style={styles.status}>
            <div style={{
              ...styles.statusIndicator,
              backgroundColor: isConnected ? theme.accent : theme.error
            }} />
            <span style={{ ...styles.statusText, color: theme.text.secondary }}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
      </div>

      <div style={styles.controls}>
        <input
          type="text"
          placeholder="Enter directory path to watch..."
          value={watchPath}
          onChange={(e) => setWatchPath(e.target.value)}
          onKeyPress={handleKeyPress}
          style={{ ...styles.input, backgroundColor: theme.background, borderColor: theme.border, color: theme.text.primary }}
          disabled={isWatching}
        />
        {!isWatching ? (
          <button
            onClick={handleStart}
            disabled={!watchPath.trim() || !isConnected}
            style={{
              ...styles.button,
              ...styles.startButton,
              backgroundColor: theme.accent,
              color: theme.accentText,
              opacity: (!watchPath.trim() || !isConnected) ? 0.5 : 1
            }}
          >
            Start Watching
          </button>
        ) : (
          <button
            onClick={onStopWatch}
            style={{
              ...styles.button,
              ...styles.stopButton,
              backgroundColor: theme.error
            }}
          >
            Stop Watching
          </button>
        )}
      </div>

      <div style={styles.info}>
        <p style={{ ...styles.infoText, color: theme.text.secondary }}>
          {isWatching
            ? `Watching: ${watchPath}`
            : 'Auto-detected current project or enter a directory path to visualize'}
        </p>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    borderBottom: '1px solid',
    padding: '10px 20px',
    zIndex: 100,
    transition: 'all 0.2s',
    backdropFilter: 'blur(10px)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px'
  },
  title: {
    margin: 0,
    fontSize: '15px',
    fontWeight: 600,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
    transition: 'color 0.2s',
    opacity: 0.8
  },
  rightHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  themeToggle: {
    background: 'none',
    border: '1px solid',
    borderRadius: '4px',
    width: '28px',
    height: '28px',
    cursor: 'pointer',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
    opacity: 0.7
  },
  status: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  statusIndicator: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    boxShadow: '0 0 6px currentColor',
    transition: 'background-color 0.2s'
  },
  statusText: {
    fontSize: '12px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
    transition: 'color 0.2s',
    opacity: 0.8
  },
  controls: {
    display: 'flex',
    gap: '8px',
    marginBottom: '8px'
  },
  input: {
    flex: 1,
    padding: '8px 12px',
    border: '1px solid',
    borderRadius: '4px',
    fontSize: '13px',
    fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, monospace',
    outline: 'none',
    transition: 'all 0.2s'
  },
  button: {
    padding: '8px 16px',
    border: 'none',
    borderRadius: '4px',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.15s',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif'
  },
  startButton: {
    transition: 'all 0.15s'
  },
  stopButton: {
    color: '#ffffff',
    transition: 'all 0.15s'
  },
  info: {
    marginTop: '6px'
  },
  infoText: {
    margin: 0,
    fontSize: '11px',
    fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, monospace',
    transition: 'color 0.2s',
    opacity: 0.7
  }
};

export default Controls;
