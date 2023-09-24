export default function compareScheduleTimes(
  time01: string,
  time02: string,
  intervalSeparator: string = '-',
  timeSeparator: string = ':',
): number {
  const time01Minutes = getMinutesScheduleTime(
    time01,
    intervalSeparator,
    timeSeparator,
  );

  const time02Minutes = getMinutesScheduleTime(
    time02,
    intervalSeparator,
    timeSeparator,
  );

  if (time01Minutes > time02Minutes) {
    return 1;
  }

  return -1;
}

export function getMinutesScheduleTime(
  time: string,
  intervalSeparator: string,
  timeSeparator: string,
): number {
  const [timeStart] = time.split(intervalSeparator);
  const timeSplitted = timeStart.split(timeSeparator);

  const timeHours = parseInt(timeSplitted[0]);
  const timeMinutes = parseInt(timeSplitted[1]);

  return timeHours * 60 + timeMinutes;
}
