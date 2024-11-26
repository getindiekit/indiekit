import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import Color from "color";

import {
  _getValidatedColor,
  getBackgroundColor,
  getThemeColor,
  getThemeCustomProperties,
} from "../../lib/utils/theme.js";

describe("frontend/lib/globals/icon", () => {
  it("Generates an accessible colour with sufficient contrast", () => {
    const result = _getValidatedColor({
      colorToChange: new Color("red"),
      mixingColor: new Color("blue"),
    });

    assert.equal(result.hex(), "#800080");
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
--color-primary: hsl(0, 100%, 50%);
--color-on-primary: hsl(0, 5%, 99%);
--color-primary-variant: hsl(0, 90%, 42.5%);
--color-primary-on-background-light: hsl(0, 84.2%, 30%);
--color-primary-on-background-dark: hsl(0, 89.3%, 92.3%);`,
    );
  });
});
