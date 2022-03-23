import { atom, atomFamily } from "recoil";
import { MIND_MAP_DARK_THEME } from "../constants";
import { MindmapLayout } from "../interfaces";

export const nodesRawContentAtom = atom({
  key: "atoms:raw-content",
  default: `
- Front end tech
    - Compiler/language
        - Elm
        - Svelte
        - ClojureScript
    - Reactive framework
        - React
        - Vue
        - Angular
    - Packager
        - Webpack
        - Snowpack
        - Rollup
`.trim(),
});

export const nodeExpandAtomFamily = atomFamily({
  key: "atoms:expanded",
  default: true,
});

export const mindMapXGapAtom = atom({
  key: "mind-map:x-gap",
  default: 80,
});

export const mindMapYGapAtom = atom({
  key: "mind-map:y-gap",
  default: 20,
});

export const mindmapBranchWidth = atom({
  key: "mind-map:branch",
  default: 4,
});

export const mindmapThemeAtom = atom({
  key: "mind-map:theme",
  default: MIND_MAP_DARK_THEME,
});

export const mindmapLayouAtom = atom({
  key: "mind-map:layout",
  default: "horizontal" as MindmapLayout,
});
