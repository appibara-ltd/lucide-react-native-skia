const defaultAttributes = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  color: 'white',
  style: 'stroke',
  strokeWidth: 2,
  strokeCap: 'round',
  strokeJoin: 'round',
} as const;

export const childDefaultAttributes = {
  color: defaultAttributes.color,
  style: defaultAttributes.style,
  strokeWidth: defaultAttributes.strokeWidth,
  strokeCap: defaultAttributes.strokeCap,
  strokeJoin: defaultAttributes.strokeJoin,
};

export default defaultAttributes;
