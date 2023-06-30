# Time zone

You can provide one of the following values for `application.timeZone`:

- `client`:

  - If the client sends a date, Indiekit will leave the date untouched
  - If the client does not send a date, Indiekit will use the current date as UTC

- `server` (detects the server’s time zone, possibly set via `TZ` environment variable or other means):

  - If the client sends a date, Indiekit will update the date to use the server’s time zone
  - If the client does not send a date, Indiekit will use the current date with the server’s time zone

- Any value from the [IANA tz database][tz]:

  - If the client sends a date, Indiekit will update the date to use the given time zone
  - If the client does not send a date, Indiekit will use the current date with the given time zone

> The default value for `application.timeZone` is `UTC`.

So for example, assuming the current local time is `2020-09-23T19:00:00+01:00 Europe/London`, given the following values sent by the client for `published`, the date Indiekit saves would be as follows:

|                            | `client`                  | `server`                      | `Asia/Taipei`                 | `UTC`                    |
| :------------------------- | :------------------------ | :---------------------------- | :---------------------------- | :----------------------- |
| Client doesn’t send a date | 2020-09-23T18:00:00.000Z  | 2020-09-23T19:00:00.000+01:00 | 2020-09-24T02:00:00.000+08:00 | 2020-09-23T18:00:00.000Z |
| 2020-01-02                 | 2020-01-02                | 2020-01-02T00:00:00.000+01:00 | 2020-01-02T00:00:00.000+08:00 | 2020-01-02T00:00:00.000Z |
| 2020-01-02T12:00:00        | 2020-01-02T12:00:00       | 2020-01-02T13:00:00.000+01:00 | 2020-01-02T20:00:00.000+08:00 | 2020-01-02T12:00:00.000Z |
| 2020-01-02T12:00:00Z       | 2020-01-02T12:00:00Z      | 2020-01-02T13:00:00.000+01:00 | 2020-01-02T20:00:00.000+08:00 | 2020-01-02T12:00:00.000Z |
| 2020-01-02T12:00:00-04:00  | 2020-01-02T12:00:00-04:00 | 2020-01-02T17:00:00.000+01:00 | 2020-01-03T00:00:00.000+08:00 | 2020-01-02T16:00:00.000Z |

[tz]: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
