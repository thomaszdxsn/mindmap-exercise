import classNames from "classnames";
import { useRecoilState } from "recoil";
import { MIND_MAP_DARK_THEME, MIND_MAP_LIGHT_THEME } from "./constants";
import {
  mindmapThemeAtom,
  mindMapXGapAtom,
  mindMapYGapAtom,
} from "./states/atoms";
import { clamp } from "./utils";

interface Props {
  className?: string;
}

interface CardProps {
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

function Card({ className, onClick, children, style }: CardProps) {
  const cls = classNames(
    className,
    "border shadow hover:opacity-50 cursor-pointer rounded-xl",
    "flex-1 grid place-content-center"
  );
  return (
    <div className={cls} onClick={onClick} style={style}>
      {children}
    </div>
  );
}

function Preference({ className }: Props) {
  const [theme, setTheme] = useRecoilState(mindmapThemeAtom);
  const [xGap, setXGap] = useRecoilState(mindMapXGapAtom);
  const [yGap, setYGap] = useRecoilState(mindMapYGapAtom);
  const isDark = theme.background === MIND_MAP_DARK_THEME.background;
  const cls = classNames(className, "grid grid-cols-1");
  return (
    <div className={cls}>
      <section>
        <div className="flex items-center">
          <label>xGap: </label>
          <input
            type="range"
            value={xGap}
            onChange={(e) => setXGap(clamp(10, Number(e.target.value), 100))}
          />
        </div>
        <div className="flex items-center">
          <label>yGap: </label>
          <input
            type="range"
            value={yGap}
            onChange={(e) => setYGap(clamp(0, Number(e.target.value), 100))}
          />
        </div>
      </section>
      <section>
        <h3>Theme</h3>
        <div className="flex gap-2 h-20">
          <Card
            style={MIND_MAP_DARK_THEME}
            className={classNames({
              "shadow-inner": isDark,
              "!text-blue-600": isDark,
            })}
            onClick={() => setTheme(MIND_MAP_DARK_THEME)}
          >
            Dark
          </Card>
          <Card
            style={MIND_MAP_LIGHT_THEME}
            className={classNames({
              "shadow-inner": !isDark,
              "!text-blue-600": !isDark,
            })}
            onClick={() => setTheme(MIND_MAP_LIGHT_THEME)}
          >
            Light
          </Card>
        </div>
      </section>
      <section>
        <h3>Layout</h3>
        <div className="flex gap-2 h-20">
          <Card>Horizontal</Card>
          <Card>Vertical</Card>
        </div>
      </section>
    </div>
  );
}

export default Preference;
