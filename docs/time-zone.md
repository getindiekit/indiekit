# Setting a time zone

You can provide one of the following values for `publication.timeZone`:

* `client`:
  * Client sends a date: Indiekit leaves date untouched
  * Client does not send a date: Indiekit uses current date as UTC
* `server` (detects the server’s time zone, possibly set via `TZ` environment variable or other means):
  * Client sends a date: Indiekit updates date to use time in server’s time zone
  * Client does not send a date: Indiekit uses current date with server’s time zone
* Any value from the [IANA tz database][tz]:
  * Client sends a date: Indiekit updates this to use time in given time zone
  * Client does not send a date: Indiekit uses current date with given time zone

> The default value for `publication.timeZone` is `UTC`.

So for example, assuming the current local time is `2020-09-23T19:00:00+01:00 Europe/London`, given the following values sent by the client for `published`, the date Indiekit saves would be as follows:

|               | Client doesn’t send date      | 2020-01-02                    | 2020-01-02T12:00:00²          | 2020-01-02T12:00:00Z³         | 2020-01-02T12:00:00-04:00⁴    |
| ------------- | :---------------------------- | :---------------------------- | :---------------------------- | :---------------------------- | :---------------------------- |
| `client`      | 2020-09-23T18:00:00.000Z      | 2020-01-02                    | 2020-01-02T12:00:00           | 2020-01-02T12:00:00Z          | 2020-01-02T12:00:00-04:00     |
| `server`⁵     | 2020-09-23T19:00:00.000+01:00 | 2020-01-02T00:00:00.000+01:00 | 2020-01-02T13:00:00.000+01:00 | 2020-01-02T13:00:00.000+01:00 | 2020-01-02T17:00:00.000+01:00 |
| `Asia/Taipei` | 2020-09-24T02:00:00.000+08:00 | 2020-01-02T00:00:00.000+08:00 | 2020-01-02T20:00:00.000+08:00 | 2020-01-02T20:00:00.000+08:00 | 2020-01-03T00:00:00.000+08:00 |
| `UTC`         | 2020-09-23T18:00:00.000Z      | 2020-01-02T00:00:00.000Z      | 2020-01-02T12:00:00.000Z      | 2020-01-02T12:00:00.000Z      | 2020-01-02T16:00:00.000Z      |

¹ Client sends a date, but doesn’t include a time  
² Client sends a date, but doesn’t include a time zone  
³ Client sends a date, indicates UTC  
⁴ Client sends a date, including a time zone offset  
⁵ Server has `TZ` set to `Europe/London`

Each of these options has pros/cons, which you should consider before changing this setting:

* `client`:
  * Useful if you use a highly configurable Micropub client
  * Unpredictable if you use different clients or don’t know what your client sends
  * In most cases will likely save dates as UTC
* `server`:
  * Uses system time zone information
  * Not explicit. The configured time zone can often vary between different servers, i.e. local and remote
* Any value from the IANA tz database:
  * Explicit
  * Needs to be manually changed if you travel a lot and want to use the local timezone

[tz]: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
