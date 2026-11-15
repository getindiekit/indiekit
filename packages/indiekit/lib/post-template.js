/**
 * Return properties as JSON
 * @param {Jf2Properties} properties - JF2 properties
 * @returns {string} Properties as JSON
 */
const jsonPostTemplate = (properties) => {
  return JSON.stringify(properties);
};

/**
 * Get post template
 * @param {object} publication - Publication configuration
 * @param {IndiekitPublication["postTemplate"]} [publication.postTemplate] - Publication post template
 * @param {IndiekitPreset} [publication.preset] - Publication preset
 * @returns {IndiekitPublication["postTemplate"]} Post template rendering function
 */
export const getPostTemplate = ({ postTemplate, preset }) => {
  if (postTemplate) {
    return postTemplate;
  }

  if (preset?.postTemplate) {
    /**
     * Bind to preset so that `this` in `postTemplate`
     * function maintains context of its parent class
     */
    return preset.postTemplate.bind(preset);
  }

  return jsonPostTemplate;
};
