# Pool Scoreboard App

A simple, futuristic pool scoreboard application for tracking frames between two players.

## Features

- ✨ Futuristic, accessible UI with neon cyberpunk styling
- 🎯 Simple score tracking (frames) for two players
- ⏱️ Count-up timer with start/stop functionality
- 🔄 Reset button for new games
- ✏️ Editable player names
- 📱 Responsive design
- ♿ Fully accessible (ARIA labels, keyboard navigation, high contrast)

## Requirements

- [Bun](https://bun.sh) installed on your system

## Development

```bash
# Install dependencies
bun install

# Run in development mode
bun run dev
```

Open http://localhost:3000 in your browser.

## Production Build

```bash
# Build the app
bun run build

# Run in production mode
bun run start
```

## Docker

### Build the image

```bash
docker build -t pool-scoreboard .
```

### Run the container

```bash
docker run -p 3000:3000 pool-scoreboard
```

### With data volume (for future use)

```bash
docker run -p 3000:3000 -v $(pwd)/data:/app/data pool-scoreboard
```

Open http://localhost:3000 in your browser.

## Usage

1. **Edit Player Names**: Click on the player name fields to edit
2. **Start Timer**: Click "Start Timer" to begin counting up from 00:00
3. **Score a Frame**: Click "+ Frame" for the player who won the frame
   - Timer automatically stops when scoring
4. **New Game**: Click "New Game" to reset all scores and the timer
5. **Restart Timer**: Click "Start Timer" again to reset and restart from 00:00

## Architecture

- **Frontend**: React 18 with TypeScript
- **Runtime**: Bun (server + bundler)
- **Styling**: Pure CSS with futuristic cyberpunk theme
- **Container**: Single Docker image with data mount point
- **State**: Local React state (no persistence)
