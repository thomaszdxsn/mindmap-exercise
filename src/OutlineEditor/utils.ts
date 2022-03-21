import { Node } from "../interfaces";

export function parseTextLine(
  line: string,
  pattern = /^(?<spaces> *?)-\s*?(?<text>.*)$/
) {
  return pattern.exec(line)?.groups as
    | {
        spaces: string;
        text: string;
      }
    | undefined;
}

export enum InvalidText {
  InvalidIndent,
  InvalidLine,
}

export function parseTextIntoNodes(
  text: string,
  indentSize = 4
): Map<string, Node> {
  const map: Map<number, { level: number; node: Node }> = new Map();
  const findParent = (lineNum: number, level: number): null | Node => {
    const prevLine = lineNum - 1;
    const prevItem = map.get(prevLine);
    if (!prevItem) {
      return null;
    }
    return prevItem.level === level - 1
      ? prevItem.node
      : findParent(prevLine, level);
  };

  text.split("\n").forEach((line, lineNum) => {
    const parseResult = parseTextLine(line);
    if (!parseResult) {
      throw { lineNum, error: InvalidText.InvalidLine, line };
    }
    const spaceCount = parseResult.spaces.length;
    if (spaceCount % indentSize !== 0) {
      throw { lineNum, error: InvalidText.InvalidIndent, line };
    }
    const level = spaceCount / indentSize;
    const parent = findParent(lineNum, level);
    if (parent === null && level !== 0) {
      throw { lineNum, error: InvalidText.InvalidIndent, line };
    }
    const id = lineNum.toString();
    parent?.childIds.push(id);
    map.set(lineNum, {
      level,
      node: {
        id,
        parentId: parent?.id ?? null,
        content: parseResult.text,
        childIds: [],
      },
    });
  });
  return new Map(Array.from(map.values()).map((x) => [x.node.id, x.node]));
}

export function tryParseTextIntoNodes(
  ...args: Parameters<typeof parseTextIntoNodes>
) {
  try {
    return {
      ok: true,
      data: parseTextIntoNodes(...args),
    };
  } catch (error) {
    return {
      ok: false,
      error,
    };
  }
}
