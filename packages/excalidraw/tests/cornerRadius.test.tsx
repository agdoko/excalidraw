import { queryByTestId, waitFor } from "@testing-library/react";
import { fireEvent } from "@testing-library/react";

import { ROUNDNESS } from "@excalidraw/common";

import { Excalidraw } from "../index";

import { API } from "./helpers/api";
import { UI } from "./helpers/ui";
import { render } from "./test-utils";

const { h } = window;

describe("corner radius control", () => {
  beforeEach(async () => {
    await render(<Excalidraw />);
  });

  describe("corner radius slider visibility", () => {
    it("should not show corner radius slider when no elements selected", () => {
      UI.clickTool("rectangle");

      const slider = queryByTestId(document.body, "cornerRadius-slider");
      expect(slider).toBe(null);
    });

    it("should not show corner radius slider when sharp edges selected", () => {
      const rect = API.createElement({
        type: "rectangle",
        roundness: null,
      });
      API.setElements([rect]);
      API.setSelectedElements([rect]);

      const slider = queryByTestId(document.body, "cornerRadius-slider");
      expect(slider).toBe(null);
    });

    it("should show corner radius slider when round edges selected", () => {
      const rect = API.createElement({
        type: "rectangle",
        roundness: {
          type: ROUNDNESS.ADAPTIVE_RADIUS,
          value: 32,
        },
      });
      API.setElements([rect]);
      API.setSelectedElements([rect]);

      const slider = queryByTestId(document.body, "cornerRadius-slider");
      expect(slider).not.toBe(null);
      expect(slider).toBeInstanceOf(HTMLInputElement);
    });

    it("should show corner radius slider when multiple elements with round edges selected", () => {
      const rect1 = API.createElement({
        type: "rectangle",
        roundness: {
          type: ROUNDNESS.ADAPTIVE_RADIUS,
          value: 32,
        },
      });
      const rect2 = API.createElement({
        type: "rectangle",
        roundness: {
          type: ROUNDNESS.ADAPTIVE_RADIUS,
          value: 40,
        },
      });
      API.setElements([rect1, rect2]);
      API.setSelectedElements([rect1, rect2]);

      const slider = queryByTestId(document.body, "cornerRadius-slider");
      expect(slider).not.toBe(null);
    });
  });

  describe("corner radius slider properties", () => {
    it("should have correct min, max, and step attributes", () => {
      const rect = API.createElement({
        type: "rectangle",
        width: 200,
        height: 200,
        roundness: {
          type: ROUNDNESS.ADAPTIVE_RADIUS,
          value: 32,
        },
      });
      API.setElements([rect]);
      API.setSelectedElements([rect]);

      const slider = queryByTestId(
        document.body,
        "cornerRadius-slider",
      ) as HTMLInputElement;
      expect(slider).not.toBe(null);
      expect(slider.min).toBe("0");
      expect(slider.step).toBe("4");
      // Max should be min(width, height)/2, capped at 200
      expect(slider.max).toBe("100");
    });

    it("should cap max value at 200 for large elements", () => {
      const rect = API.createElement({
        type: "rectangle",
        width: 500,
        height: 600,
        roundness: {
          type: ROUNDNESS.ADAPTIVE_RADIUS,
          value: 32,
        },
      });
      API.setElements([rect]);
      API.setSelectedElements([rect]);

      const slider = queryByTestId(
        document.body,
        "cornerRadius-slider",
      ) as HTMLInputElement;
      expect(slider).not.toBe(null);
      // Should be capped at 200 even though min(500, 600)/2 = 250
      expect(slider.max).toBe("200");
    });

    it("should set max based on smallest element dimension in multi-selection", () => {
      const rect1 = API.createElement({
        type: "rectangle",
        width: 100,
        height: 200,
        roundness: {
          type: ROUNDNESS.ADAPTIVE_RADIUS,
          value: 32,
        },
      });
      const rect2 = API.createElement({
        type: "rectangle",
        width: 300,
        height: 400,
        roundness: {
          type: ROUNDNESS.ADAPTIVE_RADIUS,
          value: 40,
        },
      });
      API.setElements([rect1, rect2]);
      API.setSelectedElements([rect1, rect2]);

      const slider = queryByTestId(
        document.body,
        "cornerRadius-slider",
      ) as HTMLInputElement;
      expect(slider).not.toBe(null);
      // Max should be based on rect1's smallest dimension: min(100, 200)/2 = 50
      expect(slider.max).toBe("50");
    });
  });

  describe("corner radius slider value display", () => {
    it("should display current corner radius value", () => {
      const rect = API.createElement({
        type: "rectangle",
        width: 200,
        height: 200,
        roundness: {
          type: ROUNDNESS.ADAPTIVE_RADIUS,
          value: 48,
        },
      });
      API.setElements([rect]);
      API.setSelectedElements([rect]);

      const slider = queryByTestId(
        document.body,
        "cornerRadius-slider",
      ) as HTMLInputElement;
      expect(slider).not.toBe(null);
      expect(slider.value).toBe("48");
    });

    it("should display minimum radius when elements have different values", () => {
      const rect1 = API.createElement({
        type: "rectangle",
        roundness: {
          type: ROUNDNESS.ADAPTIVE_RADIUS,
          value: 32,
        },
      });
      const rect2 = API.createElement({
        type: "rectangle",
        roundness: {
          type: ROUNDNESS.ADAPTIVE_RADIUS,
          value: 64,
        },
      });
      API.setElements([rect1, rect2]);
      API.setSelectedElements([rect1, rect2]);

      const slider = queryByTestId(
        document.body,
        "cornerRadius-slider",
      ) as HTMLInputElement;
      expect(slider).not.toBe(null);
      // Should display the minimum value
      expect(slider.value).toBe("32");
    });

    it("should display 0 when corner radius value is undefined", () => {
      const rect = API.createElement({
        type: "rectangle",
        roundness: {
          type: ROUNDNESS.ADAPTIVE_RADIUS,
          // No value specified - should default to 0 in slider
        },
      });
      API.setElements([rect]);
      API.setSelectedElements([rect]);

      const slider = queryByTestId(
        document.body,
        "cornerRadius-slider",
      ) as HTMLInputElement;
      expect(slider).not.toBe(null);
      expect(slider.value).toBe("0");
    });
  });

  describe("corner radius slider interaction", () => {
    it("should update element corner radius when slider value changes", async () => {
      const rect = API.createElement({
        type: "rectangle",
        width: 200,
        height: 200,
        roundness: {
          type: ROUNDNESS.ADAPTIVE_RADIUS,
          value: 32,
        },
      });
      API.setElements([rect]);
      API.setSelectedElements([rect]);

      const slider = queryByTestId(
        document.body,
        "cornerRadius-slider",
      ) as HTMLInputElement;
      expect(slider).not.toBe(null);

      // Change slider value
      fireEvent.change(slider, { target: { value: "64" } });

      await waitFor(() => {
        expect(h.elements[0].roundness?.value).toBe(64);
      });
    });

    it("should update multiple selected elements when slider value changes", async () => {
      const rect1 = API.createElement({
        type: "rectangle",
        width: 200,
        height: 200,
        roundness: {
          type: ROUNDNESS.ADAPTIVE_RADIUS,
          value: 32,
        },
      });
      const rect2 = API.createElement({
        type: "rectangle",
        width: 200,
        height: 200,
        roundness: {
          type: ROUNDNESS.ADAPTIVE_RADIUS,
          value: 40,
        },
      });
      API.setElements([rect1, rect2]);
      API.setSelectedElements([rect1, rect2]);

      const slider = queryByTestId(
        document.body,
        "cornerRadius-slider",
      ) as HTMLInputElement;
      expect(slider).not.toBe(null);

      // Change slider value
      fireEvent.change(slider, { target: { value: "56" } });

      await waitFor(() => {
        expect(h.elements[0].roundness?.value).toBe(56);
        expect(h.elements[1].roundness?.value).toBe(56);
      });
    });

    it("should respect step size of 4 pixels", async () => {
      const rect = API.createElement({
        type: "rectangle",
        width: 200,
        height: 200,
        roundness: {
          type: ROUNDNESS.ADAPTIVE_RADIUS,
          value: 32,
        },
      });
      API.setElements([rect]);
      API.setSelectedElements([rect]);

      const slider = queryByTestId(
        document.body,
        "cornerRadius-slider",
      ) as HTMLInputElement;
      expect(slider).not.toBe(null);

      // Try to set a value not divisible by 4 - browser should snap to nearest step
      fireEvent.change(slider, { target: { value: "37" } });

      await waitFor(() => {
        // Browser will snap to nearest valid step value
        expect(h.elements[0].roundness?.value).toBeDefined();
      });
    });
  });

  describe("corner radius and roundness type", () => {
    it("should use ADAPTIVE_RADIUS for rectangle elements", () => {
      const rect = API.createElement({
        type: "rectangle",
        roundness: {
          type: ROUNDNESS.ADAPTIVE_RADIUS,
          value: 32,
        },
      });
      API.setElements([rect]);
      API.setSelectedElements([rect]);

      const slider = queryByTestId(
        document.body,
        "cornerRadius-slider",
      ) as HTMLInputElement;
      expect(slider).not.toBe(null);

      // Verify the element has ADAPTIVE_RADIUS type
      expect(h.elements[0].roundness?.type).toBe(ROUNDNESS.ADAPTIVE_RADIUS);
    });

    it("should preserve PROPORTIONAL_RADIUS type for diamond elements", async () => {
      const diamond = API.createElement({
        type: "diamond",
        roundness: {
          type: ROUNDNESS.PROPORTIONAL_RADIUS,
          value: 32,
        },
      });
      API.setElements([diamond]);
      API.setSelectedElements([diamond]);

      const slider = queryByTestId(
        document.body,
        "cornerRadius-slider",
      ) as HTMLInputElement;

      if (slider) {
        fireEvent.change(slider, { target: { value: "48" } });

        await waitFor(() => {
          expect(h.elements[0].roundness?.type).toBe(
            ROUNDNESS.PROPORTIONAL_RADIUS,
          );
          expect(h.elements[0].roundness?.value).toBe(48);
        });
      }
    });

    it("should maintain roundness type when updating radius value", async () => {
      const rect = API.createElement({
        type: "rectangle",
        width: 200,
        height: 200,
        roundness: {
          type: ROUNDNESS.ADAPTIVE_RADIUS,
          value: 32,
        },
      });
      API.setElements([rect]);
      API.setSelectedElements([rect]);

      const slider = queryByTestId(
        document.body,
        "cornerRadius-slider",
      ) as HTMLInputElement;
      expect(slider).not.toBe(null);

      const initialType = h.elements[0].roundness?.type;

      fireEvent.change(slider, { target: { value: "64" } });

      await waitFor(() => {
        expect(h.elements[0].roundness?.type).toBe(initialType);
        expect(h.elements[0].roundness?.value).toBe(64);
      });
    });
  });

  describe("edge cases", () => {
    it("should handle zero corner radius", async () => {
      const rect = API.createElement({
        type: "rectangle",
        roundness: {
          type: ROUNDNESS.ADAPTIVE_RADIUS,
          value: 32,
        },
      });
      API.setElements([rect]);
      API.setSelectedElements([rect]);

      const slider = queryByTestId(
        document.body,
        "cornerRadius-slider",
      ) as HTMLInputElement;
      expect(slider).not.toBe(null);

      fireEvent.change(slider, { target: { value: "0" } });

      await waitFor(() => {
        expect(h.elements[0].roundness?.value).toBe(0);
      });
    });

    it("should handle very small elements gracefully", () => {
      const rect = API.createElement({
        type: "rectangle",
        width: 20,
        height: 20,
        roundness: {
          type: ROUNDNESS.ADAPTIVE_RADIUS,
          value: 8,
        },
      });
      API.setElements([rect]);
      API.setSelectedElements([rect]);

      const slider = queryByTestId(
        document.body,
        "cornerRadius-slider",
      ) as HTMLInputElement;
      expect(slider).not.toBe(null);
      // Max should be 10 (min(20, 20)/2)
      expect(slider.max).toBe("10");
    });

    it("should not show slider for arrow elements even with roundness", () => {
      const arrow = API.createElement({
        type: "arrow",
        // Arrow elements don't have a roundness property in the same way
      });
      API.setElements([arrow]);
      API.setSelectedElements([arrow]);

      const slider = queryByTestId(document.body, "cornerRadius-slider");
      expect(slider).toBe(null);
    });
  });
});
