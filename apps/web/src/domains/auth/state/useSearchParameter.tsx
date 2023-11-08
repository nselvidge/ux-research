import { useLocation } from "wouter";
import { useEffect, useState } from "react";

export const useSearchParameter = (key: string, shouldRemove?: boolean) => {
  const [location, navigate] = useLocation();

  const [value, setValue] = useState<string | undefined>(undefined);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const newValue = query.get(key);
    if (newValue) {
      setValue(newValue);
      if (shouldRemove) {
        query.delete(key);
        navigate(
          `${window.location.pathname}${
            query.toString() !== "" ? `?${query.toString()}` : ""
          }`
        );
      }
    }
  }, [location.search, location, shouldRemove, key]);

  return value;
};
