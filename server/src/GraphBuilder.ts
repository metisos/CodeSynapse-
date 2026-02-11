import * as fs from 'fs';
import * as path from 'path';
import { GraphData, GraphNode, GraphLink, DependencyMap } from './types';

export class GraphBuilder {
  private nodes: Map<string, GraphNode> = new Map();
  private links: Map<string, GraphLink> = new Map();
  private changeFrequency: Map<string, number> = new Map();

  buildGraph(files: string[], dependencyMap: DependencyMap): GraphData {
    this.nodes.clear();
    this.links.clear();

    // Create nodes for all files
    for (const filePath of files) {
      this.addNode(filePath);
    }

    // Create links based on dependencies
    for (const [source, targets] of Object.entries(dependencyMap)) {
      for (const target of targets) {
        this.addLink(source, target, 'import');
      }
    }

    return this.getGraphData();
  }

  addNode(filePath: string): GraphNode {
    if (this.nodes.has(filePath)) {
      return this.nodes.get(filePath)!;
    }

    let stats: fs.Stats | null = null;
    try {
      stats = fs.statSync(filePath);
    } catch (error) {
      // File might have been deleted
    }

    const node: GraphNode = {
      id: filePath,
      name: path.basename(filePath),
      path: filePath,
      type: this.getFileType(filePath),
      size: stats ? stats.size : 0,
      lastModified: stats ? stats.mtimeMs : Date.now(),
      connections: 0,
      changeFrequency: this.changeFrequency.get(filePath) || 0
    };

    this.nodes.set(filePath, node);
    return node;
  }

  updateNode(filePath: string, changes: Partial<GraphNode>): GraphNode | null {
    const node = this.nodes.get(filePath);
    if (!node) {
      return null;
    }

    Object.assign(node, changes);

    // Update last modified
    try {
      const stats = fs.statSync(filePath);
      node.lastModified = stats.mtimeMs;
      node.size = stats.size;
    } catch (error) {
      // File might have been deleted
    }

    // Increment change frequency
    const freq = this.changeFrequency.get(filePath) || 0;
    this.changeFrequency.set(filePath, freq + 1);
    node.changeFrequency = freq + 1;

    return node;
  }

  removeNode(filePath: string): boolean {
    // Remove all links connected to this node
    const linksToRemove: string[] = [];
    for (const [linkId, link] of this.links.entries()) {
      if (link.source === filePath || link.target === filePath) {
        linksToRemove.push(linkId);
      }
    }
    linksToRemove.forEach(linkId => this.links.delete(linkId));

    return this.nodes.delete(filePath);
  }

  addLink(source: string, target: string, type: 'import' | 'require'): GraphLink {
    const linkId = `${source}->${target}`;

    if (this.links.has(linkId)) {
      return this.links.get(linkId)!;
    }

    // Only add link if both nodes exist
    if (!this.nodes.has(source) || !this.nodes.has(target)) {
      // Ensure both nodes exist
      if (!this.nodes.has(source)) this.addNode(source);
      if (!this.nodes.has(target)) this.addNode(target);
    }

    const link: GraphLink = {
      source,
      target,
      type
    };

    this.links.set(linkId, link);

    // Update connection counts
    const sourceNode = this.nodes.get(source);
    const targetNode = this.nodes.get(target);
    if (sourceNode) sourceNode.connections = (sourceNode.connections || 0) + 1;
    if (targetNode) targetNode.connections = (targetNode.connections || 0) + 1;

    return link;
  }

  removeLink(source: string, target: string): boolean {
    const linkId = `${source}->${target}`;
    const removed = this.links.delete(linkId);

    if (removed) {
      // Update connection counts
      const sourceNode = this.nodes.get(source);
      const targetNode = this.nodes.get(target);
      if (sourceNode && sourceNode.connections) sourceNode.connections--;
      if (targetNode && targetNode.connections) targetNode.connections--;
    }

    return removed;
  }

  getGraphData(): GraphData {
    return {
      nodes: Array.from(this.nodes.values()),
      links: Array.from(this.links.values())
    };
  }

  getNode(filePath: string): GraphNode | undefined {
    return this.nodes.get(filePath);
  }

  private getFileType(filePath: string): string {
    const ext = path.extname(filePath).toLowerCase();
    const typeMap: { [key: string]: string } = {
      '.js': 'javascript',
      '.jsx': 'javascript',
      '.ts': 'typescript',
      '.tsx': 'typescript',
      '.mjs': 'javascript',
      '.cjs': 'javascript',
      '.json': 'json',
      '.css': 'style',
      '.scss': 'style',
      '.sass': 'style',
      '.less': 'style',
      '.html': 'markup',
      '.md': 'markdown',
      '.txt': 'text',
      '.yml': 'config',
      '.yaml': 'config',
      '.toml': 'config',
      '.env': 'config'
    };

    return typeMap[ext] || 'other';
  }

  getStats() {
    return {
      fileCount: this.nodes.size,
      connectionCount: this.links.size,
      changeCount: Array.from(this.changeFrequency.values()).reduce((a, b) => a + b, 0),
      lastChangeTime: Math.max(...Array.from(this.nodes.values()).map(n => n.lastModified))
    };
  }
}
