import { useEffect } from "react";
import hotkeys from "hotkeys-js";

export const useKeyboardShortcut = (
  key: string,
  callback: (e: KeyboardEvent) => void
) => {
  useEffect(() => {
    hotkeys(key, (e) => {
      callback(e);
    });
    return () => hotkeys.unbind(key);
  }, [key, callback]);
};
