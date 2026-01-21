import React, { useEffect } from "react";

import { t } from "../i18n";

import "./Range.scss";

import type { AppClassProperties } from "../types";

export type CornerRadiusRangeProps = {
  updateData: (value: number) => void;
  app: AppClassProperties;
  maxRadius: number;
  testId?: string;
};

export const CornerRadiusRange = ({
  updateData,
  app,
  maxRadius,
  testId,
}: CornerRadiusRangeProps) => {
  const rangeRef = React.useRef<HTMLInputElement>(null);
  const valueRef = React.useRef<HTMLDivElement>(null);
  const selectedElements = app.scene.getSelectedElements(app.state);

  let hasCommonRadius = true;
  const firstElement = selectedElements.at(0);
  const leastCommonRadius = selectedElements.reduce((acc, element) => {
    const elementRadius = element.roundness?.value ?? 32;
    if (acc != null && acc !== elementRadius) {
      hasCommonRadius = false;
    }
    if (acc == null || acc > elementRadius) {
      return elementRadius;
    }
    return acc;
  }, firstElement?.roundness?.value ?? null);

  const value = leastCommonRadius ?? app.state.currentItemCornerRadius ?? 32;

  // Clamp to max radius
  const displayValue = Math.min(value, maxRadius);
  const percentage = maxRadius > 0 ? (displayValue / maxRadius) * 100 : 0;

  useEffect(() => {
    if (rangeRef.current && valueRef.current) {
      const rangeElement = rangeRef.current;
      const valueElement = valueRef.current;
      const inputWidth = rangeElement.offsetWidth;
      const thumbWidth = 15; // 15 is the width of the thumb
      const position =
        (percentage / 100) * (inputWidth - thumbWidth) + thumbWidth / 2;
      valueElement.style.left = `${position}px`;
      rangeElement.style.background = `linear-gradient(to right, var(--color-slider-track) 0%, var(--color-slider-track) ${percentage}%, var(--button-bg) ${percentage}%, var(--button-bg) 100%)`;
    }
  }, [percentage]);

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
          max={Math.ceil(maxRadius)}
          step="1"
          onChange={(event) => {
            updateData(+event.target.value);
          }}
          value={displayValue}
          className="range-input"
          data-testid={testId}
        />
        <div className="value-bubble" ref={valueRef}>
          {displayValue !== 0 ? `${displayValue}px` : null}
        </div>
        <div className="zero-label">0</div>
      </div>
    </label>
  );
};
