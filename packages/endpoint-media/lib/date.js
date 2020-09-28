import dateFnsTz from 'date-fns-tz';

const {format, utcToZonedTime} = dateFnsTz;

/**
 * Get local time zone offset in hours and minutes
 *
 * @returns {string} Local time zone offset, i.e. +5:30, -6:00 or Z
 */
const getTimeZoneOffset = () => {
  let timeZoneOffset;
  const timeZoneOffsetMinutes = new Date().getTimezoneOffset();
  let offsetHours = Number.parseInt(Math.abs(timeZoneOffsetMinutes / 60), 10);
  let offsetMinutes = Math.abs(timeZoneOffsetMinutes % 60);

  if (offsetHours < 10) {
    offsetHours = '0' + offsetHours;
  }

  if (offsetMinutes < 10) {
    offsetMinutes = '0' + offsetMinutes;
  }

  // Add an opposite sign to the offset
  // If offset is 0, timezone is UTC
  if (timeZoneOffsetMinutes < 0) {
    timeZoneOffset = '+' + offsetHours + ':' + offsetMinutes;
  } else if (timeZoneOffsetMinutes > 0) {
    timeZoneOffset = '-' + offsetHours + ':' + offsetMinutes;
  } else if (timeZoneOffsetMinutes === 0) {
    timeZoneOffset = 'Z';
  }

  return timeZoneOffset;
};

/**
 * Converts date to use configured time zone
 *
 * @param {string} timeZoneSetting Time zone setting
 * @param {string} dateString Date string
 * @returns {string} Converted date
 */
export const getDate = (timeZoneSetting, dateString) => {
  const dateRegexp = /(?<date>\d{4}-[01]\d-[0-3]\d)(T(?<time>[0-2](?:\d:[0-5]){2}\d\.\d+))?(?<timeZone>[+-][0-2]\d:[0-5]\d|Z)?/;
  const clientTimeZone = dateString ? dateString.match(dateRegexp).groups.timeZone : undefined;
  const serverTimeZone = getTimeZoneOffset();

  let datetime;

  switch (timeZoneSetting) {
    case 'client':
      // Return given date string or create ISO string using current date
      return dateString ? dateString : new Date().toISOString();

    case 'local':
      // Create Date object using given or current date
      datetime = dateString ? new Date(dateString) : new Date();

      // If date string includes an offset, convert it to a local datetime
      if (clientTimeZone) {
        datetime = utcToZonedTime(datetime, clientTimeZone);
      }

      // Return date and time with no offset
      return datetime.toISOString().slice(0, 23);

    default:
      // Create Date object using given or current date
      datetime = dateString ? new Date(dateString) : new Date();

      // Fix date to use correct UTC datetime given original offset
      datetime = utcToZonedTime(datetime, clientTimeZone || 'UTC');

      // Return UTC datetime with timezone offset
      return format(datetime, 'yyyy-MM-dd\'T\'HH:mm:ss.SSSXXX', {
        timeZone: timeZoneSetting === 'server' ? serverTimeZone : timeZoneSetting
      });
  }
};
