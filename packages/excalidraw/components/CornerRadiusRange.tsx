import React, { useEffect } from "react";

import { t } from "../i18n";

import "./Range.scss";

import type { AppClassProperties } from "../types";
import { DEFAULT_ADAPTIVE_RADIUS } from "@excalidraw/common";

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
  let hasCommonCornerRadius = true;
  const firstElement = selectedElements.at(0);
  const leastCommonCornerRadius = selectedElements.reduce((acc, element) => {
    const elementRadius = element.roundness?.value ?? DEFAULT_ADAPTIVE_RADIUS;
    if (acc != null && acc !== elementRadius) {
      hasCommonCornerRadius = false;
    }
    if (acc == null || acc > elementRadius) {
      return elementRadius;
    }
    return acc;
  }, firstElement?.roundness?.value ?? null);

  const value =
    leastCommonCornerRadius ?? app.state.currentItemCornerRadius;

  useEffect(() => {
    if (rangeRef.current && valueRef.current) {
      const rangeElement = rangeRef.current;
      const valueElement = valueRef.current;
      const inputWidth = rangeElement.offsetWidth;
      const thumbWidth = 15; // 15 is the width of the thumb
      const position =
        (value / 100) * (inputWidth - thumbWidth) + thumbWidth / 2;
      valueElement.style.left = `${position}px`;
      rangeElement.style.background = `linear-gradient(to right, var(--color-slider-track) 0%, var(--color-slider-track) ${value}%, var(--button-bg) ${value}%, var(--button-bg) 100%)`;
    }
  }, [value]);

  return (
    <label className="control-label">
      {t("labels.cornerRadius")}
      <div className="range-wrapper">
        <input
          style={{
            ["--color-slider-track" as string]: hasCommonCornerRadius
              ? undefined
              : "var(--button-bg)",
          }}
          ref={rangeRef}
          type="range"
          min="0"
          max="100"
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
