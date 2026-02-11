import { useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { GraphData, GraphNode, GraphLink, Stats, DiffData } from '../types';

interface UseWebSocketReturn {
  graphData: GraphData;
  stats: Stats;
  diffData: DiffData | null;
  isConnected: boolean;
  startWatching: (path: string, ignorePatterns?: string[]) => void;
  stopWatching: () => void;
  requestDiff: (filePath: string) => void;
}

export const useWebSocket = (): UseWebSocketReturn => {
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });
  const [stats, setStats] = useState<Stats>({
    fileCount: 0,
    changeCount: 0,
    connectionCount: 0
  });
  const [diffData, setDiffData] = useState<DiffData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Connect to server on same port
    const socket = io();
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });

    // Handle initial graph
    socket.on('graph:init', (data: GraphData) => {
      console.log('Received initial graph:', data);
      setGraphData(data);
    });

    // Handle node added
    socket.on('graph:nodeAdded', (node: GraphNode) => {
      console.log('Node added:', node);
      setGraphData(prev => ({
        ...prev,
        nodes: [...prev.nodes, node]
      }));
    });

    // Handle node changed
    socket.on('graph:nodeChanged', (data: { nodeId: string; changes: GraphNode }) => {
      console.log('Node changed:', data);
      setGraphData(prev => ({
        ...prev,
        nodes: prev.nodes.map(n => n.id === data.nodeId ? data.changes : n)
      }));
    });

    // Handle node removed
    socket.on('graph:nodeRemoved', (data: { nodeId: string }) => {
      console.log('Node removed:', data);
      setGraphData(prev => ({
        nodes: prev.nodes.filter(n => n.id !== data.nodeId),
        links: prev.links.filter(l => l.source !== data.nodeId && l.target !== data.nodeId)
      }));
    });

    // Handle link added
    socket.on('graph:linkAdded', (link: GraphLink) => {
      console.log('Link added:', link);
      setGraphData(prev => ({
        ...prev,
        links: [...prev.links, link]
      }));
    });

    // Handle link removed
    socket.on('graph:linkRemoved', (data: { source: string; target: string }) => {
      console.log('Link removed:', data);
      setGraphData(prev => ({
        ...prev,
        links: prev.links.filter(l => !(l.source === data.source && l.target === data.target))
      }));
    });

    // Handle stats update
    socket.on('stats:update', (newStats: Stats) => {
      setStats(newStats);
    });

    // Handle diff data
    socket.on('diff:data', (data: DiffData) => {
      console.log('Diff received:', data);
      setDiffData(data);
    });

    // Cleanup
    return () => {
      socket.disconnect();
    };
  }, []);

  const startWatching = useCallback((path: string, ignorePatterns?: string[]) => {
    if (socketRef.current) {
      socketRef.current.emit('watch:start', { path, ignorePatterns });
    }
  }, []);

  const stopWatching = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.emit('watch:stop');
    }
  }, []);

  const requestDiff = useCallback((filePath: string) => {
    console.log('Requesting diff for:', filePath);
    if (socketRef.current) {
      socketRef.current.emit('diff:request', { filePath });
    }
  }, []);

  return {
    graphData,
    stats,
    diffData,
    isConnected,
    startWatching,
    stopWatching,
    requestDiff
  };
};
