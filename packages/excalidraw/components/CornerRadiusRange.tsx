import React, { useEffect } from "react";

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

  // Calculate the valid range for corner radius based on selected elements
  let maxRangeValue = 200;

  if (selectedElements.length > 0) {
    // Get the maximum possible radius for each element and use the minimum across all
    const radiusLimits = selectedElements
      .filter((el) => el.roundness)
      .map((el) => Math.floor(Math.min(el.width, el.height) / 2))
      .filter((val) => val > 0);

    if (radiusLimits.length > 0) {
      maxRangeValue = Math.min(200, Math.min(...radiusLimits));
    }
  }

  // Get the least common corner radius across selected elements
  let hasCommonRadius = true;
  const firstElement = selectedElements.at(0);
  const leastCommonRadius = selectedElements.reduce((acc, element) => {
    const currentRadius = element.roundness?.value ?? 0;
    if (acc != null && acc !== currentRadius) {
      hasCommonRadius = false;
    }
    if (acc == null || acc > currentRadius) {
      return currentRadius;
    }
    return acc;
  }, (firstElement?.roundness?.value ?? null) as number | null);

  const value = leastCommonRadius ?? 0;

  useEffect(() => {
    if (rangeRef.current && valueRef.current) {
      const rangeElement = rangeRef.current;
      const valueElement = valueRef.current;
      const inputWidth = rangeElement.offsetWidth;
      const thumbWidth = 15;
      const position =
        (value / (maxRangeValue || 1)) * (inputWidth - thumbWidth) +
        thumbWidth / 2;
      valueElement.style.left = `${position}px`;
      const percentage = maxRangeValue > 0 ? (value / maxRangeValue) * 100 : 0;
      rangeElement.style.background = `linear-gradient(to right, var(--color-slider-track) 0%, var(--color-slider-track) ${percentage}%, var(--button-bg) ${percentage}%, var(--button-bg) 100%)`;
    }
  }, [value, maxRangeValue]);

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
          max={maxRangeValue}
          step="4"
          onChange={(event) => {
            updateData(+event.target.value);
          }}
          value={value}
          className="range-input"
          data-testid={testId}
        />
        <div className="value-bubble" ref={valueRef}>
          {value !== 0 ? value : null}
        </div>
        <div className="zero-label">0</div>
      </div>
    </label>
  );
};
