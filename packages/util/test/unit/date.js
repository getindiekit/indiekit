import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import { isValid, parseISO } from "date-fns";
import {
  formatDate,
  formatDateToLocal,
  getDate,
  getTimeZoneDesignator,
  getTimeZoneOffset,
  isDate,
} from "../../lib/date.js";

describe("util/lib/date", () => {
  it("Formats a date", () => {
    assert.equal(formatDate("2019-11-30", "dd MMMM yyyy"), "30 November 2019");
    assert.equal(
      formatDate("2019-11-30", "PPP", { locale: "en-GB" }),
      "30 November 2019",
    );
    assert.equal(
      formatDate("2019-11-30", "PPP", { locale: "en-US" }),
      "November 30th, 2019",
    );
    assert.equal(
      formatDate("2019-11-30", "PPP", { locale: "pt-BR" }),
      "30 de novembro de 2019",
    );
  });

  it("Formats the date right now", () => {
    const now = Math.round(Date.now() / 1_000_000);
    const result = Math.round(Number(formatDate("now", "t")) / 1000);

    assert.equal(result, now);
  });

  it("Formats a date as local date", () => {
    const tz1 = formatDateToLocal("2019-11-30T12:30:00+01:00", "Asia/Taipei");
    const tz2 = formatDateToLocal(
      "2019-11-30T12:30:00+01:00",
      "America/Panama",
    );
    const utc = formatDateToLocal("2019-11-30T12:30:00+01:00", "UTC");

    assert.equal(tz1, "2019-11-30T03:30");
    assert.equal(tz2, "2019-11-30T16:30");
    assert.equal(utc, "2019-11-30T11:30");
  });

  it("Creates UTC datetime from `client`", () => {
    const result = getDate("client");

    assert.equal(isValid(parseISO(result)), true);
    assert.match(result, /\d{4}-[01]\d-[0-3]\dT[0-2](?:\d:[0-5]){2}\d\.\d+Z$/);
  });

  it("Retains short date from `client`", () => {
    const result = getDate("client", "2020-01-02");

    assert.equal(result, "2020-01-02");
  });

  it("Retains local datetime from `client`", () => {
    const result = getDate("client", "2020-01-02T12:00:00.000");

    assert.equal(result, "2020-01-02T12:00:00.000");
  });

  it("Retains UTC datetime from `client`", () => {
    const result = getDate("client", "2020-01-02T12:00:00.000Z");

    assert.equal(result, "2020-01-02T12:00:00.000Z");
  });

  it("Retains offset datetime from `client`", () => {
    const result = getDate("client", "2020-01-02T12:00:00.000-04:00");

    assert.equal(result, "2020-01-02T12:00:00.000-04:00");
  });

  it("Creates server offset datetime from `server`", () => {
    const result = getDate("server");

    assert.equal(isValid(parseISO(result)), true);
    assert.match(
      result,
      /\d{4}-[01]\d-[0-3]\dT[0-2](?:\d:[0-5]){2}\d\.\d+Z|\+01:00$/,
    );
  });

  it("Converts short date to server offset datetime from `server`", () => {
    const result = getDate("server", "2020-01-02");

    assert.match(result, /(2020-01-02T00:00:00\.000)(Z|\+01:00)/);
  });

  it("Converts local to server offset datetime from `server`", () => {
    const result = getDate("server", "2020-01-02T12:00:00.000");

    assert.match(result, /(2020-01-02T(12|13):00:00\.000)(Z|\+01:00)/);
  });

  it("Converts UTC to server offset datetime from `server`", () => {
    const result = getDate("server", "2020-01-02T12:00:00.000Z");

    assert.match(result, /(2020-01-02T(12|13):00:00\.000)(Z|\+01:00)/);
  });

  it("Converts offset datetime from `server`", () => {
    const result = getDate("server", "2020-01-02T12:00:00.000-04:00");

    assert.match(result, /(2020-01-02T(16|17):00:00\.000)(Z|\+01:00)/);
  });

  it("Creates +08:00 offset datetime from `Asia/Taipei`", () => {
    const result = getDate("Asia/Taipei");

    assert.equal(isValid(parseISO(result)), true);
    assert.match(
      result,
      /\d{4}-[01]\d-[0-3]\dT[0-2](?:\d:[0-5]){2}\d\.\d+\+08:00$/,
    );
  });

  it("Converts short date to +08:00 offset datetime from `Asia/Taipei`", () => {
    const result = getDate("Asia/Taipei", "2020-01-02");

    assert.equal(result, "2020-01-02T00:00:00.000+08:00");
  });

  it("Converts local to +08:00 offset datetime from `Asia/Taipei`", () => {
    const result = getDate("Asia/Taipei", "2020-01-02T12:00:00.000");

    assert.equal(result, "2020-01-02T20:00:00.000+08:00");
  });

  it("Converts UTC to +08:00 offset datetime from `Asia/Taipei`", () => {
    const result = getDate("Asia/Taipei", "2020-01-02T12:00:00.000Z");

    assert.equal(result, "2020-01-02T20:00:00.000+08:00");
  });

  it("Converts offset to +08:00 offset datetime from `Asia/Taipei`", () => {
    const result = getDate("Asia/Taipei", "2020-01-02T12:00:00.000-04:00");

    assert.equal(result, "2020-01-03T00:00:00.000+08:00");
  });

  it("Creates Z offset datetime from `UTC`", () => {
    const result = getDate("UTC");

    assert.equal(isValid(parseISO(result)), true);
    assert.match(result, /\d{4}-[01]\d-[0-3]\dT[0-2](?:\d:[0-5]){2}\d\.\d+Z$/);
  });

  it("Converts short date to Z offset datetime from `UTC`", () => {
    const result = getDate("UTC", "2020-01-02");

    assert.equal(result, "2020-01-02T00:00:00.000Z");
  });

  it("Converts local to Z offset datetime from `UTC`", () => {
    const result = getDate("UTC", "2020-01-02T12:00:00.000");

    assert.equal(result, "2020-01-02T12:00:00.000Z");
  });

  it("Retains Z offset datetime from `UTC`", () => {
    const result = getDate("UTC", "2020-01-02T12:00:00.000Z");

    assert.equal(result, "2020-01-02T12:00:00.000Z");
  });

  it("Converts offset date to Z offset datetime from `UTC`", () => {
    const result = getDate("UTC", "2020-01-02T12:00:00-04:00");

    assert.equal(result, "2020-01-02T16:00:00.000Z");
  });

  it("Converts offset to Z offset datetime from `UTC`", () => {
    const result = getDate("UTC", "2020-01-02T12:00:00.000-04:00");

    assert.equal(result, "2020-01-02T16:00:00.000Z");
  });

  it("Gets server timezone offset from minutes", () => {
    assert.equal(getTimeZoneDesignator(0), "Z");
    assert.equal(getTimeZoneDesignator(150), "-02:30");
    assert.equal(getTimeZoneDesignator(-300), "+05:00");
  });

  it("Gets server timezone offset from local time", () => {
    process.env.TZ = "Asia/Taipei"; // Does not observe DST
    assert.equal(getTimeZoneDesignator(), "+08:00");

    process.env.TZ = "America/Panama"; // Does not observe DST
    assert.equal(getTimeZoneDesignator(), "-05:00");

    process.env.TZ = "UTC";
    assert.equal(getTimeZoneDesignator(), "Z");
  });

  it("Gets offset minutes from time zone name", () => {
    const date = new Date();
    assert.equal(getTimeZoneOffset("Asia/Taipei", date), -480);
    assert.equal(getTimeZoneOffset("America/Panama", date), 300);
    assert.equal(getTimeZoneOffset("UTC", date), 0);
  });

  it("Check if a string can be parsed as a date", () => {
    assert.equal(isDate("2024-02-14T13:24:00+0100"), true);
    assert.equal(isDate("Wed Feb 14 2024 13:24:00 GMT+0100"), true);
    assert.equal(isDate("valentines+day"), false);
  });
});
