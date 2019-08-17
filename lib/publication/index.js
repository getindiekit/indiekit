module.exports = {
  getCategories: require(process.env.PWD + '/lib/publication/get-categories'),
  getFiles: require(process.env.PWD + '/lib/publication/get-files'),
  getPostTypeTemplate: require(process.env.PWD + '/lib/publication/get-post-type-template'),
  getPostTypes: require(process.env.PWD + '/lib/publication/get-post-types'),
  getPosts: require(process.env.PWD + '/lib/publication/get-posts'),
  resolveConfig: require(process.env.PWD + '/lib/publication/resolve-config')
};
