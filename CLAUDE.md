# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development

- **Start dev server**: `yarn start` (serves excalidraw-app at http://localhost:5173)
- **Build for production**: `yarn build` (builds excalidraw-app to `/build` directory)
- **Preview production build**: `yarn build:preview` (builds and serves at http://localhost:5000)

### Testing

- **Run all tests**: `yarn test:all` (runs typecheck, lint, formatting, and tests)
- **Run tests only**: `yarn test` or `yarn test:app` (runs Vitest in watch mode)
- **Run single test file**: `yarn test:app -- path/to/test.test.tsx`
- **Run specific test by pattern**: `yarn test:app -- -t "test name pattern"`
- **Coverage report**: `yarn test:coverage` (generates coverage report)
- **Interactive coverage UI**: `yarn test:ui` (opens Vitest UI with coverage)
- **Update snapshots**: `yarn test:update`

### Code Quality

- **Lint code**: `yarn test:code` (runs ESLint with zero warnings tolerance)
- **Fix linting issues**: `yarn fix:code` (auto-fix ESLint issues)
- **Check formatting**: `yarn test:other` (runs Prettier validation)
- **Fix formatting**: `yarn fix:other` (auto-format all supported files)
- **Typecheck**: `yarn test:typecheck` (runs TypeScript compiler)
- **Fix all issues**: `yarn fix` (runs all formatting and linting fixes)

### Package Management

- **Build all packages**: `yarn build:packages` (builds common, math, element, excalidraw)
- **Build individual package**: `yarn build:excalidraw` (or common/math/element)
- **Install dependencies**: `yarn install` or `yarn` (uses Yarn 1.22.22 workspaces)
- **Clean reinstall**: `yarn clean-install` (removes node_modules and reinstalls)

## Architecture Overview

### Monorepo Structure

This is a **Yarn workspace monorepo** with three main areas:

1. **`/excalidraw-app`** - The web application hosted at excalidraw.com

   - Features: Real-time collaboration (Socket.io), end-to-end encryption, PWA support
   - Storage: Firebase backend + IndexedDB local storage
   - State: Jotai atoms for reactive state management

2. **`/packages`** - Published npm packages (all exported as @excalidraw/\*)

   - `excalidraw/` - Core React component (main library)
   - `common/` - Shared utilities and types
   - `element/` - Element/shape logic (rectangles, circles, arrows, etc.)
   - `math/` - Mathematical utilities (geometry, transformations, etc.)
   - `utils/` - General utilities

3. **`/examples`** - Integration examples showing how to embed Excalidraw

### Key Architectural Patterns

#### 1. Action-Based Command System

Actions directory (`packages/excalidraw/actions/`) contains 46+ files handling all user operations:

- Each action file is a self-contained operation (e.g., `actionDelete.ts`, `actionDuplicate.ts`)
- Actions are registered and dispatched through a command system
- This centralizes all state mutations and makes features testable

#### 2. Component Architecture

- **Fine-grained components** in `packages/excalidraw/components/` (155+ files)
- Components use React Context for prop drilling avoidance
- Sidebar, toolbar, and panels are separate, composable components
- Uses Radix UI for accessible UI primitives (popover, tabs)

#### 3. State Management with Jotai

- **Atoms**: Primitive state units defined in `context/` directories
- **Scoped atoms**: Isolated state per instance using jotai-scope
- Reactive updates without Redux boilerplate
- No prop drilling; components read/write atoms directly

#### 4. Element System

- All canvas objects (shapes, text, images, arrows) are "elements"
- Elements stored in state as plain objects (serializable to JSON)
- Element operations centralized in `@excalidraw/element` package
- Supports: rectangles, diamonds, ellipses, arrows, lines, freehand, text, images

#### 5. Rendering Pipeline

- **roughjs**: Hand-drawn aesthetic line rendering
- **perfect-freehand**: Smooth freehand drawing curves
- Canvas-based rendering with optimized static scene rendering
- Export: PNG (with proper transparency), SVG, JSON (.excalidraw format)

#### 6. Collaboration Model

- Uses **fractional-indexing** for concurrent element ordering
- Conflict-free replicated data structure (CRDT) for ordering
- Socket.io for real-time synchronization
- Firebase for persistence and sharing

### Path Aliases

The tsconfig.json defines path aliases for clean imports across the monorepo:

```
@excalidraw/common     → packages/common/src/
@excalidraw/excalidraw → packages/excalidraw/
@excalidraw/element    → packages/element/src/
@excalidraw/math       → packages/math/src/
@excalidraw/utils      → packages/utils/src/
```

## Testing Patterns

### Test Organization

- Component tests: Co-located with components (e.g., `Component.test.tsx` next to `Component.tsx`)
- Feature/integration tests: `packages/excalidraw/tests/` directory
- Action tests: `packages/excalidraw/actions/` directory (e.g., `actionDelete.test.tsx`)

### Testing Utilities

- Uses **Vitest** (Jest-compatible, fast)
- `@testing-library/react` for component testing
- Custom test utilities in `packages/excalidraw/tests/test-utils.ts`:
  - `render()` - Mounts component with Excalidraw context
  - `queryByTestId()` - Query helpers
  - `unmountComponent()` - Cleanup between tests
- **Canvas mock**: vitest-canvas-mock for canvas API testing
- **Snapshot testing**: For modal dialogs and complex UIs

### Key Test Patterns

1. **Before each test**: Call `unmountComponent()`, `localStorage.clear()`, `reseed()` for reproducibility
2. **Interaction testing**: Use user events (not fireEvent)
3. **Canvas testing**: Mock canvas context when needed
4. **State verification**: Assert on element state, not just UI

### Test Coverage Requirements

- Minimum 60% line coverage threshold
- Tests run in parallel via Vitest
- ESLint runs with zero warnings tolerance in CI

## Development Practices

### Code Organization

- **Utilities**: Small, pure functions in dedicated modules (no premature abstractions)
- **Types**: Export from `@excalidraw/common` for shared types
- **Styles**: SCSS modules in `css/` directories, compiled via sass plugin
- **Localization**: i18n handled via locales, not hardcoded strings

### TypeScript Configuration

- **Strict mode** enabled (strict: true in tsconfig.json)
- **Target**: ESNext with transpilation for browsers
- **Module format**: ES modules (type: "module" in packages)
- **JSX**: React 17+ transform (jsx: "react-jsx")

### Performance Considerations

1. **Canvas rendering**: Use static scene optimization to avoid redrawing
2. **Memoization**: Use React.memo for expensive components
3. **Debounce/throttle**: Use lodash utilities for input events (drag, scroll, resize)
4. **Lazy loading**: Dynamic imports for heavy libraries (Mermaid support)

### Build System (Vite)

- Fast HMR during development
- esbuild for production bundling
- SASS plugin for styles
- SVG as React components via vite-plugin-svgr
- Development and production CSS/JS split

### Monorepo Workflow

1. Install dependencies from root: `yarn` (installs all workspaces)
2. Changes to `/packages/*` are immediately available to excalidraw-app
3. `yarn build:packages` required before publishing npm packages
4. Most development happens in `excalidraw-app` which imports from local packages

## Common Tasks

### Adding a New Element Type

1. Define element type in `@excalidraw/element`
2. Add shape rendering in canvas renderer
3. Add UI controls in toolbar/properties panel
4. Add tests for element creation, transformation, serialization

### Adding a New Feature (Action)

1. Create action file in `packages/excalidraw/actions/actionFeatureName.ts`
2. Register action in action registry
3. Add UI trigger (button, menu item)
4. Add corresponding test in same directory
5. Update any relevant docs

### Modifying Component Properties

Use the action-integration-agent for property slider/control changes:

- Updates actionProperties.tsx with new property
- Wires into property panels automatically
- Handles action definition and UI integration in one pass

### Publishing Updates

1. Make changes and commit with clear messages
2. Update CHANGELOG if needed (handled by release script)
3. Run `yarn test:all` to verify everything passes
4. Maintainers run `yarn release` for version bumping and npm publishing
