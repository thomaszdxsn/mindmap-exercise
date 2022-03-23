import classNames from "classnames";
import { useCallback, useRef } from "react";
import { useRecoilValue } from "recoil";
import html2canvas from "html2canvas";
import { translateInvalidTextEnum } from "../OutlineEditor/utils";
import { nodesSelector } from "../states";
import { useZoomTransformState, buildSVGTransformAttr } from "./hooks";
import Canvas from "./Canvas";
import Stagger from "./Stagger";
import { mindmapLayouAtom, mindmapThemeAtom } from "../states/atoms";

interface Props {
  className?: string;
}

function MindMap(props: Props) {
  const ref = useRef<SVGSVGElement>(null!);
  const layout = useRecoilValue(mindmapLayouAtom);
  const containerRef = useRef<HTMLDivElement>(null!);
  const { background, color: textColor } = useRecoilValue(mindmapThemeAtom);
  const { zoomTransform, setTransform, resetTranform } = useZoomTransformState(
    ref,
    layout
  );
  const transform = buildSVGTransformAttr(zoomTransform);
  const className = classNames(props.className, "relative");
  const setScale = useCallback(
    (scale: number) => {
      setTransform((prev) => ({ ...prev, scale }));
    },
    [setTransform]
  );
  const onDownload = useCallback(async () => {
    const canvas = await html2canvas(containerRef.current as any);
    const dataUrl = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.download = "mindmap.png";
    a.href = dataUrl;
    a.click();
    a.remove();
  }, []);

  return (
    <div
      className={className}
      style={{ background, color: textColor }}
      ref={containerRef}
    >
      <svg className="w-full h-full p-2 stroke-current" ref={ref}>
        <g transform={transform}>
          <Canvas />
        </g>
      </svg>

      <Stagger
        onFocus={resetTranform}
        onDownload={onDownload}
        scale={zoomTransform.scale}
        setScale={setScale}
        className="absolute right-[10px] bottom-[10px] flex gap-2"
      />
    </div>
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
