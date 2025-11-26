# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Excalidraw is an open-source virtual hand-drawn style whiteboard that is collaborative and end-to-end encrypted. The project is a **monorepo** with a clear separation between the core library and the application.

## Repository Structure

- **`packages/excalidraw/`** - Main React component library published to npm as `@excalidraw/excalidraw`
- **`excalidraw-app/`** - Full-featured web application (excalidraw.com) that uses the library
- **`packages/common/`** - Shared common utilities
- **`packages/element/`** - Element-related utilities and types
- **`packages/math/`** - Math functions for 2D geometry (vectors, points, curves, polygons)
- **`packages/utils/`** - General utility functions
- **`examples/`** - Integration examples (NextJS, browser script)

## Development Commands

### Starting Development
```bash
yarn start              # Start the app (excalidraw-app) with Vite dev server
yarn start:production   # Build and serve production version locally
```

### Building
```bash
yarn build              # Build the app
yarn build:app          # Build just the app (excalidraw-app)
yarn build:packages     # Build all packages (common, math, element, excalidraw)
yarn build:excalidraw   # Build just the excalidraw package
```

### Testing
```bash
yarn test               # Run tests in watch mode (alias for yarn test:app)
yarn test:app           # Run vitest tests
yarn test:update        # Run all tests and update snapshots (use before committing)
yarn test:typecheck     # Run TypeScript type checking
yarn test:coverage      # Run tests with coverage report
yarn test:ui            # Run tests with Vitest UI
yarn test:all           # Run all tests (typecheck, code, other, app)
```

### Linting and Formatting
```bash
yarn fix                # Auto-fix both formatting and linting issues
yarn fix:code           # Fix ESLint issues
yarn fix:other          # Fix Prettier formatting
yarn test:code          # Run ESLint (no auto-fix)
yarn test:other         # Check Prettier formatting
```

### Cleaning
```bash
yarn rm:build           # Remove all build artifacts
yarn rm:node_modules    # Remove all node_modules
yarn clean-install      # Clean install (remove node_modules and reinstall)
```

## Architecture

### Monorepo Setup
- Uses **Yarn workspaces** for package management
- Package manager: `yarn@1.22.22`
- Node version: `>=18.0.0`
- Internal packages use path aliases defined in both `tsconfig.json` and `vitest.config.mts`

### Build System
- **Packages**: Built with esbuild (see `scripts/buildPackage.js`, `scripts/buildBase.js`)
- **App**: Built with Vite (see `excalidraw-app/vite.config.mts`)
- TypeScript throughout with strict configuration

### Path Aliases
The monorepo uses path aliases to reference internal packages:
```typescript
@excalidraw/common     -> packages/common/src/index.ts
@excalidraw/element    -> packages/element/src/index.ts
@excalidraw/excalidraw -> packages/excalidraw/index.tsx
@excalidraw/math       -> packages/math/src/index.ts
@excalidraw/utils      -> packages/utils/src/index.ts
```

### Package Exports
The main `@excalidraw/excalidraw` package exports:
- Production and development builds
- Separate CSS files
- Type definitions for all internal packages
- Supports conditional exports for development/production

## Coding Standards

### TypeScript
- Use TypeScript for all code
- Prefer immutable data (`const`, `readonly`)
- Use optional chaining (`?.`) and nullish coalescing (`??`)
- Where possible, prefer implementations without allocation
- Trade RAM usage for less CPU cycles when there's a choice

### React
- Use functional components with hooks
- Follow React hooks rules (no conditional hooks)
- Keep components small and focused
- Use CSS modules for component styling

### Naming Conventions
- PascalCase for component names, interfaces, and type aliases
- camelCase for variables, functions, and methods
- ALL_CAPS for constants

### Math Types
- Always use the Point types from `packages/math/src/types.ts` instead of `{ x, y }`
- The math package defines branded types: `GlobalPoint`, `LocalPoint`, `Vector`, `Line`, `Polygon`, `Curve`, `Ellipse`, etc.
- Include `packages/math/src/types.ts` in context when writing math-related code

### Error Handling
- Use try/catch blocks for async operations
- Implement proper error boundaries in React components
- Always log errors with contextual information

## Testing Workflow

1. Always attempt to fix problems reported by tests
2. After modifications are complete, offer to run `yarn test:app`
3. Before committing, always run `yarn test:update` to update snapshots
4. Use `yarn test:typecheck` to verify TypeScript correctness

## Communication Style

- Be succinct and concise - expansive answers are costly and slow
- Avoid unnecessary explanations unless asked
- Prefer code over explanations
- Don't apologize when corrected
- Don't summarize changes unless asked

## Test Configuration

- Test framework: Vitest with jsdom environment
- Coverage thresholds: lines 60%, branches 70%, functions 63%, statements 60%
- Test setup file: `setupTests.ts`
- Runs in parallel hook sequence mode

## Key Application Features

### Core Library (`packages/excalidraw`)
- Infinite canvas-based whiteboard
- Hand-drawn style rendering (using roughjs)
- Dark mode support
- Image support and shape libraries
- Localization (i18n) support
- Export to PNG, SVG, clipboard
- Open `.excalidraw` JSON format
- Tools: rectangle, circle, diamond, arrow, line, free-draw, eraser
- Arrow-binding and labeled arrows
- Undo/redo and zoom/panning

### App Features (`excalidraw-app`)
- PWA support (works offline)
- Real-time collaboration (Socket.IO)
- End-to-end encryption
- Local-first autosave (browser storage)
- Shareable links
- Firebase integration for data persistence
- Sentry for error tracking
