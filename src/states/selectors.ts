import { selector } from "recoil";
import { tryParseTextIntoNodes } from "../OutlineEditor/utils";
import { nodesRawContentAtom } from "./atoms";

export const nodesSelector = selector({
  key: "nodes:all",
  get: ({ get }) => tryParseTextIntoNodes(get(nodesRawContentAtom)),
});
