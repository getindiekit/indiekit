module.exports = {
  createFile: require(process.env.PWD + '/lib/github/create-file'),
  deleteFile: require(process.env.PWD + '/lib/github/delete-file'),
  getContents: require(process.env.PWD + '/lib/github/get-contents'),
  updateFile: require(process.env.PWD + '/lib/github/update-file')
};
