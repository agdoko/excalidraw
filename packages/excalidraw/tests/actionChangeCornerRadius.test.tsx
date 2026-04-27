import React from "react";

import { DEFAULT_ADAPTIVE_RADIUS, ROUNDNESS } from "@excalidraw/common";

import { Excalidraw } from "../index";

import { API } from "./helpers/api";
import { Keyboard } from "./helpers/ui";
import { render, fireEvent, screen } from "./test-utils";

describe("actionChangeCornerRadius", () => {
  beforeEach(async () => {
    await render(<Excalidraw handleKeyboardGlobally={true} />);
  });

  // 1. Slider not visible when no rectangle is selected
  it("slider absent with no selection", () => {
    expect(screen.queryByTestId("corner-radius-slider")).toBeNull();
  });

  // 2. Slider not visible when selected rectangle has sharp corners (roundness: null)
  it("slider absent for sharp rectangle", () => {
    const rect = API.createElement({
      type: "rectangle",
      width: 200,
      height: 200,
      roundness: null,
    });
    API.updateScene({ elements: [rect] });
    API.setSelectedElements([rect]);
    expect(screen.queryByTestId("corner-radius-slider")).toBeNull();
  });

  // 3. Slider visible when selected rectangle is rounded
  it("slider present for rounded rectangle", () => {
    const rect = API.createElement({
      type: "rectangle",
      width: 200,
      height: 200,
      roundness: { type: ROUNDNESS.ADAPTIVE_RADIUS },
    });
    API.updateScene({ elements: [rect] });
    API.setSelectedElements([rect]);
    expect(screen.queryByTestId("corner-radius-slider")).not.toBeNull();
  });

  // 4. Changing the slider updates element's roundness.value
  it("slider change updates roundness.value", () => {
    const rect = API.createElement({
      type: "rectangle",
      width: 200,
      height: 200,
      roundness: { type: ROUNDNESS.ADAPTIVE_RADIUS, value: 20 },
    });
    API.updateScene({ elements: [rect] });
    API.setSelectedElements([rect]);

    const slider = screen.getByTestId("corner-radius-slider");
    fireEvent.change(slider, { target: { value: "50" } });

    expect(API.getElement(rect).roundness?.value).toBe(50);
  });

  // 5. Value clamps to min(width, height) / 2 when action called with oversized value
  it("action clamps value to maxRadius", () => {
    // width=40, height=100 → maxRadius = floor(min(40,100)/2) = 20
    const rect = API.createElement({
      type: "rectangle",
      width: 40,
      height: 100,
      roundness: { type: ROUNDNESS.ADAPTIVE_RADIUS },
    });
    API.updateScene({ elements: [rect] });
    // Set an initial value so roundness.value is defined
    API.updateElement(rect, {
      roundness: { type: ROUNDNESS.ADAPTIVE_RADIUS, value: 5 },
    });
    API.setSelectedElements([rect]);
    const slider = screen.getByTestId("corner-radius-slider");
    // jsdom range input clamps to max (20) — the action perform also clamps to maxRadius (20)
    fireEvent.change(slider, { target: { value: "25" } });

    // The action clamps to maxRadius = 20
    expect(API.getElement(rect).roundness?.value).toBe(20);
  });

  // 6. Slider reads existing roundness.value
  it("slider reflects existing roundness.value", () => {
    // API.createElement strips roundness.value; use updateElement to set it
    const rect = API.createElement({
      type: "rectangle",
      width: 200,
      height: 200,
      roundness: { type: ROUNDNESS.ADAPTIVE_RADIUS },
    });
    API.updateScene({ elements: [rect] });
    API.updateElement(rect, {
      roundness: { type: ROUNDNESS.ADAPTIVE_RADIUS, value: 17 },
    });
    API.setSelectedElements([rect]);

    const slider = screen.getByTestId<HTMLInputElement>("corner-radius-slider");
    expect(Number(slider.value)).toBe(17);
  });

  // 7. Slider falls back to DEFAULT_ADAPTIVE_RADIUS when roundness.value is undefined
  it("slider defaults to DEFAULT_ADAPTIVE_RADIUS when value absent", () => {
    const rect = API.createElement({
      type: "rectangle",
      width: 200,
      height: 200,
      roundness: { type: ROUNDNESS.ADAPTIVE_RADIUS },
    });
    API.updateScene({ elements: [rect] });
    API.setSelectedElements([rect]);

    const slider = screen.getByTestId<HTMLInputElement>("corner-radius-slider");
    expect(Number(slider.value)).toBe(DEFAULT_ADAPTIVE_RADIUS);
  });

  // 8. Slider hides when rectangle is too small (maxRadius < 1)
  it("slider absent for tiny rectangle (maxRadius < 1)", () => {
    const rect = API.createElement({
      type: "rectangle",
      width: 1,
      height: 1,
      roundness: { type: ROUNDNESS.ADAPTIVE_RADIUS },
    });
    API.updateScene({ elements: [rect] });
    API.setSelectedElements([rect]);
    // maxRadius = floor(min(1, 1) / 2) = 0 < 1 → panel returns null
    expect(screen.queryByTestId("corner-radius-slider")).toBeNull();
  });

  // 9. Undo/redo round-trip
  it("undo reverts change, redo reapplies it", () => {
    const rect = API.createElement({
      type: "rectangle",
      width: 200,
      height: 200,
      roundness: { type: ROUNDNESS.ADAPTIVE_RADIUS },
    });
    API.updateScene({ elements: [rect] });
    API.setSelectedElements([rect]);

    const slider = screen.getByTestId("corner-radius-slider");

    // Set initial value to 10 via the slider (creates undo entry)
    fireEvent.change(slider, { target: { value: "10" } });
    expect(API.getElement(rect).roundness?.value).toBe(10);

    const undoLengthBefore = API.getUndoStack().length;

    // Change to 40
    fireEvent.change(slider, { target: { value: "40" } });
    expect(API.getElement(rect).roundness?.value).toBe(40);
    expect(API.getUndoStack().length).toBeGreaterThan(undoLengthBefore);

    // Undo should revert to 10
    Keyboard.undo();
    expect(API.getElement(rect).roundness?.value).toBe(10);

    // Redo should reapply 40
    Keyboard.redo();
    expect(API.getElement(rect).roundness?.value).toBe(40);
  });
});
