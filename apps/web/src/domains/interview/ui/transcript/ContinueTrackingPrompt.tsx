import { Button } from "@chakra-ui/react";
import React, { RefObject, useEffect } from "react";
import { useIsTracking } from "../../state/isTrackingContext";

export const ContinueTrackingPrompt = ({
  scrollContainerRef,
}: {
  scrollContainerRef: RefObject<HTMLDivElement>;
}) => {
  const { isTracking, setIsTracking } = useIsTracking();
  useEffect(() => {
    const stopTracking = () => setIsTracking(false);
    const onScrollbarMouseDown = (e: MouseEvent) => {
      // Detect scrollbar clicks
      if (e.offsetX > scrollContainerRef.current.clientWidth) {
        stopTracking();
      }
    };

    scrollContainerRef.current?.addEventListener("wheel", stopTracking);
    scrollContainerRef.current?.addEventListener(
      "mousedown",
      onScrollbarMouseDown
    );

    return () => {
      scrollContainerRef.current?.removeEventListener("wheel", stopTracking);
      scrollContainerRef.current?.removeEventListener(
        "mousedown",
        onScrollbarMouseDown
      );
    };
  }, []);

  return !isTracking ? (
    <Button
      variant="brand"
      position="absolute"
      bottom="20px"
      left="calc(50% - 120px)"
      onClick={() => setIsTracking(true)}
      zIndex={4}
    >
      Return to Current Position
    </Button>
  ) : null;
};
