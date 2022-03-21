import { useRef } from "react";
import { useZoomTransformState, buildSVGTransformAttr } from "./hooks";

interface Props {
  className?: string;
}

function MindMap({ className }: Props) {
  const ref = useRef<SVGSVGElement>(null!);
  const [zoomTransform] = useZoomTransformState(ref);
  const transform = buildSVGTransformAttr(zoomTransform);

  return (
    <svg className={className} ref={ref}>
      <g transform={transform}>
        <rect width={20} height={20} x={10} y={10} />
      </g>
    </svg>
  );
}

export default MindMap;
