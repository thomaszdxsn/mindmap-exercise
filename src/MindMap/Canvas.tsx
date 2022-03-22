import React from "react";
import { line, linkHorizontal } from "d3";
import { useRecoilValue } from "recoil";
import {
  mindmapBgColorAtom,
  mindmapBranchWidth,
  mindMapXGapAtom,
} from "../states/atoms";
import {
  rootSelector,
  nodeChildrenMainAxisSpaceSelectorFamily,
  nodeSelectorFamily,
} from "../states/selectors";
import { generateRandomHsl } from "../utils";
import { accumalator, measureTextSize } from "./utils";
import { useNodeBranchesYPoints } from "./hooks";

type Point = [number, number];
const curveFactory = linkHorizontal();

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
  const curveDatum = {
    source: [0, 0] as Point,
    target: [xGap, y] as Point,
  };
  const { width: contentWidth } = measureTextSize(node.content);
  const lineDatum = {
    source: curveDatum.target,
    target: [
      curveDatum.target[0] + contentWidth,
      curveDatum.target[1],
    ] as Point,
  };

  const textPadding = 8;
  const textX = lineDatum.source[0];
  const textY = lineDatum.target[1] - textPadding;

  const subBrancies = node.childIds.map((childId, index) => (
    <Branch
      color={color}
      id={childId}
      y={childrenYPoints[index]}
      key={childId}
      transform={`translate(${lineDatum.target[0]}, ${lineDatum.target[1]})`}
    />
  ));

  return (
    <g
      transform={transform}
      strokeWidth={branchWidth}
      stroke={color}
      fill="transparent"
    >
      <path d={curveFactory(curveDatum)?.toString()} />
      <path d={curveFactory(lineDatum)?.toString()} />
      <text x={textX} y={textY}>
        {node.content}
      </text>
      {subBrancies}
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
          hue: index * 20,
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
  const fill = useRecoilValue(mindmapBgColorAtom);
  return (
    <g transform="translate(0, 0)" fill={fill}>
      <RootNode />
    </g>
  );
}

export default React.memo(Canvas);
