/**
 * Get item `id` for radio/checkbox
 * @param {string} id - Item `id`
 * @param {string} idPrefix - Prefix for each item `id` if no `id` specified
 * @param {object} loop - Nunjucks for loop object
 * @returns {string} Item `id`
 */
export const itemId = (id, idPrefix, loop) => {
  // If user explicitly sets `id`, use this instead of `idPrefix`
  if (id) {
    return id;
  }

  // The first `id` should not have a number suffix so
  // easier to link to from the error summary component
  return loop.first ? idPrefix : `${idPrefix}-${loop.index}`;
};
