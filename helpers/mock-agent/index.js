import { setGlobalDispatcher } from "undici";

/**
 * @param {string} name - Base name of mock client file
 * @param {object} [options] - Client options
 */
export const mockAgent = async (name, options = {}) => {
  const { mockClient } = await import(`./${name}.js`);
  setGlobalDispatcher(mockClient(options));
};
