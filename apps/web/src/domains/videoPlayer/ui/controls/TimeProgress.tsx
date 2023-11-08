import React from "react";
import {
  formatTimestampFromSeconds,
  formatTimestampFromMilliseconds,
} from "~/domains/common/utils/formatTimestamp";
import { Text } from "@chakra-ui/react";
import { usePlayerContext } from "../../state/playerContext";
import { useCurrentTimeSeconds } from "../../state/currentTime";

export const TimeProgress = () => {
  const { duration } = usePlayerContext();
  const currentTimeSeconds = useCurrentTimeSeconds();

  return (
    <Text
      color="#EAEAEA"
      fontWeight="400"
      fontSize="13px"
      verticalAlign="center"
      padding="12px"
      style={{ fontVariantNumeric: "tabular-nums" }}
      whiteSpace="nowrap"
    >
      {formatTimestampFromSeconds(currentTimeSeconds)} /{" "}
      {formatTimestampFromMilliseconds(duration)}
    </Text>
  );
};
