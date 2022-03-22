import { select, zoom } from "d3";
import React, { useEffect, useState } from "react";
import type { D3ZoomEvent } from "d3-zoom";
import type { ZoomTransform } from "./interfaces";
import { MIND_MAP_MAX_SCALE, MIND_MAP_MIN_SCALE } from "../constants";
import { useRecoilValue } from "recoil";
import {
  nodeChildrenMainAxisSpaceSelectorFamily,
  nodeMainAxisSpaceSelectorFamily,
} from "../states/selectors";
import { accumalator } from "./utils";

export function useZoomTransformState(
  ref: React.MutableRefObject<Element>,
  initialOriginCenter: "vertical" | "horizontal" | "both" | null = "vertical"
) {
  const [zoomTransform, setZoomTransform] = useState({ x: 0, y: 0, scale: 1 });
  const calcOriginCenterCoord = () => {
    const xCenter = ref.current.scrollWidth / 2;
    const yCenter = ref.current.scrollHeight / 2;
    const padding = 30;
    switch (initialOriginCenter) {
      case "vertical":
        return {
          x: padding,
          y: yCenter,
        };
      case "horizontal":
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
  }, []);

  useEffect(() => {
    const selection = select(ref.current);
    selection.call(zoomed).on("dblclick.zoom", null);
  }, []);
  useEffect(() => {
    setZoomTransform((prev) => ({ ...prev, ...calcOriginCenterCoord() }));
  }, []);

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

  return [zoomTransform, setTransform] as const;
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
