import React, { useEffect } from "react";

import { DEFAULT_ADAPTIVE_RADIUS } from "@excalidraw/common";
import { isUsingAdaptiveRadius } from "@excalidraw/element";

import { t } from "../i18n";

import "./Range.scss";

import type { AppClassProperties } from "../types";

export type CornerRadiusRangeProps = {
  updateData: (value: number) => void;
  app: AppClassProperties;
  testId?: string;
};

export const CornerRadiusRange = ({
  updateData,
  app,
  testId,
}: CornerRadiusRangeProps) => {
  const rangeRef = React.useRef<HTMLInputElement>(null);
  const valueRef = React.useRef<HTMLDivElement>(null);
  const selectedElements = app.scene.getSelectedElements(app.state);

  // Filter for elements with roundness enabled
  const roundedElements = selectedElements.filter(
    (el) => el.roundness && isUsingAdaptiveRadius(el.type),
  );

  // Calculate dynamic max radius based on smallest element dimensions
  let maxRadius = 1000; // fallback max
  if (roundedElements.length > 0) {
    maxRadius = Math.min(
      ...roundedElements.map((el) => Math.min(el.width, el.height) / 2),
    );
  }

  // Get least common radius (like opacity pattern)
  let hasCommonRadius = true;
  const firstElement = roundedElements.at(0);
  const leastCommonRadius = roundedElements.reduce(
    (acc, element) => {
      const radius = element.roundness?.value ?? DEFAULT_ADAPTIVE_RADIUS;
      if (acc != null && acc !== radius) {
        hasCommonRadius = false;
      }
      if (acc == null || acc > radius) {
        return radius;
      }
      return acc;
    },
    firstElement
      ? firstElement.roundness?.value ?? DEFAULT_ADAPTIVE_RADIUS
      : null,
  );

  const value = leastCommonRadius ?? app.state.currentItemCornerRadius;

  useEffect(() => {
    if (rangeRef.current && valueRef.current) {
      const rangeElement = rangeRef.current;
      const valueElement = valueRef.current;
      const inputWidth = rangeElement.offsetWidth;
      const thumbWidth = 15;
      const position =
        (value / maxRadius) * (inputWidth - thumbWidth) + thumbWidth / 2;
      valueElement.style.left = `${position}px`;
      rangeElement.style.background = `linear-gradient(to right, var(--color-slider-track) 0%, var(--color-slider-track) ${
        (value / maxRadius) * 100
      }%, var(--button-bg) ${
        (value / maxRadius) * 100
      }%, var(--button-bg) 100%)`;
    }
  }, [value, maxRadius]);

  return (
    <label className="control-label">
      {t("labels.cornerRadius")}
      <div className="range-wrapper">
        <input
          style={{
            ["--color-slider-track" as string]: hasCommonRadius
              ? undefined
              : "var(--button-bg)",
          }}
          ref={rangeRef}
          type="range"
          min="0"
          max={Math.round(maxRadius)}
          step="1"
          onChange={(event) => {
            updateData(+event.target.value);
          }}
          value={value}
          className="range-input"
          data-testid={testId}
        />
        <div className="value-bubble" ref={valueRef}>
          {value !== 0 ? `${Math.round(value)}px` : null}
        </div>
        <div className="zero-label">0</div>
      </div>
    </label>
  );
};
