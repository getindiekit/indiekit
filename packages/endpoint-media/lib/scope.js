import HttpError from "http-errors";

/**
 * Check provided scope(s) satisfies required scope
 *
 * @param {object} providedScope Provided scope
 * @returns {boolean} True if provided scope includes `create` or `media`
 */
export const checkScope = (providedScope = "media") => {
  const hasScope =
    providedScope.includes("create") || providedScope.includes("media");

  if (hasScope) {
    return true;
  }

  throw new HttpError(
    401,
    "The scope of this token does not meet the requirements for this request",
    {
      error: "Insufficient scope",
      scope: "create media",
    }
  );
};
