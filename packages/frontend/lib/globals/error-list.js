import { slugify } from "@indiekit/util";

/**
 * Transform errors provided by express-validator into array that can be
 * consumed by the error summary component
 * @param {Record<string, FieldValidationError>} errorMap - Mapped error response from express-validator
 * @returns {Array<{ text: string, href: string }>} List of errors
 */
export const errorList = (errorMap) => {
  // For each field that has errors, return only the first error
  const errorList = [];
  const fieldsWithErrors = Object.entries(errorMap);
  for (const fieldError of fieldsWithErrors) {
    errorList.push({
      text: fieldError[1].msg,
      href: `#${slugify(fieldError[1].path, { decamelize: true })}`,
    });
  }

  return errorList;
};

/**
 * @import { FieldValidationError } from "express-validator"
 */
