import process from "node:process";
import test from "ava";
import { formatDate, getServerTimeZone } from "../../lib/date.js";

test("Formats a date", (t) => {
  t.is(formatDate("2019-11-30", "dd MMMM yyyy"), "30 November 2019");
  t.is(formatDate("2019-11-30", "PPP", "en-GB"), "30 November 2019");
  t.is(formatDate("2019-11-30", "PPP", "en-US"), "November 30th, 2019");
  t.is(formatDate("2019-11-30", "PPP", "pt-BR"), "30 de novembro de 2019");
});

test("Formats the date right now", (t) => {
  const now = Math.round(Date.now() / 1_000_000);
  const result = Math.round(formatDate("now", "t") / 1000);

  t.is(result, now);
});

test("Gets server timezone offset", (t) => {
  process.env.TZ = "Asia/Taipei"; // Does not observe DST
  const ahead = getServerTimeZone();
  t.is(ahead, "+08:00");

  process.env.TZ = "America/Panama"; // Does not observe DS
  const behind = getServerTimeZone();
  t.is(behind, "-05:00");

  process.env.TZ = "UTC";
  const utc = getServerTimeZone();
  t.is(utc, "Z");
});
