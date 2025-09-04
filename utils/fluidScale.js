// utils/fluidScale.js

// Define the viewport width range for scaling.
// You can adjust these values to target different screen sizes.
const VW_MIN = 1366; // ~14" laptop widths
const VW_MAX = 1920; // ~24" desktop widths

/**
 * Calculates a fluid pixel value that scales between a min and max.
 * @param {number} minPx - The minimum pixel value (at VW_MIN).
 * @param {number} maxPx - The maximum pixel value (at VW_MAX).
 * @returns {string} - A CSS clamp() function.
 */
export function fluidPx(minPx, maxPx) {
  const m = ((maxPx - minPx) / (VW_MAX - VW_MIN)) * 100;
  const b = minPx - (m * VW_MIN) / 100;
  return `clamp(${minPx}px, calc(${b}px + ${m}vw), ${maxPx}px)`;
}

/**
 * Calculates a fluid rem value that scales between a min and max.
 * @param {number} minRem - The minimum rem value.
 * @param {number} maxRem - The maximum rem value.
 * @returns {string} - A CSS clamp() function.
 */
export function fluidRem(minRem, maxRem) {
  const minPx = minRem * 16;
  const maxPx = maxRem * 16;
  const m = ((maxPx - minPx) / (VW_MAX - VW_MIN)) * 100;
  const b = minPx - (m * VW_MIN) / 100;
  return `clamp(${minRem}rem, calc(${(b / 16).toFixed(
    4
  )}rem + ${m}vw), ${maxRem}rem)`;
}

/**
 * Calculates a fluid em value that scales between a min and max.
 * @param {number} minEm - The minimum em value.
 * @param {number} maxEm - The maximum em value.
 * @returns {string} - A CSS clamp() function.
 */
export function fluidEm(minEm, maxEm) {
  const minPx = minEm * 16;
  const maxPx = maxEm * 16;
  const m = ((maxPx - minPx) / (VW_MAX - VW_MIN)) * 100;
  const b = minPx - (m * VW_MIN) / 100;
  return `clamp(${minEm}em, calc(${(b / 16).toFixed(
    4
  )}em + ${m}vw), ${maxEm}em)`;
}
