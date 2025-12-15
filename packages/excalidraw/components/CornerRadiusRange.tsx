import React, { useEffect } from "react";

import { DEFAULT_ADAPTIVE_RADIUS, ROUNDNESS } from "@excalidraw/common";

import type { ExcalidrawElement } from "@excalidraw/element/types";

import { t } from "../i18n";

import "./Range.scss";

import type { AppClassProperties } from "../types";

export type CornerRadiusRangeProps = {
  updateData: (value: number) => void;
  app: AppClassProperties;
  elements: readonly ExcalidrawElement[];
  testId?: string;
};

export const CornerRadiusRange = ({
  updateData,
  app,
  elements,
  testId,
}: CornerRadiusRangeProps) => {
  const rangeRef = React.useRef<HTMLInputElement>(null);
  const valueRef = React.useRef<HTMLDivElement>(null);

  const selectedElements = app.scene.getSelectedElements(app.state);

  // Only include elements that have adaptive roundness enabled
  const adaptiveElements = selectedElements.filter(
    (el) => el.roundness?.type === ROUNDNESS.ADAPTIVE_RADIUS,
  );

  // Calculate max radius as minimum of (width/2, height/2) across all selected elements
  const maxRadius =
    adaptiveElements.length > 0
      ? Math.max(
          1,
          Math.min(
            ...adaptiveElements.map((el) =>
              Math.floor(Math.min(el.width, el.height) / 2),
            ),
          ),
        )
      : DEFAULT_ADAPTIVE_RADIUS;

  // Get the common value or use the first element's value
  let hasCommonValue = true;
  const firstElement = adaptiveElements.at(0);
  const leastCommonValue = adaptiveElements.reduce((acc, element) => {
    const elementValue = element.roundness?.value ?? DEFAULT_ADAPTIVE_RADIUS;
    if (acc != null && acc !== elementValue) {
      hasCommonValue = false;
    }
    if (acc == null || acc > elementValue) {
      return elementValue;
    }
    return acc;
  }, firstElement?.roundness?.value ?? null);

  const value = Math.min(
    leastCommonValue ??
      app.state.currentItemCornerRadius ??
      DEFAULT_ADAPTIVE_RADIUS,
    maxRadius,
  );

  useEffect(() => {
    if (rangeRef.current && valueRef.current) {
      const rangeElement = rangeRef.current;
      const valueElement = valueRef.current;
      const inputWidth = rangeElement.offsetWidth;
      const thumbWidth = 15;
      const normalizedValue = maxRadius > 1 ? (value - 1) / (maxRadius - 1) : 0;
      const position =
        normalizedValue * (inputWidth - thumbWidth) + thumbWidth / 2;
      valueElement.style.left = `${position}px`;

      const percentage =
        maxRadius > 1 ? ((value - 1) / (maxRadius - 1)) * 100 : 0;
      rangeElement.style.background = `linear-gradient(to right, var(--color-slider-track) 0%, var(--color-slider-track) ${percentage}%, var(--button-bg) ${percentage}%, var(--button-bg) 100%)`;
    }
  }, [value, maxRadius]);

  return (
    <label className="control-label">
      {t("labels.cornerRadius")}
      <div className="range-wrapper">
        <input
          style={{
            ["--color-slider-track" as string]: hasCommonValue
              ? undefined
              : "var(--button-bg)",
          }}
          ref={rangeRef}
          type="range"
          min="1"
          max={maxRadius}
          step="1"
          onChange={(event) => {
            updateData(+event.target.value);
          }}
          value={value}
          className="range-input"
          data-testid={testId}
        />
        <div className="value-bubble" ref={valueRef}>
          {value}
        </div>
        <div className="zero-label">1</div>
      </div>
    </label>
  );
};
