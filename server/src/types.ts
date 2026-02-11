export interface GraphNode {
  id: string;
  name: string;
  path: string;
  type: string;
  size: number;
  lastModified: number;
  connections?: number;
  changeFrequency?: number;
}

export interface GraphLink {
  source: string;
  target: string;
  type: 'import' | 'require';
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

export interface FileChangeEvent {
  type: 'add' | 'change' | 'unlink';
  path: string;
  stats?: {
    size: number;
    mtime: Date;
  };
}

export interface DependencyMap {
  [filePath: string]: string[];
}

export interface WatchConfig {
  path: string;
  ignorePatterns?: string[];
}

export interface Stats {
  fileCount: number;
  changeCount: number;
  connectionCount: number;
  lastChangeTime?: number;
}

export interface DiffData {
  filePath: string;
  diff: string;
  content?: string;
  language?: string;
}
