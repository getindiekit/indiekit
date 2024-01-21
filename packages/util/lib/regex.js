/**
 * Geographic point location by coordinates (ISO 6709)
 * @example 50.8211,-0.1452 => matches
 * @see {@link https://en.wikipedia.org/wiki/ISO_6709}
 */
export const ISO_6709_RE =
  /^(?<latitude>(?:-?|\+?)?\d+(?:\.\d+)?),\s*(?<longitude>(?:-?|\+?)?\d+(?:\.\d+)?)$/;
