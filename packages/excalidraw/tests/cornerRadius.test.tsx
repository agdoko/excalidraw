import React from "react";

import { ROUNDNESS } from "@excalidraw/common";

import { Excalidraw } from "../index";

import { API } from "./helpers/api";
import { render, fireEvent, screen } from "./test-utils";

describe("Corner radius slider", () => {
  beforeEach(async () => {
    await render(<Excalidraw />);
  });

  it("stores custom roundness.value on rectangle", () => {
    const rect = API.createElement({
      type: "rectangle",
      width: 200,
      height: 100,
      roundness: { type: ROUNDNESS.ADAPTIVE_RADIUS, value: 20 },
    });
    API.updateScene({ elements: [rect] });

    const updated = API.getElement(rect);
    expect(updated.roundness?.value).toBe(20);
  });

  it("shows slider when round rectangle is selected", () => {
    const rect = API.createElement({
      type: "rectangle",
      width: 200,
      height: 100,
      roundness: { type: ROUNDNESS.ADAPTIVE_RADIUS },
    });
    API.updateScene({ elements: [rect] });
    API.setSelectedElements([rect]);

    expect(screen.getByTestId("corner-radius-slider")).toBeTruthy();
  });

  it("hides slider when sharp rectangle is selected", () => {
    const rect = API.createElement({
      type: "rectangle",
      width: 200,
      height: 100,
      roundness: null,
    });
    API.updateScene({ elements: [rect] });
    API.setSelectedElements([rect]);

    expect(screen.queryByTestId("corner-radius-slider")).toBeNull();
  });

  it("updates element roundness.value when slider changes", () => {
    const rect = API.createElement({
      type: "rectangle",
      width: 200,
      height: 100,
      roundness: { type: ROUNDNESS.ADAPTIVE_RADIUS, value: 32 },
    });
    API.updateScene({ elements: [rect] });
    API.setSelectedElements([rect]);

    fireEvent.change(screen.getByTestId("corner-radius-slider"), {
      target: { value: "15" },
    });

    const updated = API.getElement(rect);
    expect(updated.roundness?.value).toBe(15);
  });

  it("updates appState.currentItemCornerRadius when slider changes", () => {
    const rect = API.createElement({
      type: "rectangle",
      width: 200,
      height: 100,
      roundness: { type: ROUNDNESS.ADAPTIVE_RADIUS, value: 32 },
    });
    API.updateScene({ elements: [rect] });
    API.setSelectedElements([rect]);

    fireEvent.change(screen.getByTestId("corner-radius-slider"), {
      target: { value: "10" },
    });

    expect(h.state.currentItemCornerRadius).toBe(10);
  });

  it("slider max is clamped to half of smallest dimension", () => {
    const rect = API.createElement({
      type: "rectangle",
      width: 80,
      height: 60,
      roundness: { type: ROUNDNESS.ADAPTIVE_RADIUS },
    });
    API.updateScene({ elements: [rect] });
    API.setSelectedElements([rect]);

    const slider = screen.getByTestId(
      "corner-radius-slider",
    ) as HTMLInputElement;
    expect(slider.max).toBe("30"); // Math.floor(60 / 2)
  });
});
