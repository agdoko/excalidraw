import React from "react";
import { ROUNDNESS } from "@excalidraw/common";

import { Excalidraw } from "../index";

import { API } from "./helpers/api";
import { act, fireEvent, render, screen } from "./test-utils";

const { h } = window;
const ADAPTIVE = { type: ROUNDNESS.ADAPTIVE_RADIUS };

describe("Corner Radius", () => {
  beforeEach(async () => {
    await render(<Excalidraw />);
  });

  afterEach(async () => {
    await act(async () => {});
  });

  it("updates element roundness.value and appState", async () => {
    const rect = API.createElement({
      type: "rectangle",
      width: 100,
      height: 100,
      roundness: ADAPTIVE,
    });
    API.updateScene({ elements: [rect] });
    API.setSelectedElements([rect]);

    fireEvent.change(screen.getByTestId("corner-radius"), {
      target: { value: "20" },
    });

    expect(API.getElement(rect).roundness?.value).toBe(20);
    expect(h.state.currentItemCornerRadius).toBe(20);
  });

  it("slider only appears when roundness is enabled", async () => {
    const sharpRect = API.createElement({
      type: "rectangle",
      width: 100,
      height: 100,
      roundness: null,
    });
    API.updateScene({ elements: [sharpRect] });
    API.setSelectedElements([sharpRect]);
    expect(screen.queryByTestId("corner-radius")).toBeNull();

    const roundRect = API.createElement({
      type: "rectangle",
      x: 200,
      width: 100,
      height: 100,
      roundness: ADAPTIVE,
    });
    API.updateScene({ elements: [sharpRect, roundRect] });
    API.setSelectedElements([roundRect]);
    expect(screen.queryByTestId("corner-radius")).not.toBeNull();
  });

  it("slider max is calculated from element dimensions", async () => {
    const rect = API.createElement({
      type: "rectangle",
      width: 100,
      height: 80,
      roundness: ADAPTIVE,
    });
    API.updateScene({ elements: [rect] });
    API.setSelectedElements([rect]);

    // Max should be floor(min(100, 80) / 2) = 40
    expect(screen.getByTestId("corner-radius").getAttribute("max")).toBe("40");
  });

  it("multi-element selection uses minimum max radius", async () => {
    const rect1 = API.createElement({
      type: "rectangle",
      width: 100,
      height: 100,
      roundness: ADAPTIVE,
    });
    const rect2 = API.createElement({
      type: "rectangle",
      x: 200,
      width: 200,
      height: 200,
      roundness: ADAPTIVE,
    });
    API.updateScene({ elements: [rect1, rect2] });
    API.setSelectedElements([rect1, rect2]);

    // Max should be min(50, 100) = 50
    expect(screen.getByTestId("corner-radius").getAttribute("max")).toBe("50");
  });

  it("only updates elements with roundness enabled", async () => {
    const roundRect = API.createElement({
      type: "rectangle",
      width: 100,
      height: 100,
      roundness: ADAPTIVE,
    });
    const sharpRect = API.createElement({
      type: "rectangle",
      x: 200,
      width: 100,
      height: 100,
      roundness: null,
    });
    API.updateScene({ elements: [roundRect, sharpRect] });
    API.setSelectedElements([roundRect, sharpRect]);

    fireEvent.change(screen.getByTestId("corner-radius"), {
      target: { value: "25" },
    });

    expect(API.getElement(roundRect).roundness?.value).toBe(25);
    expect(API.getElement(sharpRect).roundness).toBeNull();
  });
});
