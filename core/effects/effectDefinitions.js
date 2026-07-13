"use strict";

const EFFECT_DEFINITIONS = [
  {
    id: "rain",
    label: "Rain",
    params: [{ key: "intensity", label: "Intensity", type: "range", min: 0, max: 1, step: 0.05, default: 0.5 }],
  },
  {
    id: "snow",
    label: "Snow",
    params: [{ key: "intensity", label: "Intensity", type: "range", min: 0, max: 1, step: 0.05, default: 0.5 }],
  },
  {
    id: "fog",
    label: "Fog",
    params: [{ key: "intensity", label: "Intensity", type: "range", min: 0, max: 1, step: 0.05, default: 0.4 }],
  },
  {
    id: "particles",
    label: "Particles",
    params: [{ key: "intensity", label: "Intensity", type: "range", min: 0, max: 1, step: 0.05, default: 0.5 }],
  },
  {
    id: "blur",
    label: "Blur",
    params: [{ key: "amount", label: "Amount (px)", type: "range", min: 0, max: 20, step: 1, default: 4 }],
  },
  {
    id: "vignette",
    label: "Vignette",
    params: [{ key: "strength", label: "Strength", type: "range", min: 0, max: 1, step: 0.05, default: 0.5 }],
  },
  {
    id: "colorGrading",
    label: "Color Grading",
    params: [
      { key: "brightness", label: "Brightness", type: "range", min: 0.5, max: 1.5, step: 0.05, default: 1 },
      { key: "contrast", label: "Contrast", type: "range", min: 0.5, max: 1.5, step: 0.05, default: 1 },
      { key: "saturation", label: "Saturation", type: "range", min: 0, max: 2, step: 0.05, default: 1 },
    ],
  },
  {
    id: "cameraDrift",
    label: "Camera Drift",
    params: [{ key: "amplitude", label: "Amplitude (px)", type: "range", min: 0, max: 40, step: 1, default: 12 }],
  },
];

module.exports = { EFFECT_DEFINITIONS };
