const {IndieKitError} = require(process.env.PWD + '/lib/errors');
const config = require(process.env.PWD + '/app/config');
const utils = require(process.env.PWD + '/lib/utils');

const {Octokit} = require('@octokit/rest');

const octokit = new Octokit({
  auth: `token ${config.github.token}`
});

/**
 * Reads contents of a file or directory in a repository.
 *
 * @exports getContents
 * @param {String} path Path to file
 * @return {String} Base64 decoded file contents
 * @return {Boolean} Returns false if contents cannot be found
 */
module.exports = async path => {
  path = utils.normalizePath(path);

  const contents = await octokit.repos.getContents({
    owner: config.github.user,
    repo: config.github.repo,
    ref: config.github.branch,
    path
  }).catch(error => {
    throw new IndieKitError({
      error: 'Octokit error',
      error_description: error.message
    });
  });

  contents.data.content = Buffer.from(contents.data.content, 'base64').toString('utf8');
  return contents;
};
