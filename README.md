# CodeSynapse

> **Real-time codebase visualization that looks like a living neural network**
>
> Watch your code evolve in 3D as files light up like neurons firing. Perfect for understanding codebases and monitoring AI agents at work.

![CodeSynapse Visualization](https://raw.githubusercontent.com/metisos/CodeSynapse-/main/docs/screenshot.png)

<div align="center">

[![npm version](https://badge.fury.io/js/codesynapse.svg)](https://www.npmjs.com/package/codesynapse)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

</div>

## Features

- **3D Neural Network Visualization** - Files as neurons, dependencies as synapses
- **Real-time Updates** - Watch changes happen live as you code
- **Dependency Mapping** - Automatically parse and visualize import/require relationships
- **Git Diff Integration** - Click any file to see code changes
- **Beautiful Effects** - Glow effects, pulse animations, and particle flows
- **High Performance** - Smooth 60fps visualization even with large codebases
- **AI Agent Friendly** - Perfect for watching AI agents work on your code

## Demo

Watch your codebase come alive:

1. Point CodeSynapse at any directory
2. See all files appear as glowing nodes in 3D space
3. Dependencies light up as connections between files
4. When you edit a file, it pulses with cyan light
5. Click any node to see the git diff in a side panel
6. Watch the neural network grow as you add more code

## Installation

### Global Installation (Recommended)

```bash
npm install -g codesynapse
```

### Local Installation

```bash
npm install --save-dev codesynapse
```

## Usage

### Quick Start

Navigate to your project directory and run:

```bash
codesynapse
```

This will:
1. Start the visualization server on `http://localhost:3004`
2. Automatically open your browser
3. Begin watching your project directory
4. If port 3004 is in use, it will automatically try the next available port

### Command Line Options

```bash
codesynapse [options]

Options:
  --port <port>     Specify port (default: 3004)
  --no-open         Don't automatically open browser
```

Examples:

```bash
# Run on a different port
codesynapse --port 8080

# Don't auto-open browser
codesynapse --no-open
```

### Using the Visualization

1. **Start Watching** - Click "Start Watching" to begin monitoring your project
2. **Explore the Graph** - Drag to rotate, scroll to zoom, click nodes to view code
3. **Watch Changes** - Edit files and see them light up in real-time:
   - Green (0-5s) - Just changed, pulsing
   - Amber (5-30s) - Recently active
   - Yellow (30-60s) - Cooling down
   - Blue/Purple/etc. - Stable (color by file type)
4. **View Code** - Click any node to see syntax-highlighted code and git diffs
5. **Toggle Theme** - Click the sun/moon icon for light/dark mode

### Controls

- **Mouse drag**: Rotate the camera
- **Scroll**: Zoom in/out
- **Click node**: View file details and git diff
- **Hover node**: See file info tooltip

## 🏗️ Architecture

```
code-synapse/
├── server/              # Node.js + Express + Socket.io backend
│   ├── FileWatcher.ts   # Real-time file monitoring (Chokidar)
│   ├── DependencyParser.ts  # AST parsing (@babel/parser)
│   ├── GitIntegration.ts    # Git diff tracking (simple-git)
│   ├── GraphBuilder.ts      # Graph data structure
│   └── index.ts            # WebSocket server
│
├── client/              # React + Three.js frontend
│   ├── components/
│   │   ├── Graph3D.tsx      # 3D visualization (react-force-graph-3d)
│   │   ├── DiffPanel.tsx    # Git diff viewer
│   │   ├── Controls.tsx     # UI controls
│   │   └── Stats.tsx        # Live statistics
│   └── hooks/
│       └── useWebSocket.ts  # Socket.io client
```

### Tech Stack

**Backend:**
- Express - HTTP server
- Socket.io - Real-time WebSocket communication
- Chokidar - File system watching
- @babel/parser - JavaScript/TypeScript AST parsing
- simple-git - Git integration

**Frontend:**
- React 18 - UI framework
- Three.js - 3D graphics
- react-force-graph-3d - Force-directed graph layout
- Socket.io-client - Real-time updates

**Language:**
- TypeScript throughout for type safety

## 🎨 Visualization Details

### Node Colors

Files are colored by type:
- JavaScript (.js, .jsx, .mjs, .cjs) - Yellow
- TypeScript (.ts, .tsx) - Blue
- JSON (.json) - Green
- Styles (.css, .scss, .sass, .less) - Purple
- Markup (.html) - Red
- Markdown (.md) - Green
- Other files - Gray

### Node Size

Nodes scale based on:
- Number of connections (imports/exports)
- File size
- Change frequency

### Visual Effects

- **Pulse animation**: Recently changed files glow cyan and pulse
- **Particle flow**: Particles travel along dependency connections
- **Glow aura**: All nodes have a subtle glow effect
- **Connection highlighting**: Hover to see connected files

## Use Cases

### 1. Understanding Codebases
Quickly visualize the structure and dependencies of unfamiliar projects.

### 2. Watching AI Agents
See exactly what files an AI agent is modifying in real-time.

### 3. Refactoring
Understand the impact of changes by seeing which files are connected.

### 4. Code Reviews
Visualize the scope of changes in a pull request.

### 5. Teaching
Help others understand project architecture visually.

## ⚙️ Configuration

Create a `.codesynapse.json` file in your project root:

```json
{
  "ignorePatterns": [
    "**/node_modules/**",
    "**/.git/**",
    "**/dist/**",
    "**/build/**"
  ],
  "colors": {
    "javascript": "#f1e05a",
    "typescript": "#2b7489",
    "json": "#00d084"
  }
}
```

## 🔧 Development

### Project Structure

```bash
npm run dev           # Start both server and client
npm run build         # Build for production
npm start            # Run production build
```

### Server Development

```bash
cd server
npm run dev          # Start with hot reload
npm run build        # Compile TypeScript
```

### Client Development

```bash
cd client
npm run dev          # Start React dev server
npm run build        # Build for production
```

## 🐛 Troubleshooting

### "Not a git repository" message
This is normal if the directory you're watching isn't a git repo. Git features will be disabled but file watching still works.

### Large codebases slow
Try adjusting physics settings or filtering file types in the configuration.

### Connection issues
Make sure both server (3001) and client (3000) ports are available.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Contact

**Christian Johnson**
Email: [cjohnson@metisos.co](mailto:cjohnson@metisos.co)
GitHub: [@metisos](https://github.com/metisos)

## License

MIT License - feel free to use this in your own projects!

## 🙏 Acknowledgments

Built with:
- [Chokidar](https://github.com/paulmillr/chokidar) - File watching
- [react-force-graph](https://github.com/vasturiano/react-force-graph) - 3D visualization
- [Babel](https://babeljs.io/) - AST parsing
- [Socket.io](https://socket.io/) - Real-time communication

## 🚀 Future Ideas

- Support for more languages (Python, Go, Rust, Java)
- Time-travel mode to replay changes
- Heatmap visualization for hot spots
- Multi-project view
- VR mode for immersive exploration
- VS Code extension
- Collaborative mode

---

Made for developers who love beautiful visualizations
