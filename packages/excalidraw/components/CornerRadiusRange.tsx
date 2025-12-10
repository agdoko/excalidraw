import React, { useEffect } from "react";

import { DEFAULT_ADAPTIVE_RADIUS } from "@excalidraw/common";

import { t } from "../i18n";

import "./CornerRadiusRange.scss";

import type { AppClassProperties } from "../types";

export type CornerRadiusRangeProps = {
  updateData: (value: number) => void;
  app: AppClassProperties;
  testId?: string;
};

const DEFAULT_MAX_RADIUS = 200;

export const CornerRadiusRange = ({
  updateData,
  app,
  testId,
}: CornerRadiusRangeProps) => {
  const rangeRef = React.useRef<HTMLInputElement>(null);
  const valueRef = React.useRef<HTMLDivElement>(null);

  const selectedElements = app.scene.getSelectedElements(app.state);
  const roundedElements = selectedElements.filter((el) => el.roundness);

  // Calculate the minimum radius value across all selected rounded elements
  let hasCommonRadius = true;
  const firstRoundedElement = roundedElements.at(0);
  const leastCommonRadius = roundedElements.reduce((acc, element) => {
    const radius = element.roundness?.value ?? DEFAULT_ADAPTIVE_RADIUS;
    if (acc != null && acc !== radius) {
      hasCommonRadius = false;
    }
    if (acc == null || acc > radius) {
      return radius;
    }
    return acc;
  }, firstRoundedElement?.roundness?.value ?? null);

  const value = Math.round(leastCommonRadius ?? DEFAULT_ADAPTIVE_RADIUS);

  // Calculate max radius based on the smallest element's dimensions
  const maxRadius =
    roundedElements.length > 0
      ? Math.round(
          Math.min(
            ...roundedElements.map((el) => Math.min(el.width, el.height) / 2),
          ),
        )
      : DEFAULT_MAX_RADIUS;

  // Ensure max is at least 1 to avoid issues with very small elements
  const safeMaxRadius = Math.max(1, maxRadius);

  useEffect(() => {
    if (rangeRef.current && valueRef.current) {
      const rangeElement = rangeRef.current;
      const valueElement = valueRef.current;
      const inputWidth = rangeElement.offsetWidth;
      const thumbWidth = 15; // 15 is the width of the thumb
      const percentage = safeMaxRadius > 0 ? value / safeMaxRadius : 0;
      const clampedPercentage = Math.min(1, Math.max(0, percentage));
      const position =
        clampedPercentage * (inputWidth - thumbWidth) + thumbWidth / 2;
      valueElement.style.left = `${position}px`;
      const percentValue = clampedPercentage * 100;
      rangeElement.style.background = `linear-gradient(to right, var(--color-slider-track) 0%, var(--color-slider-track) ${percentValue}%, var(--button-bg) ${percentValue}%, var(--button-bg) 100%)`;
    }
  }, [value, safeMaxRadius]);

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
          max={safeMaxRadius}
          step="1"
          onChange={(event) => {
            updateData(+event.target.value);
          }}
          value={Math.min(value, safeMaxRadius)}
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
