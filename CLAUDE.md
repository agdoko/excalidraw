# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Excalidraw is a React-based collaborative drawing application published as both an npm package (`@excalidraw/excalidraw`) and a web app at excalidraw.com. It's a hand-drawn style whiteboard supporting real-time collaboration, end-to-end encryption, and exports to PNG/SVG.

## Repository Structure

**Monorepo using Yarn workspaces:**

- `excalidraw-app/` - Web application (excalidraw.com)
- `packages/`
  - `common/` - Shared utilities and types (base package)
  - `math/` - 2D vector/geometry math utilities
  - `element/` - Element manipulation logic
  - `excalidraw/` - Main React component library for npm
  - `utils/` - Export utilities (PNG/SVG conversion)
- `examples/` - Integration examples
- `dev-docs/` - Docusaurus documentation
- `scripts/` - Build and release automation

**Dependency order (always build in this sequence):**
```
common → math → element → excalidraw
```

## Essential Commands

### Development
```bash
yarn start              # Dev server on http://localhost:3000
yarn start:production   # Build and serve production version
```

### Testing
```bash
yarn test               # Vitest in watch mode
yarn test:all          # Full suite (typecheck + lint + test + app tests)
yarn test:coverage     # Tests with coverage report
yarn test:ui           # Vitest UI with coverage visualization
```

### Linting & Formatting
```bash
yarn test:code         # ESLint check
yarn fix               # Auto-fix lint and format issues (prettier + eslint)
yarn test:typecheck    # TypeScript type checking
```

### Building Packages & App
```bash
yarn build             # Build excalidraw-app for production
yarn build:packages    # Build all npm packages in dependency order
yarn build:excalidraw  # Build just the main package
yarn rm:build          # Clean all build artifacts
```

### Single Test Execution
```bash
# Run a specific test file
vitest /path/to/test.test.ts

# Run tests matching a pattern
vitest -t "pattern-name"

# Run tests in a specific directory with watch disabled
vitest packages/element/tests --watch=false
```

## Technology Stack

- **React 19** - UI framework
- **TypeScript 5.9.3** - Type checking
- **Vite 5.0.12** - Dev server and app bundling
- **esbuild** - Package bundling
- **Vitest 3.0.6** - Test runner (jsdom environment)
- **Jotai 2.11** - State management
- **SCSS/Sass** - Styling
- **RoughJS 4.6.4** - Hand-drawn style rendering
- **Testing Library** - React component testing

## Build System Details

**Vite Configuration:** `excalidraw-app/vite.config.mts`
- Plugin: `@vitejs/plugin-react`, `vite-plugin-svgr`, `vite-plugin-pwa` (PWA/offline support)
- Path aliases configured for packages: `@excalidraw/common`, `@excalidraw/element`, etc.

**Package Builds:** Use esbuild for fast bundling
- ESM format with code splitting
- Generates TypeScript declaration files
- Build scripts: `scripts/buildPackage.js`, `scripts/buildBase.js`, `scripts/buildUtils.js`

**Test Configuration:** `vitest.config.mts`
- Setup file: `setupTests.ts` (polyfills, mocks for matchMedia, FontFace, IndexedDB)
- Canvas mocking: `vitest-canvas-mock`
- Coverage thresholds: lines 60%, branches 70%, functions 63%, statements 60%

## Key Directories & Patterns

### Main Package Structure
```
packages/excalidraw/
├── actions/           # Redux-style action definitions
├── components/        # React UI components (dialogs, toolbars, panels)
├── data/             # Serialization and library management
├── renderer/         # Canvas rendering logic
├── scene/            # Scene graph (element management)
├── types.ts          # Type definitions
└── index.tsx         # Public API export
```

### Styling
- CSS modules for components (`.scss` files)
- SCSS as primary stylesheet language
- Theme support with CSS custom properties

### Localization
- i18next for translations
- ~60 language translations in `packages/excalidraw/locales/`

## Important Coding Standards

See `.github/copilot-instructions.md` for full guidelines. Key points:

**TypeScript:**
- Use TypeScript for all new code
- Prefer immutable data (const, readonly)
- Use optional chaining (?.) and nullish coalescing (??) operators
- Use the `Point` type from `packages/math/src/types.ts` instead of `{ x, y }` for math-related code

**React:**
- Use functional components with hooks
- Follow React hooks rules (no conditional hooks)
- Keep components small and focused
- Use CSS modules for styling

**General:**
- Be succinct and avoid unnecessary explanations
- Prefer implementations without allocation
- Optimize for performance, trading RAM for CPU cycles where appropriate
- Always run `yarn test:app` after code changes

## Testing Guidelines

**Key Testing Patterns:**
- Use `@testing-library/react` for component testing
- Mock canvas with `vitest-canvas-mock`
- Mock browser APIs in `setupTests.ts` (fonts, matchMedia, IndexedDB)
- Test canvas rendering with snapshot tests
- Use `fake-indexeddb` for testing IndexedDB functionality

**Running Tests:**
- Single file: `vitest path/to/file.test.ts`
- With pattern: `vitest -t "test name pattern"`
- Full suite: `yarn test:all`

## Common Development Tasks

### Fixing Test Failures
After making changes, run `yarn test:app` to verify tests pass. Common issues:
- Type errors: Run `yarn test:typecheck`
- Lint errors: Run `yarn fix:code` to auto-fix
- Test failures: Run `yarn test:app` in watch mode for quick iteration

### Adding a New Element Type
1. Define type in element-related files
2. Add actions in `packages/excalidraw/actions/`
3. Add rendering logic in `packages/excalidraw/renderer/`
4. Add scene management logic in `packages/excalidraw/scene/`
5. Add UI components for the tool
6. Write tests for each piece

### Modifying Math Utilities
Always include `packages/math/src/types.ts` in context. Use `Point` type instead of `{ x, y }` objects.

## GitHub Actions & CI

Key workflows:
- `test.yml` - Run test suite on PR
- `lint.yml` - ESLint checks
- `test-coverage-pr.yml` - Coverage reporting
- `size-limit.yml` - Bundle size monitoring
- `autorelease-excalidraw.yml` - Automated npm releases

## Resources

- [Development Guide](https://docs.excalidraw.com/docs/introduction/development)
- [Contributing Guide](https://docs.excalidraw.com/docs/introduction/contributing)
- [Documentation](https://docs.excalidraw.com)
- [Discord Community](https://discord.gg/UexuTaE)
