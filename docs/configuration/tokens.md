---
outline: deep
---

# Tokens

Values for post and media paths in post type configuration can be customised using placeholder tokens.

For example, given the following properties for a note post:

```js
{
  published: "2020-02-02",
  name: "What I had for lunch",
  content: "I ate a cheese sandwich, which was nice.",
}
```

would, with the path `_journal/{yyyy}-{MM}-{dd}-{slug}.md`, output:

```txt
_journal/2020-02-02-what-i-had-for-lunch.md
```

## Path and URL tokens

Tokens are available for a number of file properties, with many allowing you to use parts of the published or uploaded date in generated paths and URLs:

| Token | Description |
| :---- | :---------- |
| `y` | Calendar year, for example `2020` |
| `yyyy` | Calendar year (zero-padded), for example `2020` |
| `M` | Month number, for example `9` |
| `MM` | Month number (zero-padded), for example `09` |
| `MMM` | Month name (abbreviated), for example `Sep` |
| `MMMM` | Month name (wide), for example `September` |
| `w` | Week number, for example `1` |
| `ww` | Week number (zero-padded), for example `01` |
| `D` | Day of the year, for example `1` |
| `DDD` | Day of the year (zero-padded), for example `001` |
| `D60` | Day of the year (sexageismal), for example `57h` |
| `d` | Day of the month, for example `1` |
| `dd` | Day of the month (zero-padded), for example `01` |
| `h` | Hour (12-hour-cycle), for example `1` |
| `hh` | Hour (12-hour-cycle, zero-padded), for example `01` |
| `H` | Hour (24-hour-cycle), for example `1` |
| `HH` | Hour (24-hour-cycle, zero-padded), for example `01` |
| `m` | Minute, for example `1` |
| `mm` | Minute (zero-padded), for example `01` |
| `s` | Second, for example `1` |
| `ss` | Second (zero-padded), for example `01` |
| `t` | UNIX epoch seconds, for example `512969520` |
| `T` | UNIX epoch milliseconds, for example `51296952000` |
| `random` | A random 5-character string, for example `w9gwi` |
| `uuid` | A [random UUID][uuid] |
| `n` | Incremental count of posts (for type) in the same day, for example `1`. This token requires a [database to be configured](https://getindiekit.com/configuration/#application-mongodburl-url). |

### Post file tokens

The following tokens are only available for post files:

| Token | Description |
| :---- | :---------- |
| `slug` | Slug provided in `mp-slug` property, else slugified `name` property, else a 5 character string, for example `ycf9o` |

### Media file tokens

The following tokens are only available for media files:

| Token | Description |
| :---- | :---------- |
| `ext` | File extension of uploaded file, for example `jpg` |
| `filename` | Slugified name of uploaded file, for example `flower_1.jpg` for a file with the original name `Flower 1.jpg`. |

[uuid]: https://www.rfc-editor.org/rfc/rfc4122.html#section-4.4
