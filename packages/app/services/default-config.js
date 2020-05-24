/**
 * @param {string} type Type of configuration
 * @returns {Promise|object} Default configuration object
 */
export default async type => {
  const module = await (
    await import(`@indiekit/config-${type}`) // eslint-disable-line node/no-unsupported-features/es-syntax
  ).default;
  return module;
};
