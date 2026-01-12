# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Excalidraw is an open-source, collaborative whiteboard application with end-to-end encryption. The repository is a **Yarn monorepo** consisting of:

- **@excalidraw/math** - Pure math utilities (vectors, geometry, curves)
- **@excalidraw/common** - Shared constants, utilities, type definitions
- **@excalidraw/element** - Element data structures and manipulation logic
- **@excalidraw/excalidraw** - Main React component library (exported to npm)
- **@excalidraw/utils** - Export/import and rendering utilities
- **excalidraw-app** - The standalone web application (not published to npm)
- **examples/** - Integration examples

## Development Workflow

### Node Version

Requires Node.js >= 18.0.0

### Install Dependencies

```bash
yarn install
```

### Starting Development

**For the web app:**

```bash
yarn start
```

Starts the dev server at http://localhost:3000 with hot reload.

**For production build:**

```bash
yarn build
```

**For specific package development:**

```bash
yarn build:packages     # Build all core packages
yarn build:excalidraw  # Build only the React component package
```

### Testing

**Run all tests:**

```bash
yarn test:all
```

**Run component/feature tests (Vitest):**

```bash
yarn test:app           # Watch mode
yarn test:app --watch=false  # Single run
```

**Run a specific test file:**

```bash
yarn test:app src/path/to/file.test.tsx --watch=false
```

**TypeScript checking:**

```bash
yarn test:typecheck
```

**Linting:**

```bash
yarn test:code          # Check ESLint violations
yarn fix:code           # Auto-fix ESLint issues
```

**Code formatting:**

```bash
yarn fix:other          # Format CSS, JSON, Markdown, etc.
yarn test:other         # Check if formatting matches
```

**Test coverage:**

```bash
yarn test:coverage
yarn test:ui            # View coverage in browser UI
```

### Code Quality

**Run the full test suite before creating PRs:**

```bash
yarn test:all
```

The CI pipeline runs:

1. TypeScript type checking
2. ESLint code quality (0 warnings allowed)
3. Prettier formatting checks
4. Vitest component tests

## Architecture Overview

### Package Hierarchy

```
@excalidraw/math (no dependencies)
  ↓
@excalidraw/common (uses math)
  ↓
@excalidraw/element (uses common, math)
  ↓
@excalidraw/excalidraw (uses all above, React/Radix/jotai)
  ↓
excalidraw-app (uses all packages, adds Firebase/Socket.io/collaboration)
```

### Key Directories

**packages/excalidraw/**

- `src/` - React components and core logic
- `src/actions/` - User action handlers (drag, resize, delete, etc.)
- `src/components/` - UI components (sidebar, canvas, menus)
- `src/renderer/` - Canvas rendering logic
- `src/scene/` - Scene management and data structure
- `tests/` - Integration and component tests

**excalidraw-app/**

- `components/` - App-specific UI components
- `actions/` - App-specific action handlers
- `data/` - Persistence and collaboration logic
- `collab/` - Real-time collaboration features
- `locales/` - i18n translations (61+ languages)
- `tests/` - App integration tests

### State Management

- **jotai** - Atomic state management for reactive UI
- **History** - Undo/Redo via immutable state snapshots
- **Scene** - Canvas element data structure

### Testing Patterns

Tests use Vitest with React Testing Library. Key helpers:

- `excalidraw-app/tests/` - App-level test utilities
- Tests mock canvas APIs (jsdom doesn't support canvas)
- Event helpers for keyboard/mouse/touch input
- History snapshot testing for undo/redo
- Element creation and manipulation helpers

## Code Standards

### TypeScript

- Use TypeScript for all new code
- Prefer immutable data (`const`, `readonly`)
- Use optional chaining (`?.`) and nullish coalescing (`??`)
- When writing math-related code, always reference `packages/math/src/types.ts` and use the `Point` type instead of `{ x, y }`

### React

- Use functional components with hooks
- Follow React hooks rules (no conditional hooks)
- Keep components small and focused
- Use CSS modules for styling (`.module.css` files)

### Naming

- **PascalCase** - Components, interfaces, type aliases
- **camelCase** - Variables, functions, methods
- **ALL_CAPS** - Constants

### Performance

- Prefer implementations without allocation when possible
- Trade RAM for CPU cycles (use memoization, caching)
- Avoid unnecessary renders in performance-critical code

### Testing

- Write tests for new features and bug fixes
- Test user interactions and state changes
- Run `yarn test:app` after changes to verify tests pass

## Common Tasks

### Adding a New Action Property

When adding a property slider or control to the properties panel:

1. Define the action in `packages/excalidraw/actions/`
2. Wire it into `packages/excalidraw/actions/actionProperties.tsx` using the `action-integration-agent`
3. Add Vitest tests following existing patterns

### Writing Tests

- Use Vitest for unit and integration tests
- Use React Testing Library for component testing
- Canvas rendering tests require mocking (vitest-canvas-mock)
- Check `excalidraw-test-patterns` for critical test patterns to avoid common mistakes

### Modifying Core Element Logic

- Review `packages/element/src/` for existing patterns
- Element binding, collision detection, and transformations are heavily tested
- Run `yarn test:app --watch=false` to verify changes don't break existing tests

### Adding New Packages

Packages should follow the hierarchy. New packages go in `packages/` with:

- `src/` for TypeScript source
- `tests/` for test files
- `package.json` with proper dependencies

## Important Files

- `package.json` - Monorepo root with workspace definitions and scripts
- `packages/math/src/types.ts` - Core geometric types (Point, etc.)
- `packages/element/src/types.ts` - Element data structures
- `packages/excalidraw/src/index.tsx` - Main React component export
- `.github/copilot-instructions.md` - Additional coding standards
