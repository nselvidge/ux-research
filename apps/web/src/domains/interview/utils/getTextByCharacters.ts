export const getTextLocationByCharacterRange = (
  container: Element,
  charStart: number,
  charEnd: number
) => {
  const range = document.createRange();

  range.setStart(container.firstChild, charStart);
  range.setEnd(
    container.firstChild,
    Math.min(charEnd, (container.firstChild as any).length)
  );

  return range.getBoundingClientRect();
};
