const getFormattedHours = (seconds: number) =>
  seconds > 60 * 60 ? `${Math.floor(seconds / (60 * 60))}:` : "";

const getFormattedMinutes = (seconds: number) =>
  seconds > 60 * 60
    ? `${Math.floor(seconds / 60) % 60}:`.padStart(3, "0")
    : `${Math.floor(seconds / 60) % 60}:`;

const getFormattedSeconds = (seconds: number) =>
  `${Math.floor(seconds % 60)}`.padStart(2, "0");

export const formatTimestampFromSeconds = (seconds: number) =>
  `${getFormattedHours(seconds)}${getFormattedMinutes(
    seconds
  )}${getFormattedSeconds(seconds)}`;

export const formatTimestampFromMilliseconds = (milliseconds: number) =>
  `${getFormattedHours(milliseconds / 1000)}${getFormattedMinutes(
    milliseconds / 1000
  )}${getFormattedSeconds(milliseconds / 1000)}`;
