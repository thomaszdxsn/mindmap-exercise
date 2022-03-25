import { selector, selectorFamily } from "recoil";
import { MIND_MAP_BRANCH_DEFAULT_MAIN_SPACE } from "../constants";
import { measureTextSize } from "../MindMap/utils";
import { tryParseTextIntoNodes } from "../OutlineEditor/utils";
import {
  mindmapLayouAtom,
  mindMapXGapAtom,
  mindMapYGapAtom,
  nodeExpandAtomFamily,
  nodesRawContentAtom,
} from "./atoms";

export const nodesSelector = selector({
  key: "nodes:all",
  get: ({ get }) => tryParseTextIntoNodes(get(nodesRawContentAtom)),
});

export const rootSelector = selector({
  key: "nodes:root",
  get: ({ get }) => {
    const nodes = get(nodesSelector);
    if (nodes.data) {
      const roots = Array.from(nodes.data.values()).filter(
        (node) => node.parentId === null
      );
      // just ignore multiple roots
      return roots.length > 0 ? roots[0] : undefined;
    }
    return;
  },
});

export const nodeSelectorFamily = selectorFamily({
  key: "node:node",
  get:
    (id: string) =>
    ({ get }) =>
      get(nodesSelector).data?.get(id),
});

export const nodeMainAxisSpaceSelectorFamily = selectorFamily({
  key: "node:main-space",
  get:
    (id: string) =>
    ({ get }) => {
      const node = get(nodeSelectorFamily(id));
      if (!node) {
        return 0;
      }
      const layout = get(mindmapLayouAtom);
      const childIds = node.childIds;

      switch (layout) {
        case "horizontal":
          const expanded = get(nodeExpandAtomFamily(id));
          if (childIds.length === 0 || !expanded) {
            return MIND_MAP_BRANCH_DEFAULT_MAIN_SPACE;
          }

          const yGap = get(mindMapYGapAtom);
          const space = childIds
            .map(
              (childId) =>
                get(nodeMainAxisSpaceSelectorFamily(childId)) as number
            )
            .reduce(
              (acc, curr) => acc + curr,
              yGap * node.childIds.length
            ) as number;
          return space;
        case "vertical":
          const xGap = get(mindMapXGapAtom);
          const { width: selfTextWidth } = measureTextSize(node.content);
          const childrenSumWidth = childIds
            .map(
              (childId) =>
                get(nodeMainAxisSpaceSelectorFamily(childId)) as number
            )
            .reduce(
              (acc, curr) => acc + curr,
              xGap * childIds.length
            ) as number;
          return Math.max(selfTextWidth + xGap, childrenSumWidth);
        default:
          throw new Error("unsupport layout: " + layout);
      }
    },
});

export const nodeChildrenMainAxisSpaceSelectorFamily = selectorFamily({
  key: "node:children:main-space",
  get:
    (id: string) =>
    ({ get }) =>
      get(nodeSelectorFamily(id))?.childIds.map((childId) =>
        get(nodeMainAxisSpaceSelectorFamily(childId))
      ) ?? [],
});
