/**
 * Get, create and delete data at a specified path at configured GitHub repo.
 *
 * @module github
 */
module.exports = {
  createFile: require(process.env.PWD + '/app/lib/github/create-file'),
  deleteFile: require(process.env.PWD + '/app/lib/github/delete-file'),
  getContents: require(process.env.PWD + '/app/lib/github/get-contents'),
  updateFile: require(process.env.PWD + '/app/lib/github/update-file')
};
