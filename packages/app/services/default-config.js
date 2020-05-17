/**
 * @exports getDefaultConfig
 * @param {String} type Type of configuration
 * @returns {Promise|Object} Default configuration object
 */
export default async type => {
  const module = await (
    await import(`../../config-${type}/index.js`)
  ).default;
  return module;
};
