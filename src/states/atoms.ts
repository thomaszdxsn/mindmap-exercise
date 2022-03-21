import { atom } from "recoil";
import { parseTextIntoNodes } from "../OutlineEditor/utils";

export const nodesRawContentAtom = atom({
  key: "atoms/raw-content",
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
    - packager
        - Webpack
        - Snowpack
`.trim(),
});

export const nodesAtom = atom({
  key: "atoms",
  default: parseTextIntoNodes(
    `
- Front end tech
    - Compiler/language
        - Elm
        - Svelte
        - ClojureScript
    - Reactive framework
        - React
        - Vue
        - Angular
    - packager
        - Webpack
        - Snowpack
`.trim(),
    4
  ),
});
