# 🚀 Quick Start Guide - CodeSynapse

## What You Built

**CodeSynapse** is a real-time codebase visualization tool that displays your code as a 3D neural network. Files appear as glowing nodes and dependencies as connections between them. When you make changes, nodes pulse with light!

## Running CodeSynapse

### Step 1: Install Dependencies (First Time Only)

```bash
npm install
```

### Step 2: Start the Application

```bash
npm run dev
```

This starts:
- **Server** at `http://localhost:3001` (backend)
- **Client** at `http://localhost:3000` (opens in browser automatically)

### Step 3: Visualize Your Code

1. Open browser to `http://localhost:3000`
2. Enter a directory path (e.g., `/Users/yourname/projects/my-project`)
3. Click "Start Watching"
4. Watch your codebase materialize as a 3D neural network!

## What You'll See

### 🎨 The Visualization

- **Nodes (spheres)** = Your files
  - Yellow = JavaScript
  - Blue = TypeScript
  - Green = JSON
  - Purple = CSS/Styles
  - Different sizes based on connections

- **Links (lines with particles)** = Dependencies (imports/requires)
  - Particles flow along connections
  - Glowing connections between related files

- **Pulses** = Recent changes
  - Changed files glow cyan and pulse
  - See changes happen in real-time

### 🎮 Controls

- **Mouse drag**: Rotate the 3D view
- **Scroll**: Zoom in/out
- **Click node**: View git diff in side panel
- **Hover node**: See file info

### 📊 Stats (Bottom Left)

Shows live metrics:
- Number of files
- Number of connections
- Total changes
- Last change time

## Try It Out!

### Example 1: Watch This Project

```
# In the CodeSynapse UI, enter:
/Users/christianjohnson/Desktop/Repo
```

You'll see CodeSynapse visualizing itself!

### Example 2: Make Changes

1. Start watching a directory
2. Open a file in that directory with your editor
3. Make some changes and save
4. Watch the node pulse with cyan light!
5. Click the node to see the git diff

### Example 3: Watch an AI Agent

1. Start CodeSynapse and watch a project
2. Run an AI agent (like Claude Code) on the same project
3. Watch files light up as the AI makes changes
4. See the neural network grow in real-time

## Troubleshooting

### Server won't start
- Check if port 3001 is available
- Make sure dependencies are installed

### Client won't start
- Check if port 3000 is available
- Try `npm run dev` again

### "Not a git repository" message
- This is normal if the directory isn't a git repo
- File watching still works, just no git diff feature

### Can't see any files
- Make sure the path is correct and absolute (full path)
- Check that the directory has files to visualize

## Production Build

```bash
# Build everything
npm run build

# Run production server
npm start
```

## Stopping the App

Press `Ctrl+C` in the terminal where `npm run dev` is running.

## Next Steps

- Read the full [README.md](./README.md) for detailed docs
- Check [.codesynapse.json](./.codesynapse.json) for configuration options
- Explore the code in `server/` and `client/` directories

## Have Fun!

CodeSynapse turns coding into a visual experience. Watch your codebase grow, pulse, and evolve like a living organism. Perfect for:

- Understanding complex projects
- Watching AI agents work
- Teaching code architecture
- Making code reviews more visual
- Just having fun with your code!

---

**Enjoy watching your code come alive! 🧠✨**
