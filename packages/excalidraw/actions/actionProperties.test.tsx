import React from "react";

import { queryByTestId } from "@testing-library/react";

import {
  COLOR_PALETTE,
  DEFAULT_ELEMENT_BACKGROUND_PICKS,
  FONT_FAMILY,
  ROUNDNESS,
  STROKE_WIDTH,
} from "@excalidraw/common";

import { getCornerRadius } from "@excalidraw/element";

import { actionChangeCornerRadius } from "./actionProperties";

import { Excalidraw } from "../index";
import { API } from "../tests/helpers/api";
import { UI } from "../tests/helpers/ui";
import { render, fireEvent, screen } from "../tests/test-utils";

describe("element locking", () => {
  beforeEach(async () => {
    await render(<Excalidraw />);
  });

  describe("properties when tool selected", () => {
    it("should show active background top picks", () => {
      UI.clickTool("rectangle");

      const color = DEFAULT_ELEMENT_BACKGROUND_PICKS[1];

      // just in case we change it in the future
      expect(color).not.toBe(COLOR_PALETTE.transparent);

      API.setAppState({
        currentItemBackgroundColor: color,
      });
      const activeColor = queryByTestId(
        document.body,
        `color-top-pick-${color}`,
      );
      expect(activeColor).toHaveClass("active");
    });

    it("should show fill style when background non-transparent", () => {
      UI.clickTool("rectangle");

      const color = DEFAULT_ELEMENT_BACKGROUND_PICKS[1];

      // just in case we change it in the future
      expect(color).not.toBe(COLOR_PALETTE.transparent);

      API.setAppState({
        currentItemBackgroundColor: color,
        currentItemFillStyle: "hachure",
      });
      const hachureFillButton = queryByTestId(document.body, `fill-hachure`);

      expect(hachureFillButton).toHaveClass("active");
      API.setAppState({
        currentItemFillStyle: "solid",
      });
      const solidFillStyle = queryByTestId(document.body, `fill-solid`);
      expect(solidFillStyle).toHaveClass("active");
    });

    it("should not show fill style when background transparent", () => {
      UI.clickTool("rectangle");

      API.setAppState({
        currentItemBackgroundColor: COLOR_PALETTE.transparent,
        currentItemFillStyle: "hachure",
      });
      const hachureFillButton = queryByTestId(document.body, `fill-hachure`);

      expect(hachureFillButton).toBe(null);
    });

    it("should show horizontal text align for text tool", () => {
      UI.clickTool("text");

      API.setAppState({
        currentItemTextAlign: "right",
      });

      const centerTextAlign = queryByTestId(document.body, `align-right`);
      expect(centerTextAlign).toBeChecked();
    });
  });

  describe("properties when elements selected", () => {
    it("should show active styles when single element selected", () => {
      const rect = API.createElement({
        type: "rectangle",
        backgroundColor: "red",
        fillStyle: "cross-hatch",
      });
      API.setElements([rect]);
      API.setSelectedElements([rect]);

      const crossHatchButton = queryByTestId(document.body, `fill-cross-hatch`);
      expect(crossHatchButton).toHaveClass("active");
    });

    it("should not show fill style selected element's background is transparent", () => {
      const rect = API.createElement({
        type: "rectangle",
        backgroundColor: COLOR_PALETTE.transparent,
        fillStyle: "cross-hatch",
      });
      API.setElements([rect]);
      API.setSelectedElements([rect]);

      const crossHatchButton = queryByTestId(document.body, `fill-cross-hatch`);
      expect(crossHatchButton).toBe(null);
    });

    it("should highlight common stroke width of selected elements", () => {
      const rect1 = API.createElement({
        type: "rectangle",
        strokeWidth: STROKE_WIDTH.thin,
      });
      const rect2 = API.createElement({
        type: "rectangle",
        strokeWidth: STROKE_WIDTH.thin,
      });
      API.setElements([rect1, rect2]);
      API.setSelectedElements([rect1, rect2]);

      const thinStrokeWidthButton = queryByTestId(
        document.body,
        `strokeWidth-thin`,
      );
      expect(thinStrokeWidthButton).toBeChecked();
    });

    it("should not highlight any stroke width button if no common style", () => {
      const rect1 = API.createElement({
        type: "rectangle",
        strokeWidth: STROKE_WIDTH.thin,
      });
      const rect2 = API.createElement({
        type: "rectangle",
        strokeWidth: STROKE_WIDTH.bold,
      });
      API.setElements([rect1, rect2]);
      API.setSelectedElements([rect1, rect2]);

      expect(queryByTestId(document.body, `strokeWidth-thin`)).not.toBe(null);
      expect(
        queryByTestId(document.body, `strokeWidth-thin`),
      ).not.toBeChecked();
      expect(
        queryByTestId(document.body, `strokeWidth-bold`),
      ).not.toBeChecked();
      expect(
        queryByTestId(document.body, `strokeWidth-extraBold`),
      ).not.toBeChecked();
    });

    it("should show properties of different element types when selected", () => {
      const rect = API.createElement({
        type: "rectangle",
        strokeWidth: STROKE_WIDTH.bold,
      });
      const text = API.createElement({
        type: "text",
        fontFamily: FONT_FAMILY["Comic Shanns"],
      });
      API.setElements([rect, text]);
      API.setSelectedElements([rect, text]);

      expect(queryByTestId(document.body, `strokeWidth-bold`)).toBeChecked();
      expect(queryByTestId(document.body, `font-family-code`)).toHaveClass(
        "active",
      );
    });
  });
});

describe("actionChangeCornerRadius", () => {
  // perform() tests use plain element objects — no render needed

  it("perform sets roundness.value on adaptive-radius rectangle", () => {
    const el = { id: "rect1", roundness: { type: ROUNDNESS.ADAPTIVE_RADIUS } } as any;
    const result = actionChangeCornerRadius.perform!(
      [el],
      { selectedElementIds: { rect1: true } } as any,
      25,
      null as any,
    );
    const updated = (result as any).elements[0];
    expect(updated.roundness?.value).toBe(25);
  });

  it("perform leaves sharp (null roundness) elements unchanged", () => {
    const el = { id: "rect2", roundness: null } as any;
    const result = actionChangeCornerRadius.perform!(
      [el],
      { selectedElementIds: { rect2: true } } as any,
      25,
      null as any,
    );
    const updated = (result as any).elements[0];
    expect(updated.roundness).toBeNull();
  });

  it("perform leaves proportional-radius elements unchanged", () => {
    const el = {
      id: "diamond1",
      roundness: { type: ROUNDNESS.PROPORTIONAL_RADIUS },
    } as any;
    const result = actionChangeCornerRadius.perform!(
      [el],
      { selectedElementIds: { diamond1: true } } as any,
      25,
      null as any,
    );
    const updated = (result as any).elements[0];
    expect(updated.roundness?.type).toBe(ROUNDNESS.PROPORTIONAL_RADIUS);
    expect(updated.roundness?.value).toBeUndefined();
  });

  it("getCornerRadius clamps oversized value to x/2 for large elements", () => {
    // Use a large x so the CUTOFF branch does not trigger:
    // fixedRadiusSize = min(50, 400/2=200) = 50; CUTOFF = 50/0.25 = 200; x(400) > 200 → returns 50
    const fakeEl = {
      roundness: { type: ROUNDNESS.ADAPTIVE_RADIUS, value: 50 },
    } as any;
    expect(getCornerRadius(400, fakeEl)).toBe(50);
  });

  it("getCornerRadius returns in-range value when element is above cutoff", () => {
    // value=30, x=200: fixedRadiusSize=30, CUTOFF=30/0.25=120; 200>120 → returns 30
    const fakeEl = {
      roundness: { type: ROUNDNESS.ADAPTIVE_RADIUS, value: 30 },
    } as any;
    expect(getCornerRadius(200, fakeEl)).toBe(30);
  });
});
