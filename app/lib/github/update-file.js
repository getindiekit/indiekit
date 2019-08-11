const config = require(process.env.PWD + '/app/config');
const utils = require(process.env.PWD + '/app/lib/utils');

const Octokit = require('@octokit/rest');

const octokit = new Octokit({
  auth: `token ${config.github.token}`
});

const getContents = require('./get-contents');

/**
 * Updates a file in a GitHub repository
 * @see {@link https://developer.github.com/v3/repos/contents/#update-a-file GitHub REST API v3: Update a file}
 *
 * @memberof store/github
 * @exports updateFile
 * @param {String} path Path to file
 * @param {String} content File content
 * @param {String} options Options
 * @return {Promise} GitHub HTTP response
 */
module.exports = async (path, content, options) => {
  path = utils.normalizePath(path);
  content = Buffer.from(content).toString('base64');

  const contents = await getContents(path);

  const updatedFile = await octokit.repos.createOrUpdateFile({
    owner: config.github.user,
    repo: config.github.repo,
    branch: config.github.branch,
    message: `${options.message}\nwith ${config.name}`,
    sha: contents.data.sha,
    path,
    content
  }).catch(error => {
    throw new Error(error.message);
  });

  return updatedFile;
};
