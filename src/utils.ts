export function clamp(min: number, value: number, max: number) {
  if (min > value) {
    return min;
  }
  if (max < value) {
    return max;
  }
  return value;
}

export function randRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function generateRandomHsl(fixed: {
  hue?: number;
  saturation?: number;
  lightness?: number;
  alpha?: number;
}) {
  const {
    hue = Math.trunc(randRange(0, 360)),
    saturation = Math.trunc(randRange(0, 100)),
    lightness = Math.trunc(randRange(0, 100)),
    alpha = Math.random().toFixed(2),
  } = fixed;
  return `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
}
