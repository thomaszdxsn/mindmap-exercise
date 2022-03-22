import { select } from "d3";

export function measureTextSize(text: string) {
  const container = select("body").append("svg");
  container.append("text").text(text);
  const rect = container.node()!.getBBox();
  container.remove();
  return rect;
}

export function accumalator(numbers: number[]) {
  const newArray: number[] = [];
  numbers.forEach((number) => {
    newArray.push(number + (newArray[newArray.length - 1] ?? 0));
  });
  return newArray;
}
