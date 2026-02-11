import React from 'react';
import { Stats as StatsType } from '../types';
import { Theme } from '../theme';

interface StatsProps {
  stats: StatsType;
  theme: Theme;
}

const Stats: React.FC<StatsProps> = ({ stats, theme }) => {
  const formatTime = (timestamp?: number) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  return (
    <div style={styles.container}>
      <div style={{ ...styles.statCard, backgroundColor: theme.surface, borderColor: theme.border }}>
        <div style={{ ...styles.statValue, color: theme.accent }}>{stats.fileCount}</div>
        <div style={{ ...styles.statLabel, color: theme.text.secondary }}>Files</div>
      </div>

      <div style={{ ...styles.statCard, backgroundColor: theme.surface, borderColor: theme.border }}>
        <div style={{ ...styles.statValue, color: theme.accent }}>{stats.connectionCount}</div>
        <div style={{ ...styles.statLabel, color: theme.text.secondary }}>Connections</div>
      </div>

      <div style={{ ...styles.statCard, backgroundColor: theme.surface, borderColor: theme.border }}>
        <div style={{ ...styles.statValue, color: theme.accent }}>{stats.changeCount}</div>
        <div style={{ ...styles.statLabel, color: theme.text.secondary }}>Changes</div>
      </div>

      {stats.lastChangeTime && (
        <div style={{ ...styles.statCard, backgroundColor: theme.surface, borderColor: theme.border }}>
          <div style={{ ...styles.statValue, color: theme.accent }}>{formatTime(stats.lastChangeTime)}</div>
          <div style={{ ...styles.statLabel, color: theme.text.secondary }}>Last Change</div>
        </div>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: 'fixed',
    bottom: '20px',
    left: '20px',
    display: 'flex',
    gap: '12px',
    zIndex: 100
  },
  statCard: {
    border: '1px solid',
    borderRadius: '8px',
    padding: '12px 16px',
    minWidth: '90px',
    textAlign: 'center',
    transition: 'all 0.2s'
  },
  statValue: {
    fontSize: '24px',
    fontWeight: 600,
    marginBottom: '4px',
    fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, monospace',
    transition: 'color 0.2s'
  },
  statLabel: {
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
    transition: 'color 0.2s'
  }
};

export default Stats;
