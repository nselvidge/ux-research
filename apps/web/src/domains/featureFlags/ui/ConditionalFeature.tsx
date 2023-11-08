import React, { ReactNode } from "react";
import { features, useFeatures } from "../state/useFeature";

export const ConditionalFeature = ({
  feature,
  children,
}: {
  feature: keyof typeof features;
  children: ReactNode;
}) => {
  const isActive = useFeatures(feature);
  if (!isActive) {
    return undefined;
  }

  return <>{children}</>;
};
