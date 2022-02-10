import dateFnsTz from "date-fns-tz";

const { format, utcToZonedTime } = dateFnsTz;

/**
 * Converts date to use configured time zone
 *
 * @param {string} setting Time zone setting
 * @param {string} dateString Date string
 * @returns {string} Converted date
 *
 * setting options:
 *   `client`: don’t transform incoming date
 *   `server`: use server’s time zone
 *   [IANA tz timezone]: use specified time zone
 */
export const getDate = (setting, dateString) => {
  if (setting === "client") {
    // Return given date string or create ISO string using current date
    return dateString ? dateString : new Date().toISOString();
  }

  // Datetime is given date or new date, set us UTC
  let datetime = dateString ? new Date(dateString) : new Date();

  // Desired time zone
  const serverTimeZone = getServerTimeZone();
  const outputTimeZone = setting === "server" ? serverTimeZone : setting;

  // Short dates, i.e. 2019-02-01
  // Don’t covert dates without a given time
  const dateHasTime = dateString ? dateString.includes("T") : false;
  const dateIsShort = dateString && !dateHasTime;
  if (dateIsShort) {
    const offset = format(datetime, "XXX", {
      timeZone: outputTimeZone,
    });
    return `${dateString}T00:00:00.000${offset}`;
  }

  // JS converts dateString to UTC, so need to convert it to output zoned time
  datetime = utcToZonedTime(datetime, outputTimeZone);

  // Return datetime with desired timezone offset
  datetime = format(datetime, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX", {
    timeZone: outputTimeZone,
  });

  return datetime;
};

/**
 * Get local time zone offset in hours and minutes
 *
 * @returns {string} Local time zone offset, i.e. +5:30, -6:00 or Z
 */
export const getServerTimeZone = () => {
  let timeZoneOffset;
  const timeZoneOffsetMinutes = new Date().getTimezoneOffset();
  let offsetHours = Number.parseInt(Math.abs(timeZoneOffsetMinutes / 60), 10);
  let offsetMinutes = Math.abs(timeZoneOffsetMinutes % 60);

  if (offsetHours < 10) {
    offsetHours = "0" + offsetHours;
  }

  if (offsetMinutes < 10) {
    offsetMinutes = "0" + offsetMinutes;
  }

  // Add an opposite sign to the offset
  // If offset is 0, timezone is UTC
  if (timeZoneOffsetMinutes < 0) {
    timeZoneOffset = "+" + offsetHours + ":" + offsetMinutes;
  } else if (timeZoneOffsetMinutes > 0) {
    timeZoneOffset = "-" + offsetHours + ":" + offsetMinutes;
  } else if (timeZoneOffsetMinutes === 0) {
    timeZoneOffset = "Z";
  }

  return timeZoneOffset;
};
