import { useLocation } from "wouter";
import { useEffect, useState } from "react";

const flashMessages: { [key: string]: string } = {
  NotFound: "Invalid email or password",
  invalidInviteToken: "Invalid invite token.",
};

export const useFlashError = () => {
  const [location, navigate] = useLocation();

  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const errorCode = query.get("error");
    if (errorCode) {
      setError(flashMessages[errorCode]);
      query.delete("error");
      navigate(
        `${location}${query.toString() !== "" ? `?${query.toString()}` : ""}`
      );
    }
  }, []);

  return error;
};
