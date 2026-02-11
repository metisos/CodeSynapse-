import chokidar, { FSWatcher } from 'chokidar';
import { EventEmitter } from 'events';
import * as path from 'path';
import * as fs from 'fs';
import { FileChangeEvent } from './types';

export class FileWatcher extends EventEmitter {
  private watcher: FSWatcher | null = null;
  private watchPath: string = '';
  private ignorePatterns: string[] = [
    '**/node_modules/**',
    '**/.git/**',
    '**/dist/**',
    '**/build/**',
    '**/.next/**',
    '**/coverage/**',
    '**/.cache/**',
    '**/tmp/**',
    '**/.DS_Store'
  ];

  constructor() {
    super();
  }

  start(watchPath: string, customIgnorePatterns?: string[]): void {
    if (this.watcher) {
      this.stop();
    }

    this.watchPath = path.resolve(watchPath);

    if (customIgnorePatterns) {
      this.ignorePatterns = [...this.ignorePatterns, ...customIgnorePatterns];
    }

    console.log(`Starting file watcher on: ${this.watchPath}`);
    console.log(`Ignoring patterns:`, this.ignorePatterns);

    this.watcher = chokidar.watch(this.watchPath, {
      ignored: this.ignorePatterns,
      persistent: true,
      ignoreInitial: false,
      awaitWriteFinish: {
        stabilityThreshold: 300,
        pollInterval: 100
      },
      depth: 99
    });

    this.watcher
      .on('add', (filePath: string, stats?: fs.Stats) => {
        this.emitChange('add', filePath, stats);
      })
      .on('change', (filePath: string, stats?: fs.Stats) => {
        this.emitChange('change', filePath, stats);
      })
      .on('unlink', (filePath: string) => {
        this.emitChange('unlink', filePath);
      })
      .on('error', (error: Error) => {
        console.error('Watcher error:', error);
        this.emit('error', error);
      })
      .on('ready', () => {
        console.log('Initial scan complete. Ready for changes.');
        this.emit('ready');
      });
  }

  private emitChange(type: 'add' | 'change' | 'unlink', filePath: string, stats?: fs.Stats): void {
    const event: FileChangeEvent = {
      type,
      path: filePath,
      stats: stats ? {
        size: stats.size,
        mtime: stats.mtime
      } : undefined
    };

    this.emit('fileChange', event);
  }

  stop(): void {
    if (this.watcher) {
      console.log('Stopping file watcher');
      this.watcher.close();
      this.watcher = null;
    }
  }

  getWatchPath(): string {
    return this.watchPath;
  }

  isWatching(): boolean {
    return this.watcher !== null;
  }
}
