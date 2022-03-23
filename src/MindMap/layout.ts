import { DefaultLinkObject, Link, linkHorizontal, linkVertical } from "d3";
import { MindmapLayout } from "../interfaces";

type Point = [number, number];
type LinkDatum = { source: Point; target: Point };
type TextDimension = { width: number; height: number };
const TEXT_PADDING = 6;

interface LayoutStrategy {
  linkFactory: Link<any, DefaultLinkObject, Point>;
  get linkDatum(): LinkDatum;
  get axisDatum(): LinkDatum;
  get textPoint(): Point;
}

class HorizontalLayoutStrategy implements LayoutStrategy {
  private origin: number;
  private textDimension: TextDimension;
  private gap: number;
  public linkFactory;

  constructor(origin: number, textDimension: TextDimension, gap: number) {
    this.origin = origin;
    this.linkFactory = linkHorizontal();
    this.textDimension = textDimension;
    this.gap = gap;
  }

  get linkDatum(): LinkDatum {
    return { source: [0, 0], target: [this.gap, this.origin] };
  }
  get axisDatum(): LinkDatum {
    const linkTarget = this.linkDatum.target;
    return {
      source: linkTarget,
      target: [linkTarget[0] + this.textDimension.width, linkTarget[1]],
    };
  }
  get textPoint(): Point {
    const axisSource = this.axisDatum.source;
    return [axisSource[0], axisSource[1] - TEXT_PADDING];
  }
}

class VerticalLayoutStrategy implements LayoutStrategy {
  private origin: number;
  private textDimension: TextDimension;
  private gap: number;
  public linkFactory;

  constructor(origin: number, textDimension: TextDimension, gap: number) {
    this.origin = origin;
    this.gap = gap;
    this.linkFactory = linkVertical();
    this.textDimension = textDimension;
  }

  get linkDatum(): LinkDatum {
    return { source: [0, 1], target: [0, 1] };
  }
  get axisDatum(): LinkDatum {
    return { source: [0, 1], target: [0, 1] };
  }
  get textPoint(): Point {
    return [0, 0];
  }
}

class Layout {
  private layoutStrategy: LayoutStrategy;
  private textDimension: TextDimension;

  constructor(
    origin: number,
    textDimension: TextDimension,
    gap: number,
    layout: MindmapLayout = "horizontal"
  ) {
    this.textDimension = textDimension;
    switch (layout) {
      case "horizontal":
        this.layoutStrategy = new HorizontalLayoutStrategy(
          origin,
          textDimension,
          gap
        );
        break;
      case "vertical":
        this.layoutStrategy = new VerticalLayoutStrategy(
          origin,
          textDimension,
          gap
        );
        break;
      default:
        throw new Error("Unsupport layout: " + layout);
    }
  }

  get linkDatum() {
    return this.layoutStrategy.linkDatum;
  }

  get axisDatum() {
    return this.layoutStrategy.axisDatum;
  }

  makeLinkPath() {
    return this.layoutStrategy.linkFactory(this.layoutStrategy.linkDatum);
  }

  makeAxisPath() {
    return this.layoutStrategy.linkFactory(this.layoutStrategy.axisDatum);
  }

  makeTextProps() {
    const textPoint = this.layoutStrategy.textPoint;
    return {
      x: textPoint[0],
      y: textPoint[1],
    };
  }

  makeExpandBtnProps() {
    const textProps = this.makeTextProps();
    return {
      x: textProps.x + this.textDimension.width,
      y: textProps.y,
    };
  }
}

export default Layout;
