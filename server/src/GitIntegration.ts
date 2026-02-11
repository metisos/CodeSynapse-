import simpleGit, { SimpleGit } from 'simple-git';
import * as path from 'path';
import * as fs from 'fs';

export class GitIntegration {
  private git: SimpleGit | null = null;
  private diffCache: Map<string, { diff: string; timestamp: number }> = new Map();
  private cacheTimeout = 5000; // 5 seconds

  async initialize(repoPath: string): Promise<boolean> {
    try {
      this.git = simpleGit(repoPath);
      const isRepo = await this.git.checkIsRepo();
      if (!isRepo) {
        console.log('Not a git repository, git features disabled');
        this.git = null;
        return false;
      }
      console.log('Git integration initialized');
      return true;
    } catch (error) {
      console.error('Error initializing git:', error);
      this.git = null;
      return false;
    }
  }

  async getFileDiff(filePath: string): Promise<string | null> {
    if (!this.git) {
      return null;
    }

    // Check cache
    const cached = this.diffCache.get(filePath);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.diff;
    }

    try {
      // Check if file exists in git
      const status = await this.git.status();
      const relativePath = path.relative(await this.getRepoRoot(), filePath);

      // File is untracked
      if (status.not_added.includes(relativePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        const diff = `New file (not tracked in git)\n\n${content}`;
        this.diffCache.set(filePath, { diff, timestamp: Date.now() });
        return diff;
      }

      // Get diff for modified files
      if (status.modified.includes(relativePath) || status.created.includes(relativePath)) {
        const diff = await this.git.diff([relativePath]);
        this.diffCache.set(filePath, { diff, timestamp: Date.now() });
        return diff;
      }

      // File is tracked but unchanged
      return null;
    } catch (error) {
      console.error(`Error getting diff for ${filePath}:`, error);
      return null;
    }
  }

  async getRecentChanges(): Promise<string[]> {
    if (!this.git) {
      return [];
    }

    try {
      const status = await this.git.status();
      const repoRoot = await this.getRepoRoot();

      const changed = [
        ...status.modified,
        ...status.created,
        ...status.not_added
      ].map(file => path.join(repoRoot, file));

      return changed;
    } catch (error) {
      console.error('Error getting recent changes:', error);
      return [];
    }
  }

  async getRepoRoot(): Promise<string> {
    if (!this.git) {
      throw new Error('Git not initialized');
    }

    try {
      const root = await this.git.revparse(['--show-toplevel']);
      return root.trim();
    } catch (error) {
      throw new Error('Failed to get repo root');
    }
  }

  clearCache(): void {
    this.diffCache.clear();
  }

  isInitialized(): boolean {
    return this.git !== null;
  }
}
