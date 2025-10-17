import { memo } from "react";
import defaultAttributes, { childDefaultAttributes } from "./defaultAttributes";
import { IconNode, IconNodeAttrs, LucideIcon, LucideProps } from "./types";
import {
  Circle,
  Group,
  Line,
  Path,
  Points,
  PointsProps,
  vec,
  RoundedRect,
  rrect,
  rect,
  Oval,
  FitBox,
} from "@shopify/react-native-skia";

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
    props: {},
    attrMapper: ({}: IconNodeAttrs["g"]) => {},
  },
  rect: {
    Component: RoundedRect,
    props: childDefaultAttributes,
    attrMapper: ({ x, y, width, height, rx, ry }: IconNodeAttrs["rect"]) => ({
      rect: rrect(
        rect(
          Number(x ?? 0),
          Number(y ?? 0),
          Number(width ?? 0),
          Number(height ?? 0)
        ),
        Number(rx ?? ry ?? 0),
        Number(ry ?? rx ?? 0)
      ),
    }),
  },
  circle: {
    Component: Circle,
    props: childDefaultAttributes,
    attrMapper: ({ cx, cy, r }: IconNodeAttrs["circle"]) => ({
      cx: Number(cx ?? 0),
      cy: Number(cy ?? 0),
      r: Number(r ?? 0),
    }),
  },
  ellipse: {
    Component: Oval,
    props: childDefaultAttributes,
    attrMapper: ({ cx, cy, rx, ry }: IconNodeAttrs["ellipse"]) => ({
      x: Number(cx ?? 0) - Number(rx ?? 0),
      y: Number(cy ?? 0) - Number(ry ?? 0),
      width: Number(rx ?? 0) * 2,
      height: Number(ry ?? 0) * 2,
    }),
  },
  line: {
    Component: Line,
    props: childDefaultAttributes,
    attrMapper: ({ x1, x2, y1, y2 }: IconNodeAttrs["line"]) => ({
      p1: vec(Number(x1 ?? 0), Number(y1 ?? 0)),
      p2: vec(Number(x2 ?? 0), Number(y2 ?? 0)),
    }),
  },
  path: {
    Component: Path,
    props: childDefaultAttributes,
    attrMapper: ({ d = "" }: IconNodeAttrs["path"]) => ({ path: d }),
  },
  polygon: {
    Component: Points,
    props: { mode: "polygon", ...childDefaultAttributes } as PointsProps,
    attrMapper: ({ points = "" }: IconNodeAttrs["polygon"]) => ({
      points: createPointPairs(points),
    }),
  },
  polyline: {
    Component: Points,
    props: { mode: "polygon", ...childDefaultAttributes } as PointsProps,
    attrMapper: ({ points = "" }: IconNodeAttrs["polyline"]) => ({
      points: createPointPairs(points),
    }),
  },
};

const createLucideIcon = (iconName: string, iconNode: IconNode): LucideIcon => {
  let attrMap: Record<string, any> = {};
  const Component = memo(
    ({
      color = "white",
      size = 24,
      strokeWidth = 2,
      absoluteStrokeWidth,
      "data-testid": dataTestId,
      ...rest
    }: LucideProps) => {
      const customAttrs = {
        color: color,
        strokeWidth: absoluteStrokeWidth
          ? (Number(strokeWidth) * 24) / Number(size)
          : strokeWidth,
      };

      return (
        <Group {...rest}>
          <FitBox
            src={rect(0, 0, defaultAttributes.width, defaultAttributes.height)}
            dst={rect(0, 0, size, size)}
          >
            <Group>
              {iconNode.map(([tag, attrs]) => {
                const { Component, props, attrMapper } = ComponentMap[tag];

                return (
                  <Component
                    key={attrs.key}
                    {...(attrMap[attrs.key] ??
                      (attrMap[attrs.key] = attrMapper(attrs)))}
                    {...props}
                    {...customAttrs}
                  />
                );
              })}
            </Group>
          </FitBox>
        </Group>
      );
    }
  );

  Component.displayName = `${iconName}`;

  return Component;
};

export default createLucideIcon;
