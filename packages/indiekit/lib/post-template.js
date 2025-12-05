/**
 * Return properties as JSON
 * @param {object} properties - JF2 properties
 * @returns {string} Properties as JSON
 */
const jsonPostTemplate = (properties) => {
  return JSON.stringify(properties);
};

/**
 * Get post template
 * @param {object} publication - Publication configuration
 * @param {Function} [publication.postTemplate] - Publication post template
 * @param {object} [publication.preset] - Publication preset
 * @returns {Function} Post template rendering function
 */
export const getPostTemplate = ({ postTemplate, preset }) => {
  if (postTemplate) {
    return postTemplate;
  }

  if (preset?.postTemplate) {
    /*
     * Bind to preset so that `this` in `postTemplate`
     * function maintains context of its parent class
     */
    return preset.postTemplate.bind(preset);
  }

  return jsonPostTemplate;
};
