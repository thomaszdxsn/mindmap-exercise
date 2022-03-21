import classNames from "classnames";
import { useRef } from "react";
import { useRecoilValue } from "recoil";
import { translateInvalidTextEnum } from "../OutlineEditor/utils";
import { nodesSelector } from "../states";
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

function Errors(props: Props) {
  const error = useRecoilValue(nodesSelector).error!;
  const message = translateInvalidTextEnum(error.error);
  const className = classNames(
    props.className,
    "flex justify-center items-center",
    "flex-col gap-2",
    "text-red-300"
  );
  return (
    <div className={className}>
      <div>
        <div>行数：{error.lineNum + 1}</div>
        <div>错误：{message}</div>
      </div>
    </div>
  );
}

function Wrapper(props: Props) {
  const data = useRecoilValue(nodesSelector);
  const Component = data.ok ? MindMap : Errors;

  return <Component {...props} />;
}

export default Wrapper;
