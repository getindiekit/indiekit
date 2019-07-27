/**
 * Get publication configuration
 *
 * @module publication
 */
module.exports = {
  getCategories: require(process.env.PWD + '/app/lib/publication/get-categories'),
  getPostTypes: require(process.env.PWD + '/app/lib/publication/get-post-types'),
  resolveConfig: require(process.env.PWD + '/app/lib/publication/resolve-config')
};
