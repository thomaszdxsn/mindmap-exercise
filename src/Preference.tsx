import classNames from "classnames";
import { useRecoilState, useRecoilValue } from "recoil";
import { MIND_MAP_DARK_THEME, MIND_MAP_LIGHT_THEME } from "./constants";
import { mindmapThemeAtom } from "./states/atoms";

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
  const isDark = theme.background === MIND_MAP_DARK_THEME.background;
  return (
    <div className={className}>
      <section>
        <h3>Theme</h3>
        <div className="flex gap-2 h-40">
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
        <div className="flex gap-2 h-40">
          <Card>Ltr</Card>
          <Card>Org</Card>
        </div>
      </section>
    </div>
  );
}

export default Preference;
