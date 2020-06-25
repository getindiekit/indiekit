/**
 * Decode form-encoded query parameter
 *
 * @param {string} string String to decode
 * @returns {string} Decoded string
 * @example decodeQueryParameter('foo+bar') => 'foo bar'
 * @example decodeQueryParameter('https%3A%2F%2Ffoo.bar') => 'https://foo.bar'
 */
export const decodeQueryParameter = string => {
  return decodeURIComponent(string.replace(/\+/g, ' '));
};

/**
 * Excerpt first n words from a string
 *
 * @param {string} string String to excerpt
 * @param {number} n Max number of words
 * @returns {string} Excerpt
 * @example excerpt('Foo bar baz', 2) => 'Foo bar'
 */
export const excerptString = (string, n) => {
  if (typeof string === 'string') {
    string = string.split(/\s+/).slice(0, n).join(' ');
    return string;
  }
};

/**
 * Get post type configuration for a given type
 *
 * @param {string} type Post type
 * @param {object} config Publication configuration
 * @returns {object} Post type configuration
 */
export const getPostTypeConfig = (type, config) => {
  return config['post-types'].find(
    item => item.type === type
  );
};

/**
 * Generate random alpha-numeric string, 5 characters long
 *
 * @returns {string} Alpha-numeric string
 * @example random() => 'b3dog'
 */
export const randomString = () => {
  return (Number(new Date())).toString(36).slice(-5);
};
