/**
 * Get publication configuration
 *
 * @module publication
 */
module.exports = {
  getCategories: require(process.env.PWD + '/app/lib/publication/get-categories'),
  getFiles: require(process.env.PWD + '/app/lib/publication/get-files'),
  getPostTypes: require(process.env.PWD + '/app/lib/publication/get-post-types'),
  resolveConfig: require(process.env.PWD + '/app/lib/publication/resolve-config')
};
