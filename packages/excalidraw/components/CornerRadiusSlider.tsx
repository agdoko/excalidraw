import React, { useEffect } from "react";

import { DEFAULT_ADAPTIVE_RADIUS } from "@excalidraw/common";

import { t } from "../i18n";

import "./Range.scss";

import type { AppClassProperties } from "../types";

export type CornerRadiusSliderProps = {
  updateData: (value: number) => void;
  app: AppClassProperties;
};

export const CornerRadiusSlider = ({
  updateData,
  app,
}: CornerRadiusSliderProps) => {
  const rangeRef = React.useRef<HTMLInputElement>(null);
  const valueRef = React.useRef<HTMLDivElement>(null);

  const selectedElements = app.scene.getSelectedElements(app.state);
  const adaptiveElements = selectedElements.filter(
    (el) => el.roundness?.type === 3,
  );

  const maxRadius =
    adaptiveElements.length > 0
      ? Math.min(
          200,
          ...adaptiveElements.map((el) =>
            Math.floor(Math.min(el.width, el.height) / 2),
          ),
        )
      : 0;

  let hasCommonRadius = true;
  const firstElement = adaptiveElements.at(0);
  const leastCommonRadius = adaptiveElements.reduce((acc, element) => {
    const radius = element.roundness?.value ?? DEFAULT_ADAPTIVE_RADIUS;
    if (acc != null && acc !== radius) {
      hasCommonRadius = false;
    }
    if (acc == null || acc > radius) {
      return radius;
    }
    return acc;
  }, firstElement?.roundness?.value ?? DEFAULT_ADAPTIVE_RADIUS);

  const value =
    adaptiveElements.length > 0 ? Math.min(leastCommonRadius, maxRadius) : 0;
  const percentage = maxRadius > 0 ? (value / maxRadius) * 100 : 0;

  useEffect(() => {
    if (rangeRef.current && valueRef.current && maxRadius > 0) {
      const rangeElement = rangeRef.current;
      const valueElement = valueRef.current;
      const inputWidth = rangeElement.offsetWidth;
      const thumbWidth = 15;
      const position =
        (value / maxRadius) * (inputWidth - thumbWidth) + thumbWidth / 2;
      valueElement.style.left = `${position}px`;
      rangeElement.style.background = `linear-gradient(to right, var(--color-slider-track) 0%, var(--color-slider-track) ${percentage}%, var(--button-bg) ${percentage}%, var(--button-bg) 100%)`;
    }
  }, [value, maxRadius, percentage]);

  if (adaptiveElements.length === 0 || maxRadius < 1) {
    return null;
  }

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
          min="1"
          max={maxRadius}
          step="4"
          onChange={(event) => {
            updateData(+event.target.value);
          }}
          value={value}
          className="range-input"
          data-testid="corner-radius-slider"
        />
        <div className="value-bubble" ref={valueRef}>
          {value !== 0 ? value : null}
        </div>
        <div className="zero-label">1</div>
      </div>
    </label>
  );
};
