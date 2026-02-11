import React, { useRef, useEffect, useMemo } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import { GraphData, GraphNode } from '../types';
import { Theme } from '../theme';
import * as THREE from 'three';

interface Graph3DProps {
  data: GraphData;
  onNodeClick: (node: GraphNode) => void;
  theme: Theme;
}

const Graph3D: React.FC<Graph3DProps> = ({ data, onNodeClick, theme }) => {
  const fgRef = useRef<any>();

  // Color mapping for different file types with change indicators
  const getNodeColor = (node: GraphNode): string => {
    const now = Date.now();
    const timeSinceChange = now - node.lastModified;

    // Very recent changes (0-5 seconds) - bright green flash
    if (timeSinceChange < 5000) {
      return theme.accent; // Bright green
    }

    // Recent changes (5-30 seconds) - warm orange/amber to show activity
    if (timeSinceChange < 30000) {
      return '#f59e0b'; // Amber color for recently changed
    }

    // Moderate changes (30-60 seconds) - fade to yellow
    if (timeSinceChange < 60000) {
      return '#eab308'; // Yellow for moderately recent
    }

    // Use theme colors for stable nodes
    return theme.node[node.type as keyof typeof theme.node] || theme.node.other;
  };

  // Node size based on connections and file size - increased for better visibility
  const getNodeSize = (node: GraphNode): number => {
    const baseSize = 8; // Increased from 4 to 8 for better visibility
    const connectionBonus = (node.connections || 0) * 1.0; // Increased multiplier
    const sizeBonus = Math.log(node.size + 1) * 0.2; // Increased multiplier
    return baseSize + connectionBonus + sizeBonus;
  };

  // Enhanced node appearance
  const nodeThreeObject = useMemo(() => {
    return (node: any) => {
      const nodeData = node as GraphNode;
      const color = getNodeColor(nodeData);
      const size = getNodeSize(nodeData);

      // Create sphere geometry with higher visibility
      const geometry = new THREE.SphereGeometry(size, 20, 20); // More segments for smoother sphere
      const material = new THREE.MeshBasicMaterial({
        color: color,
        transparent: false, // No transparency for better visibility
        opacity: 1.0
      });
      const sphere = new THREE.Mesh(geometry, material);

      // Add stronger glow effect for better visibility
      const glowGeometry = new THREE.SphereGeometry(size * 1.5, 20, 20); // Larger glow
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.5 // Stronger glow
      });
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      sphere.add(glow);

      return sphere;
    };
  }, [data]);

  // Link appearance - make connections more visible
  const linkColor = () => theme.link;
  const linkWidth = () => 1.5;

  // Particle animation along links - more particles for visibility
  const linkDirectionalParticles = () => 3;
  const linkDirectionalParticleWidth = () => 2.5;
  const linkDirectionalParticleSpeed = () => 0.008;
  const linkDirectionalParticleColor = () => theme.accent;

  // Camera settings and force configuration
  useEffect(() => {
    if (fgRef.current) {
      // Set camera position - pull back more to see connections
      const distance = 500;
      fgRef.current.cameraPosition({ z: distance });

      // Configure forces for better clustering and connection visibility
      const fg = fgRef.current;

      // Stronger node repulsion to spread them out
      fg.d3Force('charge')?.strength(-300);

      // Longer link distance and stronger pull to show connections clearly
      fg.d3Force('link')
        ?.distance((link: any) => {
          // Files with more connections get shorter links
          const sourceConnections = link.source.connections || 1;
          const targetConnections = link.target.connections || 1;
          const avgConnections = (sourceConnections + targetConnections) / 2;
          return Math.max(60, 120 - avgConnections * 5);
        })
        .strength(1.2);

      // Gentle center force to keep everything visible
      fg.d3Force('center')?.strength(0.1);
    }
  }, []);

  // Animate recently changed nodes - both pulse and color updates
  useEffect(() => {
    if (!fgRef.current) return;

    const scene = fgRef.current.scene();
    if (!scene) return;

    const animate = () => {
      const now = Date.now();

      scene.children.forEach((obj: any) => {
        if (obj.__data && obj.__data.lastModified) {
          const timeSinceChange = now - obj.__data.lastModified;

          // Pulse effect for very recent changes (0-5 seconds)
          if (timeSinceChange < 5000) {
            const pulse = Math.sin(now / 200) * 0.3 + 1;
            obj.scale.set(pulse, pulse, pulse);
          } else {
            obj.scale.set(1, 1, 1);
          }

          // Update color based on time since change (0-60 seconds)
          if (timeSinceChange < 60000 && obj.children && obj.children[0]) {
            const color = getNodeColor(obj.__data);
            const material = obj.children[0].material;
            if (material) {
              material.color.set(color);
            }
          }
        }
      });

      requestAnimationFrame(animate);
    };

    animate();
  }, [data, theme]);

  return (
    <ForceGraph3D
      ref={fgRef}
      graphData={data}
      nodeLabel={(node: any) => `${node.name}\n${node.type}\n${node.connections || 0} connections`}
      nodeThreeObject={nodeThreeObject}
      onNodeClick={(node: any) => onNodeClick(node as GraphNode)}
      linkColor={linkColor}
      linkWidth={linkWidth}
      linkOpacity={0.4}
      linkDirectionalParticles={linkDirectionalParticles}
      linkDirectionalParticleWidth={linkDirectionalParticleWidth}
      linkDirectionalParticleSpeed={linkDirectionalParticleSpeed}
      linkDirectionalParticleColor={linkDirectionalParticleColor}
      backgroundColor={theme.background}
      showNavInfo={false}
      enableNodeDrag={true}
      enableNavigationControls={true}
      controlType="orbit"
    />
  );
};

export default Graph3D;
