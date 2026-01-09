---
name: excalidraw-test-patterns
description: Critical test patterns for Excalidraw. Reference this skill before writing any tests to avoid common mistakes with React Testing Library, history APIs, and event handling.
---

# Excalidraw Test Patterns

**ALWAYS reference this skill before writing tests for Excalidraw.**

---

## CRITICAL: Use React Testing Library for Events

**NEVER** use raw DOM events - they don't work with React's synthetic event system:

```typescript
// ❌ WRONG - will NOT trigger React state updates
slider.dispatchEvent(new Event("change", { bubbles: true }));
element.dispatchEvent(new Event("input", { bubbles: true }));
```

**ALWAYS** use `fireEvent` from React Testing Library:

```typescript
// ✅ CORRECT
import { fireEvent, screen } from "./test-utils";

fireEvent.change(screen.getByTestId("my-slider"), { target: { value: "60" } });
fireEvent.click(screen.getByTitle("Bold"));
```

---

## CRITICAL: History/Undo API

**NEVER** access history directly from state - the property doesn't exist:

```typescript
// ❌ WRONG - TypeScript error: Property 'history' does not exist on type 'AppState'
h.state.history.getSnapshotIndex();
```

**ALWAYS** use the API helpers:

```typescript
// ✅ CORRECT
import { API } from "./helpers/api";

API.getUndoStack().length;
API.getRedoStack().length;
```

---

## Standard Test Imports

```typescript
import React from "react";
import { ROUNDNESS } from "@excalidraw/common";
import { Excalidraw } from "../index";
import { API } from "./helpers/api";
import { Keyboard, UI, Pointer } from "./helpers/ui";
import { render, fireEvent, screen, togglePopover } from "./test-utils";

const mouse = new Pointer("mouse");
```

**Only import what you use** - unused imports cause ESLint errors.

---

## Creating Elements

**Programmatically (for unit tests):**

```typescript
const rect = API.createElement({
  type: "rectangle",
  width: 100,
  height: 100,
  roundness: { type: ROUNDNESS.ADAPTIVE_RADIUS, value: 20 },
});
API.updateScene({ elements: [rect] });
API.setSelectedElements([rect]);
```

**Via UI (for integration tests):**

```typescript
UI.clickTool("rectangle");
mouse.down(10, 10);
mouse.up(110, 110);
```

---

## Changing Element Properties

**Via popovers/panels:**

```typescript
togglePopover("Background");
UI.clickOnTestId("color-red");
```

**Via range/slider inputs:**

```typescript
fireEvent.change(screen.getByTestId("opacity"), { target: { value: "60" } });
```

**Via button options:**

```typescript
fireEvent.click(screen.getByTitle("Cross-hatch")); // fillStyle
fireEvent.click(screen.getByTitle("Bold")); // strokeWidth
fireEvent.click(screen.getByTitle("Dotted")); // strokeStyle
```

---

## Verifying Element Properties

**Using h.elements (preferred for multiple elements):**

```typescript
expect(h.elements).toEqual([
  expect.objectContaining({ id: rect.id, backgroundColor: "#ff0000" }),
]);
```

**Using API.getElement (for single element fresh state):**

```typescript
const updated = API.getElement(rect);
expect(updated.opacity).toBe(60);
expect(updated.roundness?.value).toBe(32);
```

---

## Testing Undo/Redo

```typescript
// Make changes
fireEvent.change(screen.getByTestId("opacity"), { target: { value: "60" } });

// Verify history grew
expect(API.getUndoStack().length).toBeGreaterThan(initialLength);

// Undo
Keyboard.undo();

// Verify state reverted
const updated = API.getElement(rect);
expect(updated.opacity).toBe(originalValue);

// Redo
Keyboard.redo();
```

---

## Complete Property Test Example

```typescript
import React from "react";
import { ROUNDNESS } from "@excalidraw/common";
import { Excalidraw } from "../index";
import { API } from "./helpers/api";
import { render, fireEvent, screen } from "./test-utils";

describe("My Property Tests", () => {
  beforeEach(async () => {
    await render(<Excalidraw />);
  });

  it("should update property via slider", async () => {
    // Create element
    const rect = API.createElement({
      type: "rectangle",
      width: 100,
      height: 100,
      roundness: { type: ROUNDNESS.ADAPTIVE_RADIUS, value: 20 },
    });
    API.updateScene({ elements: [rect] });
    API.setSelectedElements([rect]);

    // Change via slider - USE fireEvent, NOT dispatchEvent
    const slider = screen.getByTestId("my-property-slider");
    fireEvent.change(slider, { target: { value: "50" } });

    // Verify
    const updated = API.getElement(rect);
    expect(updated.myProperty).toBe(50);
  });
});
```

---

## Key Test Utilities Reference

| Utility | Purpose |
| --- | --- |
| `API.createElement()` | Create element programmatically |
| `API.updateScene()` | Update scene with elements/appState |
| `API.setSelectedElements()` | Select specific elements |
| `API.getElement()` | Get fresh element from scene |
| `API.getUndoStack()` | Get undo history length |
| `API.getRedoStack()` | Get redo history length |
| `UI.createElement()` | Create element via UI interaction |
| `UI.clickOnTestId()` | Click element by data-testid |
| `Keyboard.undo()` | Trigger Ctrl+Z |
| `Keyboard.redo()` | Trigger Ctrl+Shift+Z |
| `togglePopover()` | Open/close property popover |
| `fireEvent.change()` | Trigger input change event (REQUIRED for React) |
| `fireEvent.click()` | Trigger click event |
| `screen.getByTestId()` | Query by data-testid |
| `screen.getByTitle()` | Query by title attribute |

---

## Reference Test Files

Look at these files for working examples:

- `packages/excalidraw/tests/actionStyles.test.tsx` - Property change tests
- `packages/excalidraw/tests/history.test.tsx` - Undo/redo tests
- `packages/excalidraw/tests/helpers/api.ts` - API helper source
- `packages/excalidraw/tests/helpers/ui.ts` - UI helper source
