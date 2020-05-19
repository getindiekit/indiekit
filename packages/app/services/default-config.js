/**
 * @exports defaultConfigService
 * @param {string} type Type of configuration
 * @returns {Promise|object} Default configuration object
 */
export default async type => {
  const module = await (
    await import(`../../config-${type}/index.js`)
  ).default;
  return module;
};
