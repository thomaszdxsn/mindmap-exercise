import { it, expect } from "vitest";
import { clamp, randRange } from "../src/utils";

it.each([
  { min: 0, value: -1, max: 10, result: 0 },
  { min: 0, value: 5, max: 10, result: 5 },
  { min: 0, value: 15, max: 10, result: 10 },
])("clamp($min, $value, $max)=$result", ({ min, max, value, result }) =>
  expect(clamp(min, value, max)).toBe(result)
);

it.each([
  { min: 0, max: 10 },
  { min: 50, max: 60 },
])("randRange($min, $max)", ({ max, min }) => {
  const value = randRange(min, max);
  expect(value).toBeGreaterThanOrEqual(min);
  expect(value).toBeLessThanOrEqual(max);
});
