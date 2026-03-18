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
  const selectedRoundedRects = selectedElements.filter(
    (el) => el.roundness !== null && isUsingAdaptiveRadius(el.type),
  );

  const isEmpty = selectedRoundedRects.length === 0;

  const maxRadius = isEmpty
    ? 0
    : Math.max(
        1,
        Math.floor(
          Math.min(
            ...selectedRoundedRects.map(
              (el) => Math.min(el.width, el.height) / 2,
            ),
          ),
        ),
      );

  let hasCommonValue = true;
  const firstElement = selectedRoundedRects.at(0);
  const leastCommonValue = selectedRoundedRects.reduce(
    (acc, element) => {
      const elValue = element.roundness?.value ?? DEFAULT_ADAPTIVE_RADIUS;
      if (acc != null && acc !== elValue) {
        hasCommonValue = false;
      }
      if (acc == null || acc > elValue) {
        return elValue;
      }
      return acc;
    },
    firstElement
      ? firstElement.roundness?.value ?? DEFAULT_ADAPTIVE_RADIUS
      : null,
  );

  const value = leastCommonValue ?? app.state.currentItemCornerRadius;

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

  if (isEmpty) {
    return null;
  }

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
          min="0"
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
          {value !== 0 ? value : null}
        </div>
        <div className="zero-label">0</div>
      </div>
    </label>
  );
};
