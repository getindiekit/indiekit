/**
 * Return Micropub action to perform
 *
 * @param {string} scope Token scope
 * @param {string} action Requested Micropub action
 * @param {string} url URL of the object being acted on
 * @returns {string} Micropub action
 */
export const deriveAction = (scope, action, url) => {
  if (url) {
    if (!action) {
      throw new Error(`Need an action to perform on ${url}`);
    }

    if (scope === action) {
      return action; // Delete or update
    }

    if (scope === 'create') {
      return 'undelete';
    }
  } else if (scope === 'create') {
    return 'create';
  }

  throw new Error(`URL required to perform ${action} action`);
};
