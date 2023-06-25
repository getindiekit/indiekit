import Color from "color";

/**
 * @typedef Color
 * @property {object} color - Color object
 */

/**
 * Generate an accessible colour with sufficient contrast
 * @see {@link https://medium.com/confrere/e735c3f2f45e}
 * @param {object} options - Options
 * @param {Color} options.colorToChange - Original colour
 * @param {Color} [options.colorToValidate] - Color to validate against
 * @param {number} [options.minimumContrastRatio] - Minimum contrast ratio
 * @param {Color} options.mixingColor - Color to mix with original
 * @param {number} options.mixingAmount - Amount of color to mix with original
 * @param {number} [options.tries] - Tries
 * @param {number} [options.maxTries] - Maximum tries
 * @returns {string} RGB hex code, i.e. "#7f1de4"
 */
export const _getValidatedColor = ({
  colorToChange,
  colorToValidate = new Color("white"),
  minimumContrastRatio = 4.5,
  mixingColor,
  mixingAmount,
  tries = 0,
  maxTries = 8,
}) => {
  const newColor = colorToChange.mix(mixingColor, mixingAmount);
  if (
    newColor.contrast(colorToValidate) < minimumContrastRatio &&
    tries < maxTries
  ) {
    return _getValidatedColor({
      colorToChange: newColor,
      mixingColor,
      mixingAmount: 0.15,
      tries: ++tries,
    });
  }

  return newColor;
};

/**
 * Return theme color as CSS custom properties
 * @param {string} string - Color (as hexadecimal)
 * @returns {string} CSS custom properties
 */
export const themeCustomProperties = (string) => {
  const primary = new Color(string).hsl().round();
  const primaryHue = primary.hue();
  const primarySaturation = 5;

  // Calculate neutral lightest and darkest hues used in custom properties
  const neutral99 = new Color({ h: primaryHue, s: primarySaturation, l: 99 });
  const neutral10 = new Color({ h: primaryHue, s: primarySaturation, l: 10 });

  // Generate a darker variant of primary colour
  const primaryVariant = primary.darken(0.15).desaturate(0.1);

  // Switch neutral colour used on primary background based on lightness
  const onPrimary = primary.isLight() ? neutral99 : neutral99;

  // Generate a shade of primary colour that contrasts with background
  const primaryOnBackgroundLight = new Color(
    _getValidatedColor({
      colorToChange: primary,
      mixingColor: neutral10,
    })
  ).hsl();
  const primaryOnBackgroundDark = new Color(
    _getValidatedColor({
      colorToChange: primary,
      mixingColor: neutral99,
    })
  ).hsl();

  return `
--tint-neutral: ${primaryHue} ${primarySaturation}%;
--color-primary: ${primary};
--color-on-primary: ${onPrimary};
--color-primary-variant: ${primaryVariant};
--color-primary-on-background-light: ${primaryOnBackgroundLight};
--color-primary-on-background-dark: ${primaryOnBackgroundDark};`;
};
