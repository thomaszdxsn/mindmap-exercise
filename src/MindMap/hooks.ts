import { select, zoom } from "d3";
import React, { useEffect, useState } from "react";
import type { D3ZoomEvent } from "d3-zoom";
import type { ZoomTransform } from "./interfaces";
import { MIND_MAP_MAX_SCALE, MIND_MAP_MIN_SCALE } from "../constants";

export function useZoomTransformState(ref: React.MutableRefObject<Element>) {
  const [zoomTransform, setZoomTransform] = useState({ x: 0, y: 0, scale: 1 });

  useEffect(() => {
    const zoomed = zoom()
      .scaleExtent([MIND_MAP_MIN_SCALE, MIND_MAP_MAX_SCALE])
      .on("zoom" as const, (e: D3ZoomEvent<SVGSVGElement, []>) => {
        setZoomTransform({
          ...e.transform,
          scale: e.transform.k,
        });
      });
    const selection = select(ref.current);
    selection.call(zoomed);
  }, []);

  return [zoomTransform, setZoomTransform] as const;
}

export function buildSVGTransformAttr(zoomTransform: ZoomTransform) {
  return `translate(${zoomTransform.x}, ${zoomTransform.y}) scale(${zoomTransform.scale})`;
}
