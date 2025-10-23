import { memo, useMemo } from "react";
import defaultAttributes, { childDefaultAttributes } from "./defaultAttributes";
import {
  Circle,
  Group,
  Line,
  Path,
  Points,
  RoundedRect,
  vec,
  rrect,
  rect,
  Oval,
  FitBox,
} from "@shopify/react-native-skia";
import type { IconNode, IconNodeAttrs, LucideIcon, LucideProps } from "./types";
import type {
  PointsProps,
  PathProps,
  SkiaDefaultProps,
  LineProps,
  SkiaProps,
  OvalProps,
  CircleProps,
  RoundedRectProps,
  AnimatedProps,
  PublicGroupProps,
} from "@shopify/react-native-skia";

type SkiaPathProps = SkiaDefaultProps<PathProps, "start" | "end">;
type SkiaPointsProps = SkiaDefaultProps<PointsProps, "mode">;
type SkiaLineProps = SkiaProps<LineProps>;
type SkiaOvalProps = SkiaProps<OvalProps>;
type SkiaCircleProps = SkiaProps<CircleProps>;
type SkiaRoundedRectProps = SkiaProps<RoundedRectProps>;
type SkiaGroupPropps = AnimatedProps<PublicGroupProps, never>;

const createPointPairs = (pointsStr: string) => {
  const points = pointsStr.split(" ");
  let pairs = [];
  for (let i = 0, l = points.length; i < l; i += 2) {
    pairs.push(vec(Number(points[i]), Number(points[i + 1])));
  }
  return pairs;
};

const ComponentMap = {
  g: {
    Component: Group,
    attrMapper: (_: IconNodeAttrs["g"]): SkiaGroupPropps => ({}),
  },
  rect: {
    Component: RoundedRect,
    attrMapper: (attrs: IconNodeAttrs["rect"]): SkiaRoundedRectProps => ({
      ...childDefaultAttributes,
      rect: rrect(
        rect(
          Number(attrs.x ?? 0),
          Number(attrs.y ?? 0),
          Number(attrs.width ?? 0),
          Number(attrs.height ?? 0)
        ),
        Number(attrs.rx ?? attrs.ry ?? 0),
        Number(attrs.ry ?? attrs.rx ?? 0)
      ),
    }),
  },
  circle: {
    Component: Circle,
    attrMapper: ({ cx, cy, r }: IconNodeAttrs["circle"]): SkiaCircleProps => ({
      ...childDefaultAttributes,
      cx: Number(cx ?? 0),
      cy: Number(cy ?? 0),
      r: Number(r ?? 0),
    }),
  },
  ellipse: {
    Component: Oval,
    attrMapper: (attrs: IconNodeAttrs["ellipse"]): SkiaOvalProps => ({
      ...childDefaultAttributes,
      x: Number(attrs.cx ?? 0) - Number(attrs.rx ?? 0),
      y: Number(attrs.cy ?? 0) - Number(attrs.ry ?? 0),
      width: Number(attrs.rx ?? 0) * 2,
      height: Number(attrs.ry ?? 0) * 2,
    }),
  },
  line: {
    Component: Line,
    attrMapper: ({ x1, x2, y1, y2 }: IconNodeAttrs["line"]): SkiaLineProps => ({
      ...childDefaultAttributes,
      p1: vec(Number(x1 ?? 0), Number(y1 ?? 0)),
      p2: vec(Number(x2 ?? 0), Number(y2 ?? 0)),
    }),
  },
  path: {
    Component: Path,
    attrMapper: ({ d = "" }: IconNodeAttrs["path"]): SkiaPathProps => ({
      ...childDefaultAttributes,
      path: d,
    }),
  },
  polygon: {
    Component: Points,
    attrMapper: ({
      points = "",
    }: IconNodeAttrs["polygon"]): SkiaPointsProps => ({
      mode: "polygon",
      ...childDefaultAttributes,
      points: createPointPairs(points),
    }),
  },
  polyline: {
    Component: Points,
    attrMapper: ({
      points = "",
    }: IconNodeAttrs["polyline"]): SkiaPointsProps => ({
      mode: "polygon",
      ...childDefaultAttributes,
      points: createPointPairs(points),
    }),
  },
};

const createLucideIcon = (iconName: string, iconNode: IconNode): LucideIcon => {
  let attrMap: Record<string, any> = {};
  const fitSrc = rect(0, 0, defaultAttributes.width, defaultAttributes.height);
  const Component = memo(
    ({
      color = "white",
      size = 24,
      strokeWidth = 2,
      absoluteStrokeWidth,
      "data-testid": dataTestId,
      children,
      ...rest
    }: LucideProps) => {
      const customAttrs = useMemo(
        () => ({
          color: color,
          strokeWidth: absoluteStrokeWidth
            ? (Number(strokeWidth) * 24) / Number(size)
            : strokeWidth,
        }),
        [color, strokeWidth, absoluteStrokeWidth, size]
      );
      const fitDst = useMemo(() => rect(0, 0, size, size), [size]);

      return (
        <Group {...rest}>
          <FitBox src={fitSrc} dst={fitDst}>
            <Group>
              {iconNode.map(([tag, attrs]) => {
                const { Component, attrMapper } = ComponentMap[tag];
                return (
                  <Component
                    key={attrs.key}
                    {...(attrMap[attrs.key] ??
                      (attrMap[attrs.key] = attrMapper(attrs)))}
                    {...customAttrs}
                  />
                );
              })}
            </Group>
          </FitBox>
          {children}
        </Group>
      );
    }
  );

  Component.displayName = `${iconName}`;

  return Component;
};

export default createLucideIcon;
