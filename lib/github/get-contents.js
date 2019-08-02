const config = require(process.env.PWD + '/app/config');
const utils = require(process.env.PWD + '/lib/utils');

const Octokit = require('@octokit/rest');

const octokit = new Octokit({
  auth: `token ${config.github.token}`
});

/**
 * Reads content of a file or directory in a repository
 * @see {@link https://developer.github.com/v3/repos/contents/#get-contents GitHub REST API v3: Get Contents}
 *
 * @memberof github
 * @exports getContents
 * @param {String} path Path to file
 * @return {Promise} GitHub HTTP response
 */
module.exports = async path => {
  path = utils.normalizePath(path);

  const contents = await octokit.repos.getContents({
    owner: config.github.user,
    repo: config.github.repo,
    ref: config.github.branch,
    path
  }).catch(error => {
    throw new Error(error.message);
  });

  contents.data.content = Buffer.from(contents.data.content, 'base64').toString('utf8');
  return contents;
};
