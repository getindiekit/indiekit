/**
 * @param {string} type Type of configuration
 * @returns {Promise|object} Default configuration object
 */
export default async type => {
  const module = await (
    await import(`@indiekit/config-${type}`)
  ).default;
  return module;
};
