# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Excalidraw** is an open-source virtual whiteboard for creating hand-drawn style diagrams with real-time collaboration and end-to-end encryption. It's distributed as both a reusable React component library (`@excalidraw/excalidraw` npm package) and a standalone web application at excalidraw.com.

This is a **Yarn Workspaces monorepo** organized into publishable packages and the web application.

## Essential Commands

### Development

- `yarn start` - Start the development server for the web application
- `yarn build:packages` - Build all packages (common, math, element, excalidraw)
- `yarn build:app` - Build the web application for production

### Testing

- `yarn test:app` - Run unit tests (Vitest) with watch mode
- `yarn test:app --watch=false` - Run all tests once
- `yarn test:all` - Run typecheck, lint, format, and unit tests
- `yarn test:typecheck` - Run TypeScript type checking only
- `yarn test:code` - Run ESLint with max-warnings=0
- `yarn test:other` - Check Prettier formatting
- `yarn test:coverage` - Generate coverage reports
- `yarn test:ui` - Open Vitest UI with coverage

### Code Quality

- `yarn fix` - Run all formatters and linters with --fix
- `yarn fix:code` - Fix ESLint issues
- `yarn fix:other` - Fix Prettier formatting

### Cleanup

- `yarn rm:build` - Remove all build artifacts
- `yarn rm:node_modules` - Remove all node_modules
- `yarn clean-install` - Full clean reinstall

## Monorepo Structure

```
packages/
├── excalidraw/          # Main library (React component)
├── common/              # Shared utilities, constants, colors
├── element/             # Element types and utilities
├── math/                # 2D geometry utilities (vectors, curves, etc)
└── utils/               # Export and shape utilities

excalidraw-app/         # Standalone web application
examples/               # Integration examples
```

### Package Paths (tsconfig.json)

```typescript
// In components, use these aliases:
import { KEYS } from "@excalidraw/common";
import { Point } from "@excalidraw/math";
import { ElementType } from "@excalidraw/element";
import { Excalidraw } from "@excalidraw/excalidraw";
```

## Architecture

### Rendering Pipeline

- **Custom Canvas renderer** (`packages/excalidraw/renderer/`) - Not SVG-based, optimized Canvas rendering
- **Scene management** (`packages/excalidraw/scene/`) - Abstraction over canvas operations
- **Interactive vs Static** - Separate rendering paths (interactive for editing, static for export)

### State Management

- **Jotai atoms** - Reactive, minimal boilerplate state
- **AppState** (`packages/excalidraw/appState.ts`) - Centralized drawing state (selectedElements, activeTool, zoom, etc)
- **EditorJotaiProvider** - Scoped state isolation for embedded instances

### Element System

- **Element types** - Discriminated unions (rectangle, diamond, ellipse, arrow, line, freedraw, text, image)
- **Immutable updates** - Elements never mutated directly; updates return new copies
- **Linear elements** - Special handling for arrows, lines with points array
- **Element binding** - Arrow-to-element connections with label support

### Actions

- **Action registry** (`packages/excalidraw/actions/`) - 44+ action handlers
- **Action pattern** - Actions receive state and return update functions
- **UI Options API** - Customize available tools/actions via `UIOptions` prop

### Data Format

- **`.excalidraw` format** - JSON with version support for migrations
- **Encryption** (`packages/excalidraw/data/`) - Client-side encryption for sharing
- **Compression** - Uses pako (gzip) for data compression

### Collaboration (excalidraw-app only)

- **Socket.IO** - Real-time WebSocket communication
- **End-to-end encryption** - Data encrypted before transmission
- **Incremental syncing** - Only changes transmitted, not full state
- **Conflict resolution** - Operational transformation-like logic

## Key Files and Patterns

### Core App Entry Points

- `packages/excalidraw/index.tsx` - Public API component wrapping `App` with Jotai provider
- `packages/excalidraw/components/App.tsx` - Main editor component
- `excalidraw-app/App.tsx` - Web app wrapper with collaboration features
- `excalidraw-app/index.tsx` - App initialization, service worker registration

### Important Type Definitions

- `packages/excalidraw/types.ts` - Core type exports (Element, AppState, etc)
- `packages/element/src/types/index.ts` - Element type hierarchy
- `packages/math/src/types.ts` - Point, Vector types (use Point instead of `{ x, y }`)
- `packages/common/src/keys.ts` - Keyboard key handling

### Component Organization

- `components/App.tsx` - Main app orchestrator
- `components/Actions.tsx` - Toolbar and action buttons
- `components/Sidebar/` - Right sidebar with element properties
- `components/main-menu/MainMenu.tsx` - File menu
- `components/canvases/` - Canvas rendering components
- `components/ColorPicker/` - Color UI
- `components/CommandPalette/` - Command search interface

### Actions Pattern

- `actions/actionProperties.tsx` - Property panel actions
- `actions/actionCanvas.tsx` - Canvas manipulation
- `actions/actionElement.tsx` - Element operations
- Each action file exports actions for a feature area

## Development Guidelines

### TypeScript & Performance

- Use TypeScript for all new code
- Prefer performant solutions; trade RAM for CPU cycles when beneficial
- Use `const` and `readonly` for immutability
- Use optional chaining (`?.`) and nullish coalescing (`??`)
- For geometry/math work, always include `packages/math/src/types.ts` and use `Point` type instead of `{ x, y }`

### React Components

- Use functional components with hooks
- Follow React hooks rules (no conditional hooks)
- Keep components small and focused
- Use CSS modules for styling

### Naming Conventions

- `PascalCase` - Component names, interfaces, type aliases
- `camelCase` - Variables, functions, methods
- `ALL_CAPS` - Constants

### Testing Guidelines

- Use Vitest + Testing Library for unit tests
- Write tests for new utilities and components
- Always run `yarn test:app` after modifications
- Attempt to fix any failing tests before completing work
- Use `yarn test:update` to update snapshots when appropriate

### Code Quality Standards (from .github/copilot-instructions.md)

- Be succinct in explanations
- Avoid unnecessary summaries after code changes
- Use code-first approach unless explanation specifically requested
- Prefer immutable data patterns
- Implement proper error boundaries in React components
- Always log errors with contextual information

## Styling

- **CSS Modules** - Component-scoped styles (`.module.scss`)
- **Sass** - CSS preprocessing with variables and nesting
- **Dark mode** - CSS variables for theme switching
- **BEM conventions** - Block\_\_Element--Modifier pattern

## Common Patterns

### Updating Elements

```typescript
// Don't mutate directly:
element.x = 100; // ❌

// Return new element:
{ ...element, x: 100 } // ✅
```

### Using Points for Geometry

```typescript
import { Point } from "@excalidraw/math";

// Avoid:
const pos = { x: 10, y: 20 }; // ❌

// Use Point type:
const pos: Point = [10, 20]; // ✅
```

### Creating Actions

```typescript
// In packages/excalidraw/actions/
export const actionMyFeature = register({
  name: "myFeature",
  label: "labels.myFeature",
  perform: (elements, appState) => {
    return {
      elements: newElements,
      appState: newAppState,
      storeAction: StoreAction.CAPTURE,
    };
  },
});
```

### Accessing App State with Jotai

```typescript
import { useAtom } from "jotai";
import { appStateAtom } from "@excalidraw/excalidraw";

const MyComponent = () => {
  const [appState, setAppState] = useAtom(appStateAtom);
  // use appState...
};
```

## Performance Considerations

- **Canvas rendering** - Batch operations; avoid per-frame mutations
- **Code splitting** - Locales and heavy modules lazy-loaded
- **Memoization** - Use React.memo for expensive components
- **Virtual scrolling** - Only visible elements rendered in large lists
- **Debounce/throttle** - Input event optimization using lodash utilities

## Troubleshooting

### Build Issues

- Clean install with `yarn clean-install` if dependencies seem corrupted
- Remove artifacts with `yarn rm:build` before rebuilding
- Check `tsconfig.json` path aliases are correct when importing from packages

### Test Failures

- Run `yarn test:app --watch=false` to see all failures
- Use `yarn test:update` to update snapshots if intentional
- Check that modified components still render correctly with `yarn test:app`

### TypeScript Errors

- Run `yarn test:typecheck` to see all type issues
- Ensure imports use correct package aliases
- For math-related code, verify Point type is imported from `@excalidraw/math`

## Additional Resources

- **Official docs**: https://docs.excalidraw.com/
- **Development guide**: https://docs.excalidraw.com/docs/introduction/development
- **Contributing guide**: https://docs.excalidraw.com/docs/introduction/contributing
- **Discord**: https://discord.gg/UexuTaE
- **Dev docs**: `/dev-docs/` directory in this repository
