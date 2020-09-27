# How Indiekit handles datetime values

Users can provide one of the following values for `publication.timeZone` (the configuration option Indiekit uses to set time zone handling):

* `client` (default):
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

So for example, assuming the current local time is `2020-09-23T18:00:00+01:00 Europe/London`, give the following values sent by the client for `published`, the date Indiekit saves would be as follows (where **bold** indicates a change value):

|                  | Client does not send a date   | 2020-09-20 T12:00:00 ¹         | 2020-09-20 T12:00:00Z ²        | 2020-09-20 T12:00:00-04:00 ³   |
| ---------------- | :---------------------------- | :---------------------------- | :---------------------------- | :---------------------------- |
| `client`         | **2020-09-23 T18:00:00Z**      | 2020-09-20 T12:00:00           | 2020-09-20 T12:00:00Z          | 2020-09-20 T12:00:00-04:00     |
| `local`          | **2020-09-23 T19:00:00**       | 2020-09-23 T12:00:00           | **2020-09-20 T13:00:00**       | **2020-09-20 T18:00:00**       |
| `server` ⁴       | **2020-09-23 T18:00:00+01:00** | 2020-09-20 T12:00:00 **+01:00** | 2020-09-20 T12:00:00 **+01:00** | 2020-09-20 T12:00:00 **+01:00** |
| `Asia/Shanghai`  | **2020-09-23 T18:00:00+08:00** | 2020-09-20 T12:00:00 **+08:00** | 2020-09-20 T12:00:00 **+08:00** | 2020-09-20 T12:00:00 **+08:00** |
| `UTC`            | **2020-09-23 T18:00:00Z**      | 2020-09-20 T12:00:00 **Z**      | 2020-09-20 T12:00:00Z          | 2020-09-20 T12:00:00 **Z**      |

¹ Client sends a date, but doesn’t indicate time zone
² Client sends a date, indicates UTC
³ Client sends a date, including a time zone offset
⁴ Server has `TZ` set to `Europe/London`

Each of these options has pros/cons – which means having this setting is useful!

* `client`:
  👍 Useful if you use a highly configurable Micropub client
  👎 Unpredictable if you use different clients or don’t know what your client sends
  🤔 In most cases will likely save dates as UTC
* `local`:
  👍 Publishes dates with understandable/recognisable times (especially if not GMT!)
  👎 No indication which time zone this datetime was recorded in
  👎 Can cause issues with floating times
* `server`:
  👍 Use system time zone information
  👎 Not explicit, server time zone can often vary between different servers (local/remote)
* Any value from the IANA tz database:
  👍 Explicit
  👎 Needs to be manually changed if you travel a lot and want to include the local timezone
