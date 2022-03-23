import { select, zoom } from "d3";
import React, { useEffect, useState } from "react";
import type { D3ZoomEvent } from "d3-zoom";
import type { ZoomTransform } from "./interfaces";
import { MIND_MAP_MAX_SCALE, MIND_MAP_MIN_SCALE } from "../constants";
import { useRecoilValue } from "recoil";
import { nodeChildrenMainAxisSpaceSelectorFamily } from "../states/selectors";
import { accumalator } from "./utils";

export function useZoomTransformState(
  ref: React.MutableRefObject<Element>,
  originCenter: "vertical" | "horizontal" | "both" | null = "vertical"
) {
  const [zoomTransform, setZoomTransform] = useState({ x: 0, y: 0, scale: 1 });
  const calcOriginCenterCoord = () => {
    const xCenter = ref.current.scrollWidth / 2;
    const yCenter = ref.current.scrollHeight / 2;
    const padding = 30;
    switch (originCenter) {
      case "horizontal":
        return {
          x: padding,
          y: yCenter,
        };
      case "vertical":
        return {
          x: xCenter,
          y: padding,
        };
      case "both":
        return {
          x: xCenter,
          y: yCenter,
        };
      default:
        return {
          x: padding,
          y: padding,
        };
    }
  };
  const zoomed = React.useMemo(() => {
    return zoom()
      .scaleExtent([MIND_MAP_MIN_SCALE, MIND_MAP_MAX_SCALE])
      .on("zoom" as const, ({ transform }: D3ZoomEvent<SVGSVGElement, []>) => {
        const initial = calcOriginCenterCoord();
        setZoomTransform({
          x: transform.x + initial.x,
          y: transform.y + initial.y,
          scale: transform.k,
        });
      });
  }, [originCenter]);

  useEffect(() => {
    const selection = select(ref.current);
    selection.call(zoomed).on("dblclick.zoom", null);
  }, [zoomed]);
  useEffect(() => {
    const newCenter = calcOriginCenterCoord();
    setZoomTransform((prev) => ({ ...prev, ...newCenter }));
    if (ref.current) {
      const selection = select(ref.current);
      zoomed.translateTo(selection, 0, 0, [0, 0]);
    }
  }, [originCenter]);

  // update scale should mutable zoomed's internal state, otherwise the two state would inconsistent
  const setTransform = React.useCallback(
    (updater: (prev: ZoomTransform) => ZoomTransform) => {
      setZoomTransform((prev) => {
        const newValue = updater(prev);
        if (ref.current) {
          const selection = select(ref.current);
          zoomed.scaleTo(selection, newValue.scale);
        }
        return newValue;
      });
    },
    [setZoomTransform]
  );

  const resetTranform = React.useCallback(() => {
    const initial = calcOriginCenterCoord();
    setZoomTransform({ ...initial, scale: 1 });
    const selection = select(ref.current);
    zoomed.scaleTo(selection, 1);
    zoomed.translateTo(selection, 0, 0, [0, 0]);
  }, [setZoomTransform]);

  return { zoomTransform, setTransform, resetTranform };
}

export function buildSVGTransformAttr(zoomTransform: ZoomTransform) {
  return `translate(${zoomTransform.x}, ${zoomTransform.y}) scale(${zoomTransform.scale})`;
}

export function useNodeBranchesYPoints(nodeId: string) {
  const childrenSpaces = useRecoilValue(
    nodeChildrenMainAxisSpaceSelectorFamily(nodeId)
  );
  const yMiddle = childrenSpaces.reduce((acc, curr) => acc + curr, 0) / 2;
  const accumalatedValues = accumalator(childrenSpaces);
  const middleValues = accumalatedValues.map((value, index) => {
    return (value + (accumalatedValues[index - 1] ?? 0)) / 2;
  });
  return middleValues.map((s) => s - yMiddle);
}
