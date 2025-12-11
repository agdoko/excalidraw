# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Excalidraw** is an open-source, collaborative whiteboard drawing application. The codebase is organized as a **monorepo** using Yarn workspaces containing:

- **`packages/excalidraw/`** - Main editor component (npm-distributed, ~60 subdirectories)
- **`packages/common/`** - Shared constants, types, utilities
- **`packages/element/`** - Element types, mutations, versioning
- **`packages/math/`** - Vector math, geometry transformations
- **`packages/utils/`** - Export helpers, file utilities
- **`excalidraw-app/`** - Web application at excalidraw.com (PWA, collaboration, E2E encryption)
- **`examples/`** - Integration examples (Next.js, browser script)

## Development Commands

### Build & Installation

```bash
yarn install              # Install dependencies
yarn build              # Build the full excalidraw-app production bundle
yarn build:packages     # Build all distributable packages (common, math, element, excalidraw)
yarn build:app          # Build web app only
```

### Development Server

```bash
yarn start              # Run dev server with hot reload (default: http://localhost:3000)
yarn start:production   # Run production build locally
```

### Testing

```bash
yarn test               # Run tests in watch mode (default for single test: vitest [pattern])
yarn test:app           # Run all tests with Vitest
yarn test:all           # Run typecheck + eslint + prettier + tests
yarn test:typecheck     # TypeScript type checking (tsc)
yarn test:code          # ESLint check
yarn test:other         # Prettier formatting check
yarn test:coverage      # Generate coverage report
yarn test:coverage:watch # Coverage in watch mode
yarn test:ui            # Run tests with visual UI
yarn test:update        # Update test snapshots
```

### Code Quality

```bash
yarn fix                # Auto-fix all code issues
yarn fix:code           # Auto-fix ESLint issues
yarn fix:other          # Auto-fix Prettier formatting
yarn prettier --list-different  # Check formatting only
```

### Single Test Execution

```bash
# Run specific test file
vitest packages/excalidraw/tests/some-feature.test.ts

# Run tests matching a pattern
vitest --grep "arrow binding"

# Run in watch mode for a specific test
vitest packages/excalidraw/tests/some-feature.test.ts --watch
```

## Architecture Overview

### Layered Architecture

```
┌─────────────────────────────────────────────┐
│  UI Components (150+ React components)      │ packages/excalidraw/components/
├─────────────────────────────────────────────┤
│  State Management (Jotai + React hooks)     │ editor-jotai.ts, hooks/
├─────────────────────────────────────────────┤
│  Actions (46+ action handlers)              │ actions/
├─────────────────────────────────────────────┤
│  Data Layer (serialization, encryption)     │ data/
├─────────────────────────────────────────────┤
│  Scene & Element Management                 │ scene/, @excalidraw/element
├─────────────────────────────────────────────┤
│  Rendering (Canvas + RoughJS)               │ renderer/
├─────────────────────────────────────────────┤
│  Utilities (math, constants, types)         │ @excalidraw/common, @excalidraw/math
└─────────────────────────────────────────────┘
```

### Key Architectural Patterns

**Actions Pattern** (`packages/excalidraw/actions/`)

- 46+ action files handling user interactions
- Pure functions that dispatch state updates
- Modular: one action file per feature (align, clipboard, canvas, export, etc.)
- Dispatched from UI via `actionManager.executeAction()`

**Scene Graph** (`packages/excalidraw/scene/`)

- Central store maintaining: elements, appState, selectedElements
- Element versioning for undo/redo support
- Rendering queue management

**Element System** (`@excalidraw/element`)

- Type-safe element mutations with builders
- Immutable element updates
- Version tracking for every element

**State Management** (`editor-jotai.ts`)

- Jotai atoms for reactive state
- Custom hooks (useEditorInterface) for component access
- Context provider: `EditorJotaiProvider`

**Rendering** (`packages/excalidraw/renderer/`)

- Canvas-based 2D rendering
- RoughJS integration for hand-drawn aesthetic
- Element-specific renderers for shapes, text, arrows

### Path Aliases (TypeScript)

All packages can be imported via aliases configured in `tsconfig.json` and `vitest.config.mts`:

```typescript
import { Point } from "@excalidraw/math/types";
import { mutateElement } from "@excalidraw/element/mutateElement";
import { getNormalizedZoom } from "@excalidraw/common/zoom";
```

## Important Files & Entry Points

- **`packages/excalidraw/index.tsx`** - Main component export (App + Excalidraw wrapper)
- **`packages/excalidraw/types.ts`** - Type definitions for public API
- **`packages/math/src/types.ts`** - Point type (always use instead of `{ x, y }`)
- **`excalidraw-app/src/App.tsx`** - Web application entry point
- **`excalidraw-app/collab/`** - Real-time collaboration (Socket.io, Firebase)
- **`excalidraw-app/data/`** - Data persistence and encryption

## Key Development Patterns

### Using Point Type

Always use the `Point` type from `@excalidraw/math/types` instead of inline `{ x, y }` objects:

```typescript
import { Point } from "@excalidraw/math/types";
const point: Point = { x: 10, y: 20 };
```

### Element Mutations

Use builders from `@excalidraw/element` for type-safe mutations:

```typescript
import { mutateElement } from "@excalidraw/element/mutateElement";

mutateElement(element, { x: newX, y: newY });
```

### Testing

- Test environment: jsdom with Vitest
- Setup file: `setupTests.ts`
- Coverage thresholds: lines 60%, branches 70%, functions 63%
- Use React Testing Library patterns for component tests
- Canvas operations use `vitest-canvas-mock`

## Code Standards (from copilot-instructions.md)

**TypeScript Guidelines:**

- Use TypeScript for all new code
- Prefer immutable data (const, readonly)
- Use optional chaining (`?.`) and nullish coalescing (`??`)
- Avoid allocations where possible; trade RAM for CPU

**React Guidelines:**

- Functional components with hooks only
- Follow hooks rules (no conditional hooks)
- Keep components small and focused
- Use CSS modules for styling

**Naming:**

- PascalCase for components, interfaces, types
- camelCase for variables, functions, methods
- ALL_CAPS for constants

**General:**

- Stop apologizing when corrected; provide correct info/code
- Prefer code over explanations unless asked
- Be succinct in communication

## Debugging Tips

- **Hot Reload Issues:** Clear `packages/*/dist` and restart dev server
- **Import Path Issues:** Check `tsconfig.json` path aliases match actual file locations
- **Test Failures:** Run `yarn test:update` to update snapshots if intentional changes made
- **Type Errors:** Run `yarn test:typecheck` to find all type issues

## Resources

- [Development Guide](https://docs.excalidraw.com/docs/introduction/development)
- [Contributing Guide](https://docs.excalidraw.com/docs/introduction/contributing)
- [API Documentation](https://docs.excalidraw.com)
- [Discord Community](https://discord.gg/UexuTaE)
