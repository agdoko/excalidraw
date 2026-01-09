---
name: action-integration-agent
description: Creates new Excalidraw actions AND wires them into property panels. Use when adding a new property slider/control that needs both an action definition and UI panel integration. Handles all actionProperties.tsx changes in one pass to avoid file conflicts.
model: sonnet
color: green
---

Creates the action, registers it, and wires it into the existing UI panel - all in one agent to avoid file conflicts.

## Responsibilities

1. Add action name to ActionName union type in `packages/excalidraw/actions/types.ts`
2. Create the action in `packages/excalidraw/actions/actionProperties.tsx`
3. Wire the action into the relevant existing panel (e.g., roundness panel)
4. Add AppState property to `packages/excalidraw/types.ts`
5. Initialize AppState property in `packages/excalidraw/appState.ts`
6. Add locale key to `packages/excalidraw/locales/en.json`

## Dependencies

**NO DEPENDENCIES** - This agent is fully self-contained. Create inline UI in PanelComponent. Do NOT import external slider components. Keep the slider inline for simplicity.

## Implementation Pattern

### Step 1: Add ActionName (types.ts)

```typescript
// Add to ActionName union after related action
| "changeCornerRadius"
```

### Step 2: Create Action with Inline Slider (actionProperties.tsx)

```typescript
export const actionChangeCornerRadius = register<number>({
  name: "changeCornerRadius",
  label: "labels.cornerRadius",
  trackEvent: false,
  perform: (elements, appState, value) => {
    return {
      elements: changeProperty(elements, appState, (el) => {
        if (!el.roundness || el.roundness.type !== ROUNDNESS.ADAPTIVE_RADIUS) {
          return el;
        }
        return newElementWith(el, {
          roundness: { ...el.roundness, value },
        });
      }),
      appState: { ...appState, currentItemCornerRadius: value },
      captureUpdate: CaptureUpdateAction.IMMEDIATELY,
    };
  },
  PanelComponent: ({ elements, appState, updateData, app }) => {
    const selectedElements = getSelectedElements(elements, appState);
    const adaptiveElements = selectedElements.filter(
      (el) => el.roundness?.type === ROUNDNESS.ADAPTIVE_RADIUS,
    );
    if (adaptiveElements.length === 0) return null;

    const maxRadius = Math.min(
      ...adaptiveElements.map((el) =>
        Math.floor(Math.min(el.width, el.height) / 2),
      ),
    );
    if (maxRadius < 1) return null;

    const value = getFormValue(
      elements,
      app,
      (el) => el.roundness?.value ?? DEFAULT_ADAPTIVE_RADIUS,
      (el) => el.roundness?.type === ROUNDNESS.ADAPTIVE_RADIUS,
      () => appState.currentItemCornerRadius ?? DEFAULT_ADAPTIVE_RADIUS,
    );

    return (
      <label className="control-label">
        {t("labels.cornerRadius")}
        <input
          type="range"
          min={1}
          max={maxRadius}
          step={1}
          value={value ?? DEFAULT_ADAPTIVE_RADIUS}
          onChange={(e) => updateData(+e.target.value)}
          data-testid="corner-radius-slider"
          style={{ width: "100%", marginTop: "0.5rem" }}
        />
      </label>
    );
  },
});
```

### Step 3: Wire Into Existing Panel (actionProperties.tsx)

Modify the parent action's PanelComponent (e.g., `actionChangeRoundness`) to render the new action:

```typescript
{
  renderAction("changeCornerRadius");
}
```

Add this inside the fieldset, after the RadioSelection.

### Step 4: AppState Type (types.ts)

```typescript
currentItemCornerRadius: number;
```

### Step 5: AppState Initialization (appState.ts)

```typescript
currentItemCornerRadius: DEFAULT_ADAPTIVE_RADIUS,
```

Add to storage config: `currentItemCornerRadius: { browser: true, export: false, server: false }`

### Step 6: Locale Key (en.json)

Add to `labels` section:

```json
"cornerRadius": "Corner radius"
```

## Reference Files

- `packages/excalidraw/actions/actionProperties.tsx` - Main file to edit
- `packages/excalidraw/actions/types.ts` - ActionName union
- `packages/excalidraw/types.ts` - AppState interface
- `packages/excalidraw/appState.ts` - State initialization
- `packages/excalidraw/locales/en.json` - Locale strings

## Self-Contained File Edits

This agent is the ONLY agent that edits:

- `actionProperties.tsx`
- `actions/types.ts`
- `types.ts` (AppState)
- `appState.ts`
- `locales/en.json`
