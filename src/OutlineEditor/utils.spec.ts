import { it, expect } from "vitest";
import { parseTextLine, parseTextIntoNodes } from "./utils";

it.each([
  { input: "    - 123", output: { spaces: "    ", text: "123" } },
  { input: "    * 123", output: undefined },
])("parseTextInput($input)=$output", ({ input, output }) =>
  expect(parseTextLine(input)).toEqual(output)
);

it("test parseTextIntoNodes error when invalid text format", () => {
  const content = `
* 1
	* 2
`.trim();
  expect(() => parseTextIntoNodes(content)).toThrow();
});

it("test parseTextIntoNodes error when invalid indent", () => {
  const content = `
- 1
        - 2
    - 3
`.trim();
  expect(() => parseTextIntoNodes(content)).toThrow();
});

it("test parseTextIntoNodes successfully", () => {
  const content = `
- a
    - b
        - c
`.trim();
  const result = parseTextIntoNodes(content);
  expect(result).toEqual(
    new Map([
      ["0", { id: "0", content: "a", parentId: null, childIds: ["1"] }],

      ["1", { id: "1", content: "b", parentId: "0", childIds: ["2"] }],

      ["2", { id: "2", content: "c", parentId: "1", childIds: [] }],
    ])
  );
});
