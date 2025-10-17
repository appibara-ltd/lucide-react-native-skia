import type { GroupProps } from "@shopify/react-native-skia";
import type { FC, MemoExoticComponent } from "react";
/**
 * A reduced version of `SVGElementType` from @types/react. This type was added
 * with the release of React 19, and is included here in order to support usage
 * with older versions.
 */
export type SVGElementType =
  | "circle"
  | "ellipse"
  | "g"
  | "line"
  | "path"
  | "polygon"
  | "polyline"
  | "rect";

export interface LucideProps extends GroupProps {
  size?: number;
  absoluteStrokeWidth?: boolean;
  strokeWidth?: number;
  color?: string;
  "data-testid"?: string;
}

export type LucideIcon = MemoExoticComponent<FC<LucideProps>>;

type PathSvgAttrs = Partial<Record<"d", string>>;
type PolygonSvgAttrs = Partial<Record<"points", string>>;
type PolylineSvgAttrs = Partial<Record<"points", string>>;
type CircleSvgAttrs = Partial<Record<"cx" | "cy" | "r", string>>;
type RectSvgAttrs = Partial<
  Record<"x" | "y" | "rx" | "ry" | "width" | "height", string>
>;
type EllipseSvgAttrs = Partial<Record<"cx" | "cy" | "rx" | "ry", string>>;
type LineSvgAttrs = Partial<Record<"x1" | "x2" | "y1" | "y2", string>>;

type WithKey<T> = T & { key: string };
export type IconNodeAttrs = {
  g: WithKey<{}>;
  path: WithKey<PathSvgAttrs>;
  polygon: WithKey<PolygonSvgAttrs>;
  polyline: WithKey<PolylineSvgAttrs>;
  circle: WithKey<CircleSvgAttrs>;
  rect: WithKey<RectSvgAttrs>;
  ellipse: WithKey<EllipseSvgAttrs>;
  line: WithKey<LineSvgAttrs>;
};

export type IconNode = [
  elementName: SVGElementType,
  attrs:
    | WithKey<PathSvgAttrs>
    | WithKey<PolygonSvgAttrs>
    | WithKey<PolylineSvgAttrs>
    | WithKey<CircleSvgAttrs>
    | WithKey<RectSvgAttrs>
    | WithKey<EllipseSvgAttrs>
    | WithKey<LineSvgAttrs>
][];
