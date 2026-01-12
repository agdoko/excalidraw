import React, { useEffect } from "react";

import type { NonDeletedExcalidrawElement } from "@excalidraw/element/types";

import { t } from "../i18n";

import "./Range.scss";

import type { AppClassProperties, AppState } from "../types";

export type RangeProps = {
  updateData: (value: number) => void;
  app: AppClassProperties;
  testId?: string;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  getValue?: (
    elements: NonDeletedExcalidrawElement[],
    appState: AppState,
  ) => number;
};

const DEFAULT_MIN = 0;
const DEFAULT_MAX = 100;
const DEFAULT_STEP = 10;
const DEFAULT_LABEL = "labels.opacity";

const getOpacityValue = (
  elements: NonDeletedExcalidrawElement[],
  appState: AppState,
): number => {
  const firstElement = elements.at(0);
  const leastCommonOpacity = elements.reduce((acc, element) => {
    if (acc == null || acc > element.opacity) {
      return element.opacity;
    }
    return acc;
  }, firstElement?.opacity ?? null);

  return leastCommonOpacity ?? appState.currentItemOpacity;
};

export const Range = ({
  updateData,
  app,
  testId,
  min = DEFAULT_MIN,
  max = DEFAULT_MAX,
  step = DEFAULT_STEP,
  label = DEFAULT_LABEL,
  getValue,
}: RangeProps) => {
  const rangeRef = React.useRef<HTMLInputElement>(null);
  const valueRef = React.useRef<HTMLDivElement>(null);
  const selectedElements = app.scene.getSelectedElements(app.state);

  const value = getValue
    ? getValue(selectedElements, app.state)
    : getOpacityValue(selectedElements, app.state);

  const hasCommonValue =
    selectedElements.length === 0 ||
    (getValue
      ? true
      : selectedElements.every(
          (el) => el.opacity === selectedElements[0].opacity,
        ));

  useEffect(() => {
    if (rangeRef.current && valueRef.current) {
      const rangeElement = rangeRef.current;
      const valueElement = valueRef.current;
      const inputWidth = rangeElement.offsetWidth;
      const thumbWidth = 15; // 15 is the width of the thumb
      const position =
        ((value - min) / (max - min)) * (inputWidth - thumbWidth) +
        thumbWidth / 2;
      valueElement.style.left = `${position}px`;
      const percentage = ((value - min) / (max - min)) * 100;
      rangeElement.style.background = `linear-gradient(to right, var(--color-slider-track) 0%, var(--color-slider-track) ${percentage}%, var(--button-bg) ${percentage}%, var(--button-bg) 100%)`;
    }
  }, [value, min, max]);

  return (
    <label className="control-label">
      {t(label as any)}
      <div className="range-wrapper">
        <input
          style={{
            ["--color-slider-track" as string]: hasCommonValue
              ? undefined
              : "var(--button-bg)",
          }}
          ref={rangeRef}
          type="range"
          min={min}
          max={max}
          step={step}
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
