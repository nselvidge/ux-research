export const getGroupNode = (groupNumber: number) =>
  document.querySelector(`.groupContainer[data-group-number="${groupNumber}"]`);
