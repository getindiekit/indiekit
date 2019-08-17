module.exports = {
  create: require(process.env.PWD + '/lib/post/create'),
  delete: require(process.env.PWD + '/lib/post/delete'),
  undelete: require(process.env.PWD + '/lib/post/undelete')
};
