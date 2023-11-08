export const valueIsBetweenBounds = (
  value: number,
  left: number,
  right: number
) => left <= value && value < right;

export const valueIsBetweenBoundsInclusive = (
  value: number,
  left: number,
  right: number
) => left <= value && value <= right;
