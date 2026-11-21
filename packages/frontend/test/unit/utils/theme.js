import { strict as assert } from "node:assert";
import { describe, it, mock } from "node:test";

import {
  defaultThemeColor,
  formatHex,
  getBackgroundColor,
  getHue,
  getThemeColor,
  getThemeCustomProperties,
  parseHex,
} from "../../../lib/utils/theme.js";

describe("frontend/lib/utils/theme", () => {
  it("Parses hexadecimal colour", () => {
    assert.deepEqual(parseHex("#04f"), [0, 68, 255]);
    assert.deepEqual(parseHex("#0044FF"), [0, 68, 255]);
  });

  it("Throws error parsing invalid hexadecimal colour", () => {
    assert.throws(() => parseHex("blue"), {
      name: "TypeError",
      message: "Expected a hexadecimal colour, got “blue”",
    });
    assert.throws(() => parseHex("#04"), TypeError);
    assert.throws(() => parseHex("#0044ffcc"), TypeError);
    assert.throws(() => parseHex("#04f; color: red"), TypeError);
    // @ts-expect-error: Testing missing colour
    assert.throws(() => parseHex(), {
      message: "Expected a hexadecimal colour, got “undefined”",
    });
  });

  it("Formats colour as six-digit hexadecimal", () => {
    assert.equal(formatHex("#04F"), "#0044ff");
    assert.equal(formatHex("#0044ff"), "#0044ff");
  });

  it("Gets hue of a colour", () => {
    assert.equal(getHue("#f00"), 0);
    assert.equal(getHue("#0f0"), 120);
    assert.equal(getHue("#00f"), 240);
    assert.equal(getHue("#808080"), 0);
    assert.equal(getHue("#c54"), 8);
    assert.equal(getHue("#ff0001"), 0);
  });

  it("Returns background color as HSL", () => {
    assert.equal(getBackgroundColor("#f00"), "hsl(0, 5%, 99%)");
    assert.equal(getBackgroundColor("#f00", "dark"), "hsl(0, 5%, 10%)");
  });

  it("Returns theme color as HSL", () => {
    assert.equal(getThemeColor("#f00"), "hsl(0, 5%, 95%)");
    assert.equal(getThemeColor("#f00", "dark"), "hsl(0, 5%, 20%)");
  });

  it("Returns theme color as CSS custom properties", () => {
    assert.equal(
      getThemeCustomProperties("#f00"),
      `
--tint-neutral: 0 5%;
--color-primary: #ff0000;`,
    );
  });

  it("Uses default theme colour if colour isn’t valid", () => {
    const warn = mock.method(console, "warn", () => {});
    const expected = getThemeCustomProperties(defaultThemeColor);

    // @ts-expect-error: Testing missing colour
    assert.equal(getThemeCustomProperties(), expected);
    assert.equal(getThemeCustomProperties("blue"), expected);
    assert.equal(getThemeCustomProperties("blue"), expected);
    assert.equal(getThemeColor("blue"), getThemeColor(defaultThemeColor));
    assert.equal(
      // @ts-expect-error: Testing missing colour
      getBackgroundColor(undefined, "dark"),
      getBackgroundColor(defaultThemeColor, "dark"),
    );

    // Warns once for each invalid colour
    assert.equal(warn.mock.callCount(), 2);
    assert.match(
      String(warn.mock.calls[1].arguments[0]),
      /got “blue”\. Using default theme colour #04f instead\./,
    );

    warn.mock.restore();
  });
});
