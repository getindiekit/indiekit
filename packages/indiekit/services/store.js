/**
 * Get store function
 *
 * @param {string} storeId Name of store
 * @param {string} storeOptions Store options
 * @returns {Promise|Function} Store function
 */
export const getStore = async (storeId, storeOptions) => {
  const {Store} = await (
    await import(`@indiekit/store-${storeId}`) // eslint-disable-line node/no-unsupported-features/es-syntax
  );

  return new Store(storeOptions);
};
