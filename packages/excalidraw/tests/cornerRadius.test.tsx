import React from "react";

import { ROUNDNESS } from "@excalidraw/common";

import { Excalidraw } from "../index";

import { API } from "./helpers/api";
import { act, fireEvent, render, screen } from "./test-utils";

describe("Corner Radius Slider", () => {
  beforeEach(async () => {
    await render(<Excalidraw handleKeyboardGlobally={true} />);
  });

  afterEach(async () => {
    // https://github.com/floating-ui/floating-ui/issues/1908#issuecomment-1301553793
    await act(async () => {});
  });

  describe("Slider Visibility", () => {
    it("should show slider when roundness is 'round'", () => {
      const rect = API.createElement({
        type: "rectangle",
        width: 100,
        height: 100,
        roundness: { type: ROUNDNESS.ADAPTIVE_RADIUS },
      });
      API.updateScene({ elements: [rect] });
      API.setSelectedElements([rect]);

      expect(screen.queryByTestId("corner-radius-slider")).not.toBeNull();
    });

    it("should hide slider when roundness is 'sharp' (null)", () => {
      const rect = API.createElement({
        type: "rectangle",
        width: 100,
        height: 100,
      });
      // Explicitly set roundness to null (sharp)
      API.updateScene({ elements: [rect] });
      API.updateElement(rect, { roundness: null });
      API.setSelectedElements([rect]);

      expect(screen.queryByTestId("corner-radius-slider")).toBeNull();
    });

    it("should show slider when multiple rounded rectangles are selected", () => {
      const rect1 = API.createElement({
        type: "rectangle",
        x: 0,
        width: 100,
        height: 100,
        roundness: { type: ROUNDNESS.ADAPTIVE_RADIUS },
      });
      const rect2 = API.createElement({
        type: "rectangle",
        x: 150,
        width: 100,
        height: 100,
        roundness: { type: ROUNDNESS.ADAPTIVE_RADIUS },
      });
      API.updateScene({ elements: [rect1, rect2] });
      API.setSelectedElements([rect1, rect2]);

      expect(screen.queryByTestId("corner-radius-slider")).not.toBeNull();
    });

    it("should hide slider when no elements are selected", () => {
      const rect = API.createElement({
        type: "rectangle",
        width: 100,
        height: 100,
        roundness: { type: ROUNDNESS.ADAPTIVE_RADIUS },
      });
      API.updateScene({ elements: [rect] });
      // No selection
      API.clearSelection();

      expect(screen.queryByTestId("corner-radius-slider")).toBeNull();
    });

    it("should show slider for rounded element even when mixed with sharp elements", () => {
      // Implementation filters to only elements with ADAPTIVE_RADIUS, so slider appears
      // for the rounded one even if selection includes sharp elements
      const sharpRect = API.createElement({
        type: "rectangle",
        x: 0,
        width: 100,
        height: 100,
      });
      API.updateScene({ elements: [sharpRect] });
      API.updateElement(sharpRect, { roundness: null });

      const roundRect = API.createElement({
        type: "rectangle",
        x: 150,
        width: 100,
        height: 100,
        roundness: { type: ROUNDNESS.ADAPTIVE_RADIUS },
      });
      API.updateScene({ elements: [sharpRect, roundRect] });
      API.setSelectedElements([sharpRect, roundRect]);

      // Slider shows because there's at least one rounded element
      expect(screen.queryByTestId("corner-radius-slider")).not.toBeNull();
    });
  });

  describe("Value Updates", () => {
    it("should update element's roundness.value when slider changes", () => {
      const rect = API.createElement({
        type: "rectangle",
        width: 100,
        height: 100,
        roundness: { type: ROUNDNESS.ADAPTIVE_RADIUS },
      });
      API.updateScene({ elements: [rect] });
      API.setSelectedElements([rect]);

      const slider = screen.getByTestId("corner-radius-slider");
      fireEvent.change(slider, { target: { value: "25" } });

      const updated = API.getElement(rect);
      expect(updated.roundness?.value).toBe(25);
    });

    it("should clamp value to max(min(width, height)/2, 200)", () => {
      // Rectangle 100x80 => max radius = min(100, 80)/2 = 40
      const rect = API.createElement({
        type: "rectangle",
        width: 100,
        height: 80,
        roundness: { type: ROUNDNESS.ADAPTIVE_RADIUS },
      });
      API.updateScene({ elements: [rect] });
      API.setSelectedElements([rect]);

      const slider = screen.getByTestId("corner-radius-slider");
      // Try to set a value higher than max
      fireEvent.change(slider, { target: { value: "100" } });

      const updated = API.getElement(rect);
      // Should be clamped to 40 (min(100, 80)/2)
      expect(updated.roundness?.value).toBe(40);
    });

    it("should update all elements when multiple are selected", () => {
      const rect1 = API.createElement({
        type: "rectangle",
        x: 0,
        width: 100,
        height: 100,
        roundness: { type: ROUNDNESS.ADAPTIVE_RADIUS, value: 10 },
      });
      const rect2 = API.createElement({
        type: "rectangle",
        x: 150,
        width: 100,
        height: 100,
        roundness: { type: ROUNDNESS.ADAPTIVE_RADIUS, value: 20 },
      });
      API.updateScene({ elements: [rect1, rect2] });
      API.setSelectedElements([rect1, rect2]);

      const slider = screen.getByTestId("corner-radius-slider");
      fireEvent.change(slider, { target: { value: "30" } });

      expect(API.getElement(rect1).roundness?.value).toBe(30);
      expect(API.getElement(rect2).roundness?.value).toBe(30);
    });

    it("should show default radius when multiple elements have different values", () => {
      // When values differ, reduceToCommonValue returns null and default is used
      const rect1 = API.createElement({
        type: "rectangle",
        x: 0,
        width: 100,
        height: 100,
        roundness: { type: ROUNDNESS.ADAPTIVE_RADIUS },
      });
      const rect2 = API.createElement({
        type: "rectangle",
        x: 150,
        width: 100,
        height: 100,
        roundness: { type: ROUNDNESS.ADAPTIVE_RADIUS },
      });
      API.updateScene({ elements: [rect1, rect2] });

      // Set different values
      API.updateElement(rect1, {
        roundness: { type: ROUNDNESS.ADAPTIVE_RADIUS, value: 15 },
      });
      API.updateElement(rect2, {
        roundness: { type: ROUNDNESS.ADAPTIVE_RADIUS, value: 25 },
      });
      API.setSelectedElements([rect1, rect2]);

      const slider = screen.getByTestId(
        "corner-radius-slider",
      ) as HTMLInputElement;
      // When values differ, implementation shows default value (32)
      expect(Number(slider.value)).toBe(32);
    });

    it("should show common value when multiple elements have same value", () => {
      const rect1 = API.createElement({
        type: "rectangle",
        x: 0,
        width: 100,
        height: 100,
        roundness: { type: ROUNDNESS.ADAPTIVE_RADIUS },
      });
      const rect2 = API.createElement({
        type: "rectangle",
        x: 150,
        width: 100,
        height: 100,
        roundness: { type: ROUNDNESS.ADAPTIVE_RADIUS },
      });
      API.updateScene({ elements: [rect1, rect2] });

      // Set same values
      API.updateElement(rect1, {
        roundness: { type: ROUNDNESS.ADAPTIVE_RADIUS, value: 20 },
      });
      API.updateElement(rect2, {
        roundness: { type: ROUNDNESS.ADAPTIVE_RADIUS, value: 20 },
      });
      API.setSelectedElements([rect1, rect2]);

      const slider = screen.getByTestId(
        "corner-radius-slider",
      ) as HTMLInputElement;
      expect(Number(slider.value)).toBe(20);
    });
  });

  describe("Edge Cases", () => {
    it("should correctly calculate max for small rectangles", () => {
      // Very small rectangle 20x30 => max radius = min(20, 30)/2 = 10
      const smallRect = API.createElement({
        type: "rectangle",
        width: 20,
        height: 30,
        roundness: { type: ROUNDNESS.ADAPTIVE_RADIUS },
      });
      API.updateScene({ elements: [smallRect] });
      API.setSelectedElements([smallRect]);

      const slider = screen.getByTestId(
        "corner-radius-slider",
      ) as HTMLInputElement;
      // Max attribute should be 10
      expect(Number(slider.max)).toBe(10);
    });

    it("should cap max radius at 200px for large rectangles", () => {
      // Large rectangle 1000x800 => max would be 400, but capped at 200
      const largeRect = API.createElement({
        type: "rectangle",
        width: 1000,
        height: 800,
        roundness: { type: ROUNDNESS.ADAPTIVE_RADIUS },
      });
      API.updateScene({ elements: [largeRect] });
      API.setSelectedElements([largeRect]);

      const slider = screen.getByTestId(
        "corner-radius-slider",
      ) as HTMLInputElement;
      // Max should be capped at 200
      expect(Number(slider.max)).toBe(200);
    });

    it("should display sharp corners visually when radius is 0", () => {
      const rect = API.createElement({
        type: "rectangle",
        width: 100,
        height: 100,
        roundness: { type: ROUNDNESS.ADAPTIVE_RADIUS },
      });
      API.updateScene({ elements: [rect] });
      API.setSelectedElements([rect]);

      const slider = screen.getByTestId("corner-radius-slider");
      fireEvent.change(slider, { target: { value: "0" } });

      const updated = API.getElement(rect);
      expect(updated.roundness?.value).toBe(0);
    });

    it("should hide slider for very small rectangles (maxRadius < 4)", () => {
      // Very small rectangle 6x6 => max radius = 3, below threshold
      const tinyRect = API.createElement({
        type: "rectangle",
        width: 6,
        height: 6,
        roundness: { type: ROUNDNESS.ADAPTIVE_RADIUS },
      });
      API.updateScene({ elements: [tinyRect] });
      API.setSelectedElements([tinyRect]);

      // Slider should not appear because max radius is too small
      expect(screen.queryByTestId("corner-radius-slider")).toBeNull();
    });
  });

  describe("Integration", () => {
    it("should add radius changes to undo stack", () => {
      const rect = API.createElement({
        type: "rectangle",
        width: 100,
        height: 100,
        roundness: { type: ROUNDNESS.ADAPTIVE_RADIUS },
      });
      API.updateScene({ elements: [rect] });
      API.setSelectedElements([rect]);

      const initialUndoLength = API.getUndoStack().length;

      // Change the radius
      const slider = screen.getByTestId("corner-radius-slider");
      fireEvent.change(slider, { target: { value: "35" } });

      expect(API.getElement(rect).roundness?.value).toBe(35);
      // Verify action was recorded in undo stack
      expect(API.getUndoStack().length).toBeGreaterThan(initialUndoLength);
    });

    it("should persist radius value in element data", () => {
      const rect = API.createElement({
        type: "rectangle",
        width: 100,
        height: 100,
        roundness: { type: ROUNDNESS.ADAPTIVE_RADIUS },
      });
      API.updateScene({ elements: [rect] });
      API.setSelectedElements([rect]);

      const slider = screen.getByTestId("corner-radius-slider");
      fireEvent.change(slider, { target: { value: "42" } });

      // Deselect and reselect
      API.clearSelection();
      API.setSelectedElements([rect]);

      // Value should persist
      const updated = API.getElement(rect);
      expect(updated.roundness?.value).toBe(42);
    });

    it("should only show slider for elements with ADAPTIVE_RADIUS roundness", () => {
      // Test that slider visibility is based on element's roundness type
      const roundRect = API.createElement({
        type: "rectangle",
        x: 0,
        width: 100,
        height: 100,
        roundness: { type: ROUNDNESS.ADAPTIVE_RADIUS },
      });
      API.updateScene({ elements: [roundRect] });
      API.setSelectedElements([roundRect]);

      // Slider should be visible for ADAPTIVE_RADIUS
      expect(screen.queryByTestId("corner-radius-slider")).not.toBeNull();

      // Clear and select a sharp rectangle
      const sharpRect = API.createElement({
        type: "rectangle",
        x: 200,
        width: 100,
        height: 100,
      });
      API.updateScene({ elements: [roundRect, sharpRect] });
      API.updateElement(sharpRect, { roundness: null });
      API.setSelectedElements([sharpRect]);

      // Slider should be hidden for sharp (null roundness)
      expect(screen.queryByTestId("corner-radius-slider")).toBeNull();
    });

    it("should not show slider for non-rectangle elements", () => {
      const ellipse = API.createElement({
        type: "ellipse",
        width: 100,
        height: 100,
        roundness: { type: ROUNDNESS.ADAPTIVE_RADIUS },
      });
      API.updateScene({ elements: [ellipse] });
      API.setSelectedElements([ellipse]);

      // Slider should not appear for ellipse
      expect(screen.queryByTestId("corner-radius-slider")).toBeNull();
    });

    it("should show slider for diamond with roundness", () => {
      const diamond = API.createElement({
        type: "diamond",
        width: 100,
        height: 100,
        roundness: { type: ROUNDNESS.ADAPTIVE_RADIUS },
      });
      API.updateScene({ elements: [diamond] });
      API.setSelectedElements([diamond]);

      // Slider should appear for diamond (it supports corner radius)
      expect(screen.queryByTestId("corner-radius-slider")).not.toBeNull();
    });
  });
});
