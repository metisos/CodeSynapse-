import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import * as fs from 'fs';
import * as path from 'path';
import { FileWatcher } from './FileWatcher';
import { DependencyParser } from './DependencyParser';
import { GitIntegration } from './GitIntegration';
import { GraphBuilder } from './GraphBuilder';
import { FileChangeEvent, WatchConfig } from './types';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 3004;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from React build in production
const clientBuildPath = path.join(__dirname, '../../client/build');
if (fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

// Get current working directory (parent of server folder)
app.get('/api/cwd', (req, res) => {
  const cwd = process.cwd();
  // If we're in the server directory, go up one level to the project root
  const projectRoot = cwd.endsWith('/server') ? path.dirname(cwd) : cwd;
  res.json({ cwd: projectRoot });
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  const fileWatcher = new FileWatcher();
  const dependencyParser = new DependencyParser();
  const gitIntegration = new GitIntegration();
  const graphBuilder = new GraphBuilder();

  let isInitialized = false;
  let updateTimeout: NodeJS.Timeout | null = null;

  // Debounced graph update function
  const scheduleGraphUpdate = () => {
    if (updateTimeout) {
      clearTimeout(updateTimeout);
    }

    updateTimeout = setTimeout(() => {
      const graphData = graphBuilder.getGraphData();
      const stats = graphBuilder.getStats();
      socket.emit('stats:update', stats);
    }, 500);
  };

  // Handle watch start
  socket.on('watch:start', async (config: WatchConfig) => {
    try {
      console.log('Starting watch on:', config.path);

      // Initialize git
      await gitIntegration.initialize(config.path);

      // Register ready handler BEFORE starting the watcher
      fileWatcher.once('ready', async () => {
        try {
          console.log('=== READY CALLBACK STARTED ===');
          console.log('Getting files from:', config.path);

          const files = getAllFiles(config.path, config.ignorePatterns || []);
          console.log(`Found ${files.length} files`);

          if (files.length === 0) {
            console.log('No files found. Check ignore patterns.');
          } else {
            console.log('First few files:', files.slice(0, 5));
          }

          // Build dependency map
          console.log('Building dependency map...');
          const dependencyMap = dependencyParser.buildDependencyMap(files);
          console.log('Dependency map built');

          // Build initial graph
          console.log('Building graph...');
          const graphData = graphBuilder.buildGraph(files, dependencyMap);
          console.log('Graph built:', graphData.nodes.length, 'nodes', graphData.links.length, 'links');

          // Send initial graph to client
          socket.emit('graph:init', graphData);
          console.log('Emitted graph:init to client');

          // Send initial stats
          const stats = graphBuilder.getStats();
          socket.emit('stats:update', stats);
          console.log('Emitted stats:update to client');

          isInitialized = true;
          console.log('=== READY CALLBACK COMPLETED ===');
        } catch (error) {
          console.error('=== ERROR IN READY CALLBACK ===', error);
        }
      });

      // Start file watcher AFTER registering the ready handler
      fileWatcher.start(config.path, config.ignorePatterns);

      // Handle file changes
      fileWatcher.on('fileChange', async (event: FileChangeEvent) => {
        if (!isInitialized) return;

        console.log(`File ${event.type}: ${event.path}`);

        if (event.type === 'add') {
          // Add new node
          const node = graphBuilder.addNode(event.path);
          socket.emit('graph:nodeAdded', node);

          // Parse dependencies and add links
          const deps = dependencyParser.parseFile(event.path);
          for (const dep of deps) {
            const link = graphBuilder.addLink(event.path, dep, 'import');
            socket.emit('graph:linkAdded', link);
          }

          scheduleGraphUpdate();
        } else if (event.type === 'change') {
          // Update existing node
          const node = graphBuilder.updateNode(event.path, {
            lastModified: Date.now()
          });

          if (node) {
            socket.emit('graph:nodeChanged', { nodeId: node.id, changes: node });

            // Reparse dependencies
            const oldDeps = graphBuilder.getGraphData().links
              .filter(link => link.source === event.path)
              .map(link => link.target);

            const newDeps = dependencyParser.parseFile(event.path);

            // Find removed dependencies
            const removed = oldDeps.filter(dep => !newDeps.includes(dep));
            for (const dep of removed) {
              graphBuilder.removeLink(event.path, dep);
              socket.emit('graph:linkRemoved', { source: event.path, target: dep });
            }

            // Find added dependencies
            const added = newDeps.filter(dep => !oldDeps.includes(dep));
            for (const dep of added) {
              const link = graphBuilder.addLink(event.path, dep, 'import');
              socket.emit('graph:linkAdded', link);
            }

            scheduleGraphUpdate();
          }
        } else if (event.type === 'unlink') {
          // Remove node
          graphBuilder.removeNode(event.path);
          socket.emit('graph:nodeRemoved', { nodeId: event.path });
          scheduleGraphUpdate();
        }
      });
    } catch (error) {
      console.error('Error starting watch:', error);
      socket.emit('error', { message: 'Failed to start watching' });
    }
  });

  // Handle watch stop
  socket.on('watch:stop', () => {
    console.log('Stopping watch');
    fileWatcher.stop();
    isInitialized = false;
  });

  // Handle diff request
  socket.on('diff:request', async (data: { filePath: string }) => {
    try {
      console.log('Received diff request for:', data.filePath);
      const diff = await gitIntegration.getFileDiff(data.filePath);

      // Read file content
      let content = '';
      let language = '';
      try {
        content = fs.readFileSync(data.filePath, 'utf-8');
        console.log(`Read file content: ${content.length} characters`);
        // Detect language from file extension
        const ext = path.extname(data.filePath).toLowerCase();
        const langMap: { [key: string]: string } = {
          '.js': 'javascript',
          '.jsx': 'javascript',
          '.ts': 'typescript',
          '.tsx': 'typescript',
          '.json': 'json',
          '.css': 'css',
          '.html': 'html',
          '.md': 'markdown',
          '.py': 'python',
          '.java': 'java',
          '.go': 'go',
          '.rs': 'rust',
          '.cpp': 'cpp',
          '.c': 'c',
          '.sh': 'bash'
        };
        language = langMap[ext] || 'plaintext';
      } catch (readError) {
        console.error('Error reading file:', readError);
        content = 'Unable to read file content';
      }

      console.log(`Sending diff data for ${data.filePath}, language: ${language}`);
      socket.emit('diff:data', {
        filePath: data.filePath,
        diff: diff || 'No changes detected',
        content,
        language
      });
    } catch (error) {
      console.error('Error getting diff:', error);
      socket.emit('diff:data', {
        filePath: data.filePath,
        diff: 'Error getting diff',
        content: 'Error reading file',
        language: 'plaintext'
      });
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    fileWatcher.stop();
    if (updateTimeout) {
      clearTimeout(updateTimeout);
    }
  });
});

// Helper function to get all files in a directory
function getAllFiles(dirPath: string, ignorePatterns: string[]): string[] {
  const files: string[] = [];

  const defaultIgnore = [
    '/node_modules/',
    '/.git/',
    '/dist/',
    '/build/',
    '/.next/',
    '/coverage/',
    '/.cache/',
    '/tmp/'
  ];

  const shouldIgnore = (filePath: string): boolean => {
    // Check if path contains any of the ignore patterns (with slashes to avoid false positives)
    return [...defaultIgnore, ...ignorePatterns].some(pattern => {
      return filePath.includes(pattern);
    });
  };

  const walk = (dir: string) => {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (shouldIgnore(fullPath)) {
          continue;
        }

        if (entry.isDirectory()) {
          walk(fullPath);
        } else if (entry.isFile()) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      console.error(`Error reading directory ${dir}:`, error);
    }
  };

  walk(dirPath);
  return files;
}

// Catch-all route for React app (must be after API routes)
app.get('*', (req, res) => {
  const indexPath = path.join(clientBuildPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('React app not built. Run: npm run build --workspace=client');
  }
});

// Start server with port conflict handling
const startServer = (port: number) => {
  httpServer.listen(port, () => {
    console.log(`
CodeSynapse Server Running
Port: ${port}
URL: http://localhost:${port}
  `);
  }).on('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} is in use, trying ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('Server error:', err);
      process.exit(1);
    }
  });
};

startServer(Number(PORT));
