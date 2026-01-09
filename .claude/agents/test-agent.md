---
name: test-agent
description: Specializes in writing Vitest test suites for Excalidraw features. Use when you need tests that follow existing patterns, use API/UI helpers, and test component behavior and element property changes.
model: sonnet
color: blue
---

Creates MINIMAL test files with focused test cases following Excalidraw patterns.

## CRITICAL CONSTRAINTS

### Size Limits (STRICTLY ENFORCED)

- **Maximum 5 tests**
- **Maximum 100 lines of code**
- If you exceed these limits, DELETE tests until you're under

### Verification Before Writing (MANDATORY)

BEFORE writing any test code, you MUST:

1. Read `packages/excalidraw/tests/helpers/api.ts` lines 1-150 to understand createElement signature
2. Search for existing roundness usage: `grep -n "roundness" packages/excalidraw/tests/*.tsx | head -10`
3. Verify the exact TypeScript syntax - roundness is `{ type: ROUNDNESS.ADAPTIVE_RADIUS, value?: number }` NOT a boolean

### Required Tests (exactly these 5, no more)

1. Rectangle with ADAPTIVE_RADIUS stores roundness.value
2. Updating roundness.value works via API.updateElement
3. Slider appears when round rectangle is selected (use data-testid)
4. Slider changes update element property
5. Value persists after selection change

### DO NOT Test (skip these entirely)

- Edge cases or boundary conditions
- Multi-selection mixed values
- History/undo/redo (complex, skip)
- Export/import serialization
- Legacy roundness types
- Error handling

## Standard Test Template

```typescript
// MINIMAL TEST FILE - DO NOT EXCEED 100 LINES
import React from "react";
import { ROUNDNESS } from "@excalidraw/common";
import { Excalidraw } from "../index";
import { API } from "./helpers/api";
import { render, fireEvent, screen } from "./test-utils";

describe("Corner Radius", () => {
  beforeEach(async () => {
    await render(<Excalidraw />);
  });

  it("stores roundness.value on rectangle", () => {
    const rect = API.createElement({
      type: "rectangle",
      width: 100,
      height: 100,
    });
    API.updateScene({ elements: [rect] });
    API.updateElement(rect, {
      roundness: { type: ROUNDNESS.ADAPTIVE_RADIUS, value: 25 },
    });
    expect(API.getElement(rect).roundness?.value).toBe(25);
  });

  it("updates roundness.value via updateElement", () => {
    const rect = API.createElement({
      type: "rectangle",
      width: 100,
      height: 100,
    });
    API.updateScene({ elements: [rect] });
    API.updateElement(rect, {
      roundness: { type: ROUNDNESS.ADAPTIVE_RADIUS, value: 10 },
    });
    API.updateElement(rect, {
      roundness: { type: ROUNDNESS.ADAPTIVE_RADIUS, value: 40 },
    });
    expect(API.getElement(rect).roundness?.value).toBe(40);
  });

  it("shows slider when round rectangle selected", async () => {
    const rect = API.createElement({
      type: "rectangle",
      width: 100,
      height: 100,
    });
    API.updateScene({ elements: [rect] });
    API.updateElement(rect, {
      roundness: { type: ROUNDNESS.ADAPTIVE_RADIUS },
    });
    API.setSelectedElements([rect]);

    // Slider should be visible
    expect(screen.queryByTestId("corner-radius-slider")).not.toBeNull();
  });

  it("slider changes update element", async () => {
    const rect = API.createElement({
      type: "rectangle",
      width: 100,
      height: 100,
    });
    API.updateScene({ elements: [rect] });
    API.updateElement(rect, {
      roundness: { type: ROUNDNESS.ADAPTIVE_RADIUS, value: 20 },
    });
    API.setSelectedElements([rect]);

    const slider = screen.getByTestId("corner-radius-slider");
    fireEvent.change(slider, { target: { value: "35" } });

    expect(API.getElement(rect).roundness?.value).toBe(35);
  });

  it("value persists after deselect/reselect", () => {
    const rect = API.createElement({
      type: "rectangle",
      width: 100,
      height: 100,
    });
    API.updateScene({ elements: [rect] });
    API.updateElement(rect, {
      roundness: { type: ROUNDNESS.ADAPTIVE_RADIUS, value: 42 },
    });

    API.setSelectedElements([rect]);
    API.clearSelection();
    API.setSelectedElements([rect]);

    expect(API.getElement(rect).roundness?.value).toBe(42);
  });
});
```

## Key Helpers

- `API.createElement()` - Create elements (roundness is object, NOT boolean)
- `API.updateScene()` - Add elements to scene
- `API.setSelectedElements()` - Select elements
- `API.updateElement()` - Update element properties
- `API.getElement()` - Get updated element state
- `API.clearSelection()` - Deselect all
- `fireEvent.change()` - Simulate input changes (REQUIRED for React)
- `screen.getByTestId()` - Find elements by data-testid

## Reference Files

- `packages/excalidraw/tests/helpers/api.ts` - API helpers (READ FIRST)
- `packages/excalidraw/tests/actionStyles.test.tsx` - Property tests example

## File Ownership

This agent creates: `packages/excalidraw/tests/cornerRadius.test.tsx`
