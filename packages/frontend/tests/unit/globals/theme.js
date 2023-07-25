import test from "ava";
import Color from "color";
import {
  _getValidatedColor,
  themeCustomProperties,
} from "../../../lib/globals/theme.js";

test("Generates an accessible colour with sufficient contrast", (t) => {
  const result = _getValidatedColor({
    colorToChange: new Color("red"),
    mixingColor: new Color("blue"),
  });

  t.is(result.hex(), "#800080");
});

test("Returns theme color as CSS custom properties", (t) => {
  t.is(
    themeCustomProperties("#f00"),
    `
--tint-neutral: 0 5%;
--color-primary: hsl(0, 100%, 50%);
--color-on-primary: hsl(0, 5%, 99%);
--color-primary-variant: hsl(0, 90%, 42.5%);
--color-primary-on-background-light: hsl(0, 84.2%, 30%);
--color-primary-on-background-dark: hsl(0, 89.3%, 92.3%);`,
  );
});
