/**
 * Transform errors provided by express-validator into array that can be
 * consumed by the error summary component.
 *
 * @param {object} errorMap - Mapped error response from express-validator
 * @returns {Array} List of errors
 */
export const errorList = (errorMap) => {
  const camelToSnakeCase = (string) =>
    string.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);

  // For each field that has errors, return only the first error
  const errorList = [];
  const fieldsWithErrors = Object.entries(errorMap);
  for (const fieldError of fieldsWithErrors) {
    errorList.push({
      text: fieldError[1].msg,
      href: `#${camelToSnakeCase(fieldError[1].param)}`,
    });
  }

  return errorList;
};
