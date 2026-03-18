import React from "react";

import { ROUNDNESS, DEFAULT_ADAPTIVE_RADIUS } from "@excalidraw/common";

import { Excalidraw } from "../index";

import { API } from "./helpers/api";
import { Keyboard } from "./helpers/ui";
import { act, fireEvent, render, screen } from "./test-utils";

describe("corner radius slider", () => {
  beforeEach(async () => {
    await render(<Excalidraw handleKeyboardGlobally={true} />);
  });

  afterEach(async () => {
    await act(async () => {});
  });

  it("slider is visible when a rounded rectangle is selected", async () => {
    const rect = API.createElement({
      type: "rectangle",
      width: 100,
      height: 100,
      roundness: { type: ROUNDNESS.ADAPTIVE_RADIUS, value: 20 },
    });
    API.updateScene({ elements: [rect] });
    API.setSelectedElements([rect]);

    expect(screen.getByTestId("corner-radius")).toBeTruthy();
  });

  it("slider is NOT visible when a sharp rectangle is selected", async () => {
    const rect = API.createElement({
      type: "rectangle",
      width: 100,
      height: 100,
      roundness: null,
    });
    API.updateScene({ elements: [rect] });
    API.setSelectedElements([rect]);

    expect(screen.queryByTestId("corner-radius")).toBeNull();
  });

  it("changing slider value updates element roundness.value", async () => {
    const rect = API.createElement({
      type: "rectangle",
      width: 100,
      height: 100,
      roundness: { type: ROUNDNESS.ADAPTIVE_RADIUS, value: 20 },
    });
    API.updateScene({ elements: [rect] });
    API.setSelectedElements([rect]);

    fireEvent.change(screen.getByTestId("corner-radius"), {
      target: { value: "30" },
    });

    const updated = API.getElement(rect);
    expect(updated.roundness?.value).toBe(30);
  });

  it("undo restores previous radius value", async () => {
    const rect = API.createElement({
      type: "rectangle",
      width: 100,
      height: 100,
      roundness: { type: ROUNDNESS.ADAPTIVE_RADIUS, value: 20 },
    });
    API.updateScene({ elements: [rect] });
    API.setSelectedElements([rect]);

    // First change: 20 → 30
    fireEvent.change(screen.getByTestId("corner-radius"), {
      target: { value: "30" },
    });
    expect(API.getElement(rect).roundness?.value).toBe(30);

    // Second change: 30 → 40
    fireEvent.change(screen.getByTestId("corner-radius"), {
      target: { value: "40" },
    });
    expect(API.getElement(rect).roundness?.value).toBe(40);

    // Undo: should revert to 30
    Keyboard.undo();

    const reverted = API.getElement(rect);
    expect(reverted.roundness?.value).toBe(30);
  });

  it("undo then redo restores the changed radius value", async () => {
    const rect = API.createElement({
      type: "rectangle",
      width: 100,
      height: 100,
      roundness: { type: ROUNDNESS.ADAPTIVE_RADIUS, value: 20 },
    });
    API.updateScene({ elements: [rect] });
    API.setSelectedElements([rect]);

    // First change: 20 → 30
    fireEvent.change(screen.getByTestId("corner-radius"), {
      target: { value: "30" },
    });
    // Second change: 30 → 40
    fireEvent.change(screen.getByTestId("corner-radius"), {
      target: { value: "40" },
    });
    expect(API.getElement(rect).roundness?.value).toBe(40);

    Keyboard.undo();
    expect(API.getElement(rect).roundness?.value).toBe(30);

    Keyboard.redo();
    expect(API.getElement(rect).roundness?.value).toBe(40);
  });

  it("slider max is clamped to Math.floor(min(width, height) / 2)", async () => {
    const rect = API.createElement({
      type: "rectangle",
      width: 120,
      height: 80,
      roundness: {
        type: ROUNDNESS.ADAPTIVE_RADIUS,
        value: DEFAULT_ADAPTIVE_RADIUS,
      },
    });
    API.updateScene({ elements: [rect] });
    API.setSelectedElements([rect]);

    const slider = screen.getByTestId("corner-radius") as HTMLInputElement;
    // min(120, 80) / 2 = 40
    expect(Number(slider.max)).toBe(40);
  });

  it("slider max uses the smaller dimension when width > height", async () => {
    const rect = API.createElement({
      type: "rectangle",
      width: 200,
      height: 60,
      roundness: { type: ROUNDNESS.ADAPTIVE_RADIUS, value: 10 },
    });
    API.updateScene({ elements: [rect] });
    API.setSelectedElements([rect]);

    const slider = screen.getByTestId("corner-radius") as HTMLInputElement;
    // min(200, 60) / 2 = 30
    expect(Number(slider.max)).toBe(30);
  });
});
