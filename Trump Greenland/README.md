# Trump Greenland Game

A 2D side-scrolling satirical political adventure game featuring interactions in Greenland and the Oval Office.

## File Structure

```
Trump Greenland/
├── index.html              # Main HTML file
├── styles.css              # All CSS styles
├── js/                     # JavaScript modules
│   ├── game.js            # Main game initialization and loop
│   ├── gameState.js       # Game state management and utilities
│   ├── ui.js              # UI management (prompts, inventory, dialogs)
│   ├── player.js          # Player character logic and appearance
│   ├── scenes.js          # Scene management (Greenland & Oval Office)
│   └── input.js           # Input handling and controls
└── README.md              # This file
```

## How to Run

1. Serve the files using a local HTTP server (required for ES6 modules):
   ```bash
   python3 -m http.server 8080
   ```
   or
   ```bash
   npx serve .
   ```

2. Open your browser to `http://localhost:8080`

## Controls

- **Arrow Keys (←/→)**: Move left/right
- **Space**: Interact with objects
- **I**: Toggle inventory
- **1-3**: Use inventory items
- **Escape**: Close dialogs

## Game Features

- Two scenes: Greenland and Oval Office
- Interactive objects: mine, phone, bear, helicopter, etc.
- Inventory system with 3 items (self-tanner, trophy, MAGA cap)
- Character appearance changes based on items used
- Speech bubbles and tweet functionality
- Scene transitions with fade effects

## Architecture

The game uses ES6 modules for better code organization:

- **gameState.js**: Centralized game state and utility functions
- **ui.js**: Handles all UI elements (speech bubbles, inventory, prompts)
- **player.js**: Manages player appearance, movement, and item usage
- **scenes.js**: Creates and manages Greenland and Oval Office scenes
- **input.js**: Handles keyboard input and player movement
- **game.js**: Main game class that coordinates all modules

## Development

The codebase has been refactored from a single-file HTML application to a modular ES6 structure for better maintainability and future development.