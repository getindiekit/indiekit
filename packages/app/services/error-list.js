/**
 * Return errors from express-validator into format that can be used
 * in frontend templates.
 *
 * @param {object} errors Error response from express-validator
 * @returns {Array} List of errors
 */
export default function (errors) {
  const camelToSnakeCase = string =>
    string.replace(/[A-Z]/g, letter =>
      `-${letter.toLowerCase()}`);

  const errorList = errors.errors.map(error => ({
    text: error.msg,
    href: `#${camelToSnakeCase(error.param)}`
  }));

  return errorList;
}
