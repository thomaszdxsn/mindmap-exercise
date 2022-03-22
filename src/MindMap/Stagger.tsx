import classNames from "classnames";
import { MIND_MAP_MAX_SCALE, MIND_MAP_MIN_SCALE } from "../constants";
import { clamp } from "../utils";

interface Props {
  scale: number;
  setScale(scale: number): void;
  onDownload(): void;
  className?: string;
}

function Scaler({ scale, setScale }: Pick<Props, "scale" | "setScale">) {
  const btnClass = classNames(
    "hover:opacity-50 bg-gray-400 text-white btn w-8 h-8",
    "text-lg items-center flex justify-center"
  );
  const wrapperClass = classNames(
    "flex gap-1 items-baseline rounded-full bg-gray-100 px-4 py-2 shadow"
  );

  const setNewScaleValue = (value: number) =>
    setScale(clamp(MIND_MAP_MIN_SCALE, value, MIND_MAP_MAX_SCALE));
  const onScaleAdd = () => setNewScaleValue(scale + 0.1);
  const onScaleMinus = () => setNewScaleValue(scale - 0.1);

  const scaleDisplay = `${Math.trunc(scale * 100)}%`;
  return (
    <div className={wrapperClass}>
      <button type="button" className={btnClass} onClick={onScaleMinus}>
        <span>–</span>
      </button>
      <button type="button" className={btnClass} onClick={onScaleAdd}>
        <span>+</span>
      </button>
      <div>{scaleDisplay}</div>
    </div>
  );
}

function Downloader({ onDownload: onClick }: Pick<Props, "onDownload">) {
  return (
    <button
      className="text-lg px-3 bg-white shadow rounded-full hover:opacity-50"
      onClick={onClick}
    >
      ⏬
    </button>
  );
}

function Stagger(props: Props) {
  const { scale, setScale, className, onDownload } = props;
  return (
    <div className={className}>
      <Downloader onDownload={onDownload} />
      <Scaler scale={scale} setScale={setScale} />
    </div>
  );
}

export default Stagger;
