import { RefObject, useEffect, useState } from "react";

export const useContainsSelection = (
  ref: RefObject<HTMLDivElement>
): boolean => {
  const [containsSelection, setContainsSelection] = useState(false);

  useEffect(() => {
    const onSelectionChange = () => {
      const selection = window.getSelection();
      const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
      if (!range && containsSelection === true) {
        return setContainsSelection(false);
      } else if (!range) {
        return;
      }

      const intersects = range.intersectsNode(ref.current);
      if (intersects && containsSelection === false) {
        return setContainsSelection(true);
      } else if (intersects) {
        return;
      } else if (!intersects && containsSelection) {
        return setContainsSelection(false);
      }
    };
    document.addEventListener("selectionchange", onSelectionChange);
    return () =>
      document.removeEventListener("selectionchange", onSelectionChange);
  }, [containsSelection]);

  return containsSelection;
};
