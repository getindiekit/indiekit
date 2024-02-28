/**
 * Check if field is required
 * @param {import("express").Request} request - Request
 * @param {string} field - Field name
 * @returns {boolean} Field is required
 */
export const isRequired = (request, field) => {
  const { postTypes } = request.app.locals.publication;
  const postTypeConfig = postTypes[request.body.postType];

  return postTypeConfig["required-properties"].includes(field);
};
