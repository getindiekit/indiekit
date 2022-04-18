Values for `*.path` and `*.url` can be customised using the following tokens:

| Token | Path type | Description |
| :---- | :-------- | :---------- |
| `y` | `post` `media` | Calendar year, eg <samp>2020</samp> |
| `yyyy` | `post` `media` | Calendar year (zero-padded), eg <samp>2020</samp> |
| `M` | `post` `media` | Month number, eg <samp>9</samp> |
| `MM` | `post` `media` | Month number (zero-padded), eg <samp>09</samp> |
| `MMM` | `post` `media` | Month name (abbreviated), eg <samp>Sep</samp> |
| `MMMM` | `post` `media` | Month name (wide), eg <samp>September</samp> |
| `w` | `post` `media` | Week number, eg <samp>1</samp> |
| `ww` | `post` `media` | Week number (zero-padded), eg <samp>01</samp> |
| `D` | `post` `media` | Day of the year, eg <samp>1</samp> |
| `DDD` | `post` `media` | Day of the year (zero-padded), eg <samp>001</samp> |
| `D60` | `post` `media` | Day of the year (sexageismal), eg <samp>57h</samp> |
| `d` | `post` `media` | Day of the month, eg <samp>1</samp> |
| `dd` | `post` `media` | Day of the month (zero-padded), eg <samp>01</samp> |
| `h` | `post` `media` | Hour (12-hour-cycle), eg <samp>1</samp> |
| `hh` | `post` `media` | Hour (12-hour-cycle, zero-padded), eg <samp>01</samp> |
| `H` | `post` `media` | Hour (24-hour-cycle), eg <samp>1</samp> |
| `HH` | `post` `media` | Hour (24-hour-cycle, zero-padded), eg <samp>01</samp> |
| `m` | `post` `media` | Minute, eg <samp>1</samp> |
| `mm` | `post` `media` | Minute (zero-padded), eg <samp>01</samp> |
| `s` | `post` `media` | Second, eg <samp>1</samp> |
| `ss` | `post` `media` | Second (zero-padded), eg <samp>01</samp> |
| `t` | `post` `media` | UNIX epoch seconds, eg <samp>512969520</samp> |
| `T` | `post` `media` | UNIX epoch milliseconds, eg <samp>51296952000</samp> |
| `uuid` | `post` `media` | A [random UUID][uuid] |
| `slug` | `post` | Provided slug, slugified `name` or a 5 character string, eg <samp>ycf9o</samp> |
| `n` | `post` | Incremental count of posts (for type) in the same day, eg <samp>1</samp> |
| `basename` | `media` | 5 character alpha-numeric string, eg <samp>w9gwi</samp> |
| `ext` | `media` | File extension of uploaded file, eg <samp>jpg</samp> |
| `filename` | `media` | `basename` plus `ext`, eg <samp>w9gwi.jpg</samp> |
| `originalname` | `media` | Original name of uploaded file, eg <samp>flower.jpg</samp> |

[uuid]: https://www.rfc-editor.org/rfc/rfc4122.html#section-4.4
