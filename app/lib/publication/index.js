/**
 * Get publication configuration
 *
 * @module publication
 */
module.exports = {
  getPostTypes: require(process.env.PWD + '/app/lib/publication/get-post-types'),
  resolveConfig: require(process.env.PWD + '/app/lib/publication/resolve-config')
};
