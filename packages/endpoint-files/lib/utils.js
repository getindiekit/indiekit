/**
 * Get file name from a URL
 *
 * @param {string} url - File URL
 * @returns {string} File name
 */
export const getFileName = (url) => {
  const { pathname } = new URL(url);
  return pathname.split("/").pop();
};
