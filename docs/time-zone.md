# Setting a time zone

You can provide one of the following values for `publication.timeZone`:

* `client`:
  * Client sends a date: Indiekit leaves this untouched
  * Client does not send a date: Indiekit uses current time with UTC offset (`Z`)
* `local`:
  * Client sends a date: Indiekit converts this to a local time
  * Client does not send a date: Indiekit uses current local time
* `server` (system time zone, possibly set via `TZ` environment variable or other means):
  * Client sends a date: Indiekit updates this to use server time zone offset
  * Client does not send a date: Indiekit uses current time with server time zone offset
* Any value from the IANA tz database (i.e. `Asia/Shanghai`, `UTC`, a value passed via `process.env.TZ`, etc.):
  * Client sends a date: Indiekit updates this to use given time zone offset (i.e. `+08:00`, `Z`, `+01:00`)
  * Client does not send a date: Indiekit uses current time with given time zone offset (i.e. `+08:00`, `Z`, `+01:00`)

> The default value for `publication.timeZone` is `UTC`.

So for example, assuming the current local time is `2020-09-23T18:00:00+01:00 Europe/London`, given the following values sent by the client for `published`, the date Indiekit saves would be as follows:

|               | Client doesn’t send date  | 2020-09-20T12:00:00¹      | 2020-09-20T12:00:00Z²     | 2020-09-20T12:00:00-04:00³ |
| ------------- | :------------------------ | :------------------------ | :------------------------ | :------------------------- |
| `client`      | 2020-09-23T18:00:00Z      | 2020-09-20T12:00:00       | 2020-09-20T12:00:00Z      | 2020-09-20T12:00:00-04:00  |
| `local`       | 2020-09-23T19:00:00       | 2020-09-23T12:00:00       | 2020-09-20T13:00:00       | 2020-09-20T18:00:00        |
| `server`⁴     | 2020-09-23T18:00:00+01:00 | 2020-09-20T12:00:00+01:00 | 2020-09-20T12:00:00+01:00 | 2020-09-20T12:00:00+01:00  |
| `Asia/Taipei` | 2020-09-23T18:00:00+08:00 | 2020-09-20T12:00:00+08:00 | 2020-09-20T12:00:00+08:00 | 2020-09-20T12:00:00+08:00  |
| `UTC`         | 2020-09-23T18:00:00Z      | 2020-09-20T12:00:00Z      | 2020-09-20T12:00:00Z      | 2020-09-20T12:00:00Z       |

¹ Client sends a date, but doesn’t indicate time zone  
² Client sends a date, indicates UTC  
³ Client sends a date, including a time zone offset  
⁴ Server has `TZ` set to `Europe/London`

Each of these options has pros/cons, which you should consider before changing this setting:

* `client`:
  * Useful if you use a highly configurable Micropub client
  * Unpredictable if you use different clients or don’t know what your client sends
  * In most cases will likely save dates as UTC
* `local`:
  * Publishes dates with an understandable and recognisable time
  * Gives no indication which time zone a post was published in
  * Can cause issues with floating times
* `server`:
  * Uses system time zone information
  * Not explicit. The configured time zone can often vary between different servers, i.e. local and remote
* Any value from the IANA tz database:
  * Explicit
  * Needs to be manually changed if you travel a lot and want to use the local timezone
