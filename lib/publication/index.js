module.exports = {
  getCategories: require(process.env.PWD + '/lib/publication/get-categories'),
  getFiles: require(process.env.PWD + '/lib/publication/get-files'),
  getPostTypeTemplate: require(process.env.PWD + '/lib/publication/get-post-type-template'),
  getPostTypes: require(process.env.PWD + '/lib/publication/get-post-types'),
  resolveConfig: require(process.env.PWD + '/lib/publication/resolve-config')
};
