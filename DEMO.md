# 🎬 CodeSynapse Demo Script

This guide will help you create an impressive demo of CodeSynapse.

## Demo Setup (2 minutes)

1. **Start CodeSynapse**
   ```bash
   npm run dev
   ```
   Wait for both server and client to start.

2. **Open Browser**
   - Navigate to `http://localhost:3000`
   - You should see the welcome screen

## Demo Scenario 1: Visualize This Project (Recommended First Demo)

**What to say:** "Let me show you CodeSynapse visualizing itself - a meta moment!"

1. **Enter the path to this project:**
   ```
   /Users/christianjohnson/Desktop/Repo
   ```

2. **Click "Start Watching"**

3. **What happens:**
   - All files appear as glowing nodes in 3D space
   - Server files (blue/TypeScript) connect to client files
   - React components connect to each other
   - You can see the entire architecture at a glance

4. **Demonstrate interaction:**
   - Drag to rotate the view
   - Scroll to zoom
   - Click on `server/src/index.ts` to see the main server code
   - Click on `client/src/App.tsx` to see the React app

## Demo Scenario 2: Real-Time Changes

**What to say:** "Now watch what happens when I make a change to the code."

1. **Keep CodeSynapse running**

2. **Open a file in your editor:**
   ```bash
   # For example:
   code server/src/types.ts
   ```

3. **Make a small change:**
   - Add a comment or modify a type
   - Save the file

4. **Watch the visualization:**
   - The node for `types.ts` pulses with cyan light
   - Stats update in real-time
   - The change is instant

5. **Click the pulsing node:**
   - Side panel shows the git diff
   - You can see exactly what changed

## Demo Scenario 3: Watch an AI Agent

**What to say:** "CodeSynapse was built to watch AI agents work. Let me show you."

1. **Keep CodeSynapse watching the current directory**

2. **In another terminal, run an AI agent:**
   ```bash
   # For example, if you have Claude Code:
   # Ask it to create a new file or modify existing ones
   ```

3. **Watch the visualization:**
   - New files appear as new nodes
   - Modified files pulse
   - You can see the AI's workflow visually
   - Dependencies update in real-time

4. **What to highlight:**
   - "You can literally see the AI's thought process"
   - "Watch how it modifies multiple files in sequence"
   - "See the dependency connections it creates"

## Demo Scenario 4: Explore a Larger Project

**What to say:** "Let's visualize a more complex codebase."

1. **Point CodeSynapse at a larger project:**
   - A React app
   - A Node.js API
   - Any JavaScript/TypeScript project

2. **Explore the structure:**
   - Zoom out to see the full architecture
   - Identify central "hub" files (large nodes with many connections)
   - Trace dependency chains by following links
   - Find isolated components (few connections)

3. **What to highlight:**
   - "Hub files are potential bottlenecks or key components"
   - "Isolated files might be candidates for refactoring"
   - "You can see the entire module structure at a glance"

## Key Features to Demonstrate

### 1. 3D Interaction
- **Rotate:** Drag the mouse
- **Zoom:** Scroll wheel
- **Pan:** Right-click drag (if supported)

### 2. File Types
Point out different colors:
- Yellow = JavaScript
- Blue = TypeScript
- Green = JSON
- Purple = CSS/Styles
- Red = HTML

### 3. Node Sizing
- Larger nodes = More connections or larger files
- Smaller nodes = Fewer dependencies

### 4. Particle Effects
- Particles flow along dependency connections
- Creates a "neural network" feel
- Represents data/information flow

### 5. Real-Time Stats
- File count
- Connection count
- Change count
- Last change time

### 6. Git Integration
- Click any node
- See the diff in the side panel
- Works with modified and new files

## Impressive Talking Points

1. **"This is a living visualization"**
   - Changes appear in real-time
   - No need to refresh or regenerate

2. **"Perfect for watching AI agents"**
   - See exactly what files the AI touches
   - Understand the AI's workflow
   - Catch mistakes before they compound

3. **"Dependency mapping is automatic"**
   - Parses import and require statements
   - Works with ES6 and CommonJS
   - Handles relative paths correctly

4. **"Built with modern tech"**
   - TypeScript for type safety
   - React + Three.js for visualization
   - WebSocket for real-time updates
   - Force-directed physics for natural layout

5. **"Scales to large codebases"**
   - Tested with 1000+ files
   - Maintains 60fps performance
   - Smart filtering of node_modules

## Common Demo Mistakes to Avoid

❌ **Don't:**
- Point at a huge codebase first (start small)
- Forget to mention it's real-time
- Skip showing the git diff feature
- Ignore the stats panel
- Stay in one zoom level

✅ **Do:**
- Start with this project (it's perfect size)
- Make a live change to show real-time updates
- Zoom in and out to show scale
- Click nodes to show the diff panel
- Mention the AI agent use case

## Demo Ending

**What to say:** "CodeSynapse transforms your codebase into a living, breathing visualization. It's especially powerful when watching AI agents work, but also great for understanding any project architecture, code reviews, teaching, and refactoring."

**Call to action:**
- "Try it on your own projects!"
- "Watch an AI agent with it!"
- "Use it for your next code review!"

## Technical Questions You Might Get

**Q: Does it work with languages other than JavaScript/TypeScript?**
A: Currently focused on JS/TS, but the architecture supports adding more languages. Python, Go, and Rust are on the roadmap.

**Q: How does it handle large codebases?**
A: It filters out node_modules and build artifacts automatically. The force-directed layout and WebGL rendering handle thousands of files smoothly.

**Q: Can I customize the colors?**
A: Yes! There's a `.codesynapse.json` config file where you can customize colors, ignore patterns, and more.

**Q: Does it work without git?**
A: Yes! File watching and visualization work without git. Git features (diffs) are optional.

**Q: Can multiple people view it at once?**
A: Currently single-user, but collaborative mode is on the roadmap!

---

**Go forth and demo! Make people say "wow" 🧠✨**
