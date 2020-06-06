/**
 * Get host function
 *
 * @param {string} hostId Name of host
 * @param {string} hostOptions Host options
 * @returns {Promise|Function} Host function
 */
export const getHost = async (hostId, hostOptions) => {
  const {Host} = await (
    await import(`@indiekit/host-${hostId}`) // eslint-disable-line node/no-unsupported-features/es-syntax
  );

  return new Host(hostOptions);
};
