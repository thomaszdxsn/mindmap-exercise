import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  mindmapBranchWidth,
  mindmapThemeAtom,
  mindMapXGapAtom,
  nodeExpandAtomFamily,
} from "../states/atoms";
import { rootSelector, nodeSelectorFamily } from "../states/selectors";
import { generateRandomHsl } from "../utils";
import { measureTextSize } from "./utils";
import { useNodeBranchesYPoints } from "./hooks";
import Layout from "./layout";

function Branch(props: {
  color: string;
  id: string;
  transform: string;
  y: number;
}) {
  const { color, id, transform, y } = props;
  const node = useRecoilValue(nodeSelectorFamily(id))!;
  const childrenYPoints = useNodeBranchesYPoints(id);
  const xGap = useRecoilValue(mindMapXGapAtom);
  const branchWidth = useRecoilValue(mindmapBranchWidth);
  const textDimension = measureTextSize(node.content);
  const [expanded, setExpanded] = useRecoilState(nodeExpandAtomFamily(id));
  const layout = React.useMemo(
    () => new Layout(y, textDimension, xGap),
    [xGap, y, textDimension]
  );

  const subBrancies = expanded
    ? node.childIds.map((childId, index) => (
        <Branch
          color={color}
          id={childId}
          y={childrenYPoints[index]}
          key={childId}
          transform={`translate(${layout.axisDatum.target[0]}, ${layout.axisDatum.target[1]})`}
        />
      ))
    : null;

  return (
    <g
      transform={transform}
      strokeWidth={branchWidth}
      stroke={color}
      fill="transparent"
      pointerEvents="stroke"
    >
      <path d={layout.makeLinkPath()?.toString()} />
      <path d={layout.makeAxisPath()?.toString()} />
      <text {...layout.makeTextProps()}>{node.content}</text>
      {subBrancies}
      <foreignObject
        {...layout.makeExpandBtnProps()}
        height={16}
        width={16}
        style={{
          display: node.childIds.length > 0 ? undefined : "none",
        }}
      >
        <button
          className="w-[16px] h-[16px] border flex items-center bg-white text-black justify-center"
          onClick={() => setExpanded((prev) => !prev)}
        >
          {expanded ? "-" : node.childIds.length}
        </button>
      </foreignObject>
    </g>
  );
}

function RootNode(props: { padding?: number }) {
  const { padding = 30 } = props;
  const root = useRecoilValue(rootSelector);
  if (!root) {
    throw new Error("root node don't exists");
  }
  const childrenYPoints = useNodeBranchesYPoints(root.id);

  const textSize = measureTextSize(root.content);
  const rectWidth = textSize.width + padding;
  const rectHeight = textSize.height + padding;
  const rectX = -padding / 2;
  const rectY = -padding / 2 - padding / 2;
  const rectProps = {
    x: rectX,
    y: rectY,
    width: rectWidth,
    height: rectHeight,
  };

  const branches = React.useMemo(() => {
    const xPoint = rectX + rectWidth;
    return root.childIds.map((childId, index) => (
      <Branch
        id={childId}
        key={childId}
        y={childrenYPoints[index]}
        transform={`translate(${xPoint * 0.6}, 0)`}
        color={generateRandomHsl({
          hue: (index * 50) % 360,
          saturation: 85,
          lightness: 70,
          alpha: 1,
        })}
      />
    ));
  }, [childrenYPoints, rectX, rectWidth]);

  return (
    <g>
      {branches}
      <rect {...rectProps}></rect>
      <text>{root.content}</text>
    </g>
  );
}

function Canvas() {
  const { background } = useRecoilValue(mindmapThemeAtom);
  return (
    <g transform="translate(0, 0)" fill={background}>
      <RootNode />
    </g>
  );
}

export default React.memo(Canvas);
