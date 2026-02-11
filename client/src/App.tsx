import React, { useState, useEffect } from 'react';
import { useWebSocket } from './hooks/useWebSocket';
import Graph3D from './components/Graph3D';
import DiffPanel from './components/DiffPanel';
import Controls from './components/Controls';
import Stats from './components/Stats';
import { GraphNode } from './types';
import { lightTheme, darkTheme, Theme } from './theme';

const App: React.FC = () => {
  const { graphData, stats, diffData, isConnected, startWatching, stopWatching, requestDiff } =
    useWebSocket();

  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [isWatching, setIsWatching] = useState(false);
  const [defaultPath, setDefaultPath] = useState<string>('');
  const [theme, setTheme] = useState<Theme>(lightTheme);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    fetch('/api/cwd')
      .catch(() => ({ json: () => Promise.resolve({ cwd: '' }) }))
      .then(res => res.json())
      .then(data => {
        if (data.cwd) {
          setDefaultPath(data.cwd);
        }
      });
  }, []);

  const handleStartWatch = (path: string) => {
    startWatching(path);
    setIsWatching(true);
  };

  const handleStopWatch = () => {
    stopWatching();
    setIsWatching(false);
  };

  const handleNodeClick = (node: GraphNode) => {
    setSelectedNode(node);
    requestDiff(node.path);
  };

  const handleCloseDiff = () => {
    setSelectedNode(null);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    setTheme(isDarkMode ? lightTheme : darkTheme);
  };

  return (
    <div style={{ ...styles.app, backgroundColor: theme.background }}>
      <Controls
        isConnected={isConnected}
        isWatching={isWatching}
        onStartWatch={handleStartWatch}
        onStopWatch={handleStopWatch}
        defaultPath={defaultPath}
        theme={theme}
        onToggleTheme={toggleTheme}
        isDarkMode={isDarkMode}
      />

      <div style={styles.graphContainer}>
        <Graph3D data={graphData} onNodeClick={handleNodeClick} theme={theme} />
      </div>

      {isWatching && <Stats stats={stats} theme={theme} />}

      {selectedNode && <DiffPanel diffData={diffData} onClose={handleCloseDiff} theme={theme} />}

      {!isWatching && graphData.nodes.length === 0 && (
        <div style={styles.emptyState}>
          <div style={{ ...styles.emptyStateContent, backgroundColor: theme.surface, borderColor: theme.border }}>
            <h2 style={{ ...styles.emptyStateTitle, color: theme.text.primary }}>CodeSynapse</h2>
            <p style={{ ...styles.emptyStateText, color: theme.text.secondary }}>
              Visualize your codebase as a living neural network.
            </p>
            <p style={{ ...styles.emptyStateText, color: theme.text.secondary }}>
              Watch files change in real-time as you or AI agents work on your project.
            </p>
            <div style={styles.features}>
              <div style={{ ...styles.feature, color: theme.text.secondary, backgroundColor: theme.background, borderColor: theme.border }}>3D Neural Network Visualization</div>
              <div style={{ ...styles.feature, color: theme.text.secondary, backgroundColor: theme.background, borderColor: theme.border }}>Real-time File Changes</div>
              <div style={{ ...styles.feature, color: theme.text.secondary, backgroundColor: theme.background, borderColor: theme.border }}>Dependency Mapping</div>
              <div style={{ ...styles.feature, color: theme.text.secondary, backgroundColor: theme.background, borderColor: theme.border }}>Git Diff Integration</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  app: {
    width: '100vw',
    height: '100vh',
    margin: 0,
    padding: 0,
    overflow: 'hidden',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
    transition: 'background-color 0.2s'
  },
  graphContainer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 0
  },
  emptyState: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 50,
    textAlign: 'center',
    maxWidth: '500px',
    padding: '40px'
  },
  emptyStateContent: {
    border: '1px solid',
    borderRadius: '12px',
    padding: '48px 40px',
    transition: 'all 0.2s'
  },
  emptyStateTitle: {
    fontSize: '28px',
    fontWeight: 600,
    marginBottom: '16px',
    transition: 'color 0.2s'
  },
  emptyStateText: {
    fontSize: '15px',
    lineHeight: '1.6',
    marginBottom: '12px',
    transition: 'color 0.2s'
  },
  features: {
    marginTop: '32px',
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '12px'
  },
  feature: {
    fontSize: '14px',
    textAlign: 'left',
    padding: '10px 16px',
    borderRadius: '6px',
    border: '1px solid',
    transition: 'all 0.2s'
  }
};

export default App;
