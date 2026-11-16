/**
 * Only validate a field if the request body has a value for another field
 * @param {string} path - Path to the other field, i.e. `featured.url`
 * @returns {CustomValidator} Validator
 */
export const hasValue =
  (path) =>
  (value, { req }) => {
    let current = req.body;

    for (const key of path.split(".")) {
      current = current?.[key];
    }

    return current;
  };

/**
 * Check if field is required
 * @param {Meta["req"]} request - Request
 * @param {string} field - Field name
 * @returns {boolean} Field is required
 */
export const isRequired = (request, field) => {
  const { postTypes } = request.app.locals.publication;
  const postTypeConfig = postTypes[request.body.postType];

  return !!postTypeConfig["required-properties"]?.includes(field);
};

/**
 * Only validate a field if the post type requires it
 * @param {string} field - Field name
 * @returns {CustomValidator} Validator
 */
export const isRequiredField =
  (field) =>
  (value, { req }) =>
    isRequired(req, field);

/**
 * Localised validation error message
 * @param {string} key - Locale string key
 * @param {...string} parameters - Values to substitute
 * @returns {FieldMessageFactory} Error message
 */
export const localisedMessage =
  (key, ...parameters) =>
  (value, { req }) =>
    req.__(key, ...parameters);

/**
 * @import { CustomValidator, FieldMessageFactory, Meta } from "express-validator"
 */
