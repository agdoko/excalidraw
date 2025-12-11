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
    // Clean up floating-ui side effects
    await act(async () => {});
  });

  describe("Visibility Tests", () => {
    it("slider not visible when element has sharp corners (roundness === null)", () => {
      const rect = API.createElement({
        type: "rectangle",
        width: 100,
        height: 100,
        roundness: null,
      });

      API.setElements([rect]);
      API.setSelectedElements([rect]);

      expect(screen.queryByTestId("corner-radius-slider")).toBeNull();
    });

    it("slider visible when roundness is enabled (ADAPTIVE_RADIUS)", () => {
      const rect = API.createElement({
        type: "rectangle",
        width: 100,
        height: 100,
      });

      API.setElements([rect]);
      API.updateElement(rect, {
        roundness: { type: ROUNDNESS.ADAPTIVE_RADIUS },
      });
      API.setSelectedElements([rect]);

      expect(screen.queryByTestId("corner-radius-slider")).not.toBeNull();
    });

    it("slider not visible for text elements", () => {
      const text = API.createElement({
        type: "text",
        width: 100,
        height: 50,
        text: "Test",
      });

      API.setElements([text]);
      API.setSelectedElements([text]);

      expect(screen.queryByTestId("corner-radius-slider")).toBeNull();
    });

    it("slider not visible for arrow elements", () => {
      const arrow = API.createElement({
        type: "arrow",
        width: 100,
        height: 100,
      });

      API.setElements([arrow]);
      API.setSelectedElements([arrow]);

      expect(screen.queryByTestId("corner-radius-slider")).toBeNull();
    });

    it("slider not visible for elements with PROPORTIONAL_RADIUS roundness", () => {
      const diamond = API.createElement({
        type: "diamond",
        width: 100,
        height: 100,
      });

      API.setElements([diamond]);
      API.updateElement(diamond, {
        roundness: { type: ROUNDNESS.PROPORTIONAL_RADIUS },
      });
      API.setSelectedElements([diamond]);

      expect(screen.queryByTestId("corner-radius-slider")).toBeNull();
    });
  });

  describe("Value Update Tests", () => {
    it("slider updates roundness.value on single element", () => {
      const rect = API.createElement({
        type: "rectangle",
        width: 100,
        height: 100,
      });

      API.setElements([rect]);
      API.updateElement(rect, {
        roundness: { type: ROUNDNESS.ADAPTIVE_RADIUS, value: 20 },
      });
      API.setSelectedElements([rect]);

      const slider = screen.getByTestId("corner-radius-slider");
      fireEvent.change(slider, { target: { value: "40" } });

      const updatedRect = API.getElement(rect);
      expect(updatedRect.roundness?.value).toBe(40);
    });

    it("slider sets roundness.value to specified number", () => {
      const rect = API.createElement({
        type: "rectangle",
        width: 200,
        height: 200,
      });

      API.setElements([rect]);
      API.updateElement(rect, {
        roundness: { type: ROUNDNESS.ADAPTIVE_RADIUS },
      });
      API.setSelectedElements([rect]);

      const slider = screen.getByTestId("corner-radius-slider");
      fireEvent.change(slider, { target: { value: "64" } });

      const updatedRect = API.getElement(rect);
      expect(updatedRect.roundness?.value).toBe(64);
    });

    it("slider respects min bound (1px minimum)", () => {
      const rect = API.createElement({
        type: "rectangle",
        width: 100,
        height: 100,
      });

      API.setElements([rect]);
      API.updateElement(rect, {
        roundness: { type: ROUNDNESS.ADAPTIVE_RADIUS, value: 20 },
      });
      API.setSelectedElements([rect]);

      const slider = screen.getByTestId(
        "corner-radius-slider",
      ) as HTMLInputElement;
      expect(slider.min).toBe("1");
    });

    it("slider respects max bound (min(width, height) / 2, capped at 200)", () => {
      // Element where max is limited by size
      const smallRect = API.createElement({
        type: "rectangle",
        width: 60,
        height: 80,
      });

      API.setElements([smallRect]);
      API.updateElement(smallRect, {
        roundness: { type: ROUNDNESS.ADAPTIVE_RADIUS },
      });
      API.setSelectedElements([smallRect]);

      const slider = screen.getByTestId(
        "corner-radius-slider",
      ) as HTMLInputElement;
      // max should be min(60, 80) / 2 = 30
      expect(slider.max).toBe("30");
    });

    it("slider max is capped at 200px for large elements", () => {
      const largeRect = API.createElement({
        type: "rectangle",
        width: 500,
        height: 500,
      });

      API.setElements([largeRect]);
      API.updateElement(largeRect, {
        roundness: { type: ROUNDNESS.ADAPTIVE_RADIUS },
      });
      API.setSelectedElements([largeRect]);

      const slider = screen.getByTestId(
        "corner-radius-slider",
      ) as HTMLInputElement;
      // max should be capped at 200
      expect(slider.max).toBe("200");
    });

    it("slider step size is 4 pixels", () => {
      const rect = API.createElement({
        type: "rectangle",
        width: 100,
        height: 100,
      });

      API.setElements([rect]);
      API.updateElement(rect, {
        roundness: { type: ROUNDNESS.ADAPTIVE_RADIUS },
      });
      API.setSelectedElements([rect]);

      const slider = screen.getByTestId(
        "corner-radius-slider",
      ) as HTMLInputElement;
      expect(slider.step).toBe("4");
    });
  });

  describe("Multi-Selection Tests", () => {
    it("slider shows minimum radius when multiple elements with different radii selected", () => {
      const rect1 = API.createElement({
        type: "rectangle",
        x: 0,
        width: 100,
        height: 100,
      });
      const rect2 = API.createElement({
        type: "rectangle",
        x: 150,
        width: 100,
        height: 100,
      });

      API.setElements([rect1, rect2]);
      API.updateElement(rect1, {
        roundness: { type: ROUNDNESS.ADAPTIVE_RADIUS, value: 20 },
      });
      API.updateElement(rect2, {
        roundness: { type: ROUNDNESS.ADAPTIVE_RADIUS, value: 40 },
      });
      API.setSelectedElements([rect1, rect2]);

      const slider = screen.getByTestId(
        "corner-radius-slider",
      ) as HTMLInputElement;
      // Should show the minimum value (20)
      expect(parseInt(slider.value, 10)).toBe(20);
    });

    it("updating slider applies to all selected elements", () => {
      const rect1 = API.createElement({
        type: "rectangle",
        x: 0,
        width: 100,
        height: 100,
      });
      const rect2 = API.createElement({
        type: "rectangle",
        x: 150,
        width: 100,
        height: 100,
      });

      API.setElements([rect1, rect2]);
      API.updateElement(rect1, {
        roundness: { type: ROUNDNESS.ADAPTIVE_RADIUS, value: 10 },
      });
      API.updateElement(rect2, {
        roundness: { type: ROUNDNESS.ADAPTIVE_RADIUS, value: 30 },
      });
      API.setSelectedElements([rect1, rect2]);

      const slider = screen.getByTestId("corner-radius-slider");
      fireEvent.change(slider, { target: { value: "24" } });

      const updatedRect1 = API.getElement(rect1);
      const updatedRect2 = API.getElement(rect2);
      expect(updatedRect1.roundness?.value).toBe(24);
      expect(updatedRect2.roundness?.value).toBe(24);
    });

    it("slider max respects smallest element in multi-selection", () => {
      const smallRect = API.createElement({
        type: "rectangle",
        x: 0,
        width: 40,
        height: 40,
      });
      const largeRect = API.createElement({
        type: "rectangle",
        x: 100,
        width: 200,
        height: 200,
      });

      API.setElements([smallRect, largeRect]);
      API.updateElement(smallRect, {
        roundness: { type: ROUNDNESS.ADAPTIVE_RADIUS },
      });
      API.updateElement(largeRect, {
        roundness: { type: ROUNDNESS.ADAPTIVE_RADIUS },
      });
      API.setSelectedElements([smallRect, largeRect]);

      const slider = screen.getByTestId(
        "corner-radius-slider",
      ) as HTMLInputElement;
      // max should be min(40, 40) / 2 = 20 (from smaller element)
      expect(slider.max).toBe("20");
    });
  });

  describe("Integration Tests", () => {
    it("switching from sharp to round shows slider", () => {
      const rect = API.createElement({
        type: "rectangle",
        width: 100,
        height: 100,
        roundness: null,
      });

      API.setElements([rect]);
      API.setSelectedElements([rect]);

      // Slider should not exist initially
      expect(screen.queryByTestId("corner-radius-slider")).toBeNull();

      // Switch to round
      API.updateElement(rect, {
        roundness: { type: ROUNDNESS.ADAPTIVE_RADIUS },
      });

      // Re-select to trigger re-render
      API.clearSelection();
      API.setSelectedElements([rect]);

      expect(screen.queryByTestId("corner-radius-slider")).not.toBeNull();
    });

    it("switching from round to sharp hides slider", () => {
      const rect = API.createElement({
        type: "rectangle",
        width: 100,
        height: 100,
      });

      API.setElements([rect]);
      API.updateElement(rect, {
        roundness: { type: ROUNDNESS.ADAPTIVE_RADIUS, value: 20 },
      });
      API.setSelectedElements([rect]);

      // Slider should exist
      expect(screen.queryByTestId("corner-radius-slider")).not.toBeNull();

      // Switch to sharp
      API.updateElement(rect, { roundness: null });

      // Re-select to trigger re-render
      API.clearSelection();
      API.setSelectedElements([rect]);

      expect(screen.queryByTestId("corner-radius-slider")).toBeNull();
    });

    it("adjusting radius persists while element stays round", () => {
      const rect = API.createElement({
        type: "rectangle",
        width: 100,
        height: 100,
      });

      API.setElements([rect]);
      API.updateElement(rect, {
        roundness: { type: ROUNDNESS.ADAPTIVE_RADIUS, value: 36 },
      });
      API.setSelectedElements([rect]);

      // Verify initial value
      let slider = screen.getByTestId(
        "corner-radius-slider",
      ) as HTMLInputElement;
      expect(parseInt(slider.value, 10)).toBe(36);

      // Change the value
      fireEvent.change(slider, { target: { value: "28" } });
      expect(API.getElement(rect).roundness?.value).toBe(28);

      // Deselect and reselect - value should persist
      API.clearSelection();
      API.setSelectedElements([rect]);

      slider = screen.getByTestId("corner-radius-slider") as HTMLInputElement;
      // Value should remain 28
      expect(parseInt(slider.value, 10)).toBe(28);
    });

    it("slider not rendered for elements too small to have radius", () => {
      const tinyRect = API.createElement({
        type: "rectangle",
        width: 1,
        height: 1,
      });

      API.setElements([tinyRect]);
      API.updateElement(tinyRect, {
        roundness: { type: ROUNDNESS.ADAPTIVE_RADIUS },
      });
      API.setSelectedElements([tinyRect]);

      // Slider should not show for elements too small
      expect(screen.queryByTestId("corner-radius-slider")).toBeNull();
    });
  });

  describe("Undo/Redo Tests", () => {
    it("slider change creates undoable action", () => {
      const rect = API.createElement({
        type: "rectangle",
        width: 100,
        height: 100,
      });

      API.setElements([rect]);
      API.updateElement(rect, {
        roundness: { type: ROUNDNESS.ADAPTIVE_RADIUS, value: 20 },
      });
      API.setSelectedElements([rect]);

      const initialUndoStackLength = API.getUndoStack().length;

      // Change radius via slider - this should create a history entry
      const slider = screen.getByTestId("corner-radius-slider");
      fireEvent.change(slider, { target: { value: "48" } });

      expect(API.getElement(rect).roundness?.value).toBe(48);
      // Verify a history entry was created
      expect(API.getUndoStack().length).toBeGreaterThan(initialUndoStackLength);
    });

    it("multiple slider changes work correctly", () => {
      const rect = API.createElement({
        type: "rectangle",
        width: 100,
        height: 100,
      });

      API.setElements([rect]);
      API.updateElement(rect, {
        roundness: { type: ROUNDNESS.ADAPTIVE_RADIUS, value: 10 },
      });
      API.setSelectedElements([rect]);

      // Make several changes
      const slider = screen.getByTestId("corner-radius-slider");
      fireEvent.change(slider, { target: { value: "20" } });
      expect(API.getElement(rect).roundness?.value).toBe(20);

      fireEvent.change(slider, { target: { value: "36" } });
      expect(API.getElement(rect).roundness?.value).toBe(36);

      fireEvent.change(slider, { target: { value: "48" } });
      expect(API.getElement(rect).roundness?.value).toBe(48);
    });
  });

  describe("Edge Cases", () => {
    it("ellipse elements do not show corner radius slider", () => {
      const ellipse = API.createElement({
        type: "ellipse",
        width: 100,
        height: 100,
      });

      API.setElements([ellipse]);
      API.setSelectedElements([ellipse]);

      // Ellipse is inherently round, no corner radius slider
      expect(screen.queryByTestId("corner-radius-slider")).toBeNull();
    });

    it("slider displays correct value when value equals max bound", () => {
      const rect = API.createElement({
        type: "rectangle",
        width: 100,
        height: 100,
      });

      API.setElements([rect]);
      // Set value to exactly max (50 = 100/2)
      API.updateElement(rect, {
        roundness: { type: ROUNDNESS.ADAPTIVE_RADIUS, value: 50 },
      });
      API.setSelectedElements([rect]);

      const slider = screen.getByTestId(
        "corner-radius-slider",
      ) as HTMLInputElement;
      expect(parseInt(slider.value, 10)).toBe(50);
      expect(slider.max).toBe("50");
    });

    it("value is clamped when it exceeds element size limit", () => {
      const rect = API.createElement({
        type: "rectangle",
        width: 60,
        height: 60,
      });

      API.setElements([rect]);
      // Set value larger than max (30 = 60/2)
      API.updateElement(rect, {
        roundness: { type: ROUNDNESS.ADAPTIVE_RADIUS, value: 100 },
      });
      API.setSelectedElements([rect]);

      const slider = screen.getByTestId(
        "corner-radius-slider",
      ) as HTMLInputElement;
      // Value should be clamped to max
      expect(parseInt(slider.value, 10)).toBe(30);
    });

    it("mixed selection with round and sharp elements shows slider only for round", () => {
      const roundRect = API.createElement({
        type: "rectangle",
        x: 0,
        width: 100,
        height: 100,
      });
      const sharpRect = API.createElement({
        type: "rectangle",
        x: 150,
        width: 100,
        height: 100,
        roundness: null,
      });

      API.setElements([roundRect, sharpRect]);
      API.updateElement(roundRect, {
        roundness: { type: ROUNDNESS.ADAPTIVE_RADIUS },
      });
      API.setSelectedElements([roundRect, sharpRect]);

      // Slider should show because there's at least one ADAPTIVE_RADIUS element
      expect(screen.queryByTestId("corner-radius-slider")).not.toBeNull();
    });
  });
});
