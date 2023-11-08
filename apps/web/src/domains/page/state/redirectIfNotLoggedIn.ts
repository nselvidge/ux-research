import { useEffect } from "react";
import { useLocation } from "wouter";
import { useMeQuery } from "../requests/page.generated";

export const useRedirectIfNotLoggedIn = (redirectPath?: string): null => {
  const { data, loading } = useMeQuery();
  const [_, navigate] = useLocation();

  // If we have a flash code, we don't want to redirect
  // since it can cause too many redirects in the initial render
  const query = new URLSearchParams(window.location.search);
  const flashCode = query.get("flashCode");

  useEffect(() => {
    if (loading) {
      return;
    }
    if (!loading && data?.me === null && !flashCode) {
      navigate(
        `/login${
          redirectPath ? `?redirect=${encodeURIComponent(redirectPath)}` : ""
        }`
      );
    }
  }, [loading, data?.me, flashCode]);

  return null;
};
