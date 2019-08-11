const config = require(process.env.PWD + '/app/config');
const utils = require(process.env.PWD + '/lib/utils');

const Octokit = require('@octokit/rest');

const octokit = new Octokit({
  auth: `token ${config.github.token}`
});

/**
 * Creates a new file in a GitHub repository
 * @see {@link https://developer.github.com/v3/repos/contents/#create-a-file GitHub REST API v3: Create a file}
 *
 * @memberof github
 * @exports createFile
 * @param {String} path Path to file
 * @param {String} content File content
 * @param {String} options Options
 * @return {Promise} GitHub HTTP response
 */
module.exports = async (path, content, options) => {
  path = utils.normalizePath(path);
  content = Buffer.from(content).toString('base64');

  const createdFile = await octokit.repos.createOrUpdateFile({
    owner: config.github.user,
    repo: config.github.repo,
    branch: config.github.branch,
    message: `${options.message}\nwith ${config.name}`,
    path,
    content
  }).catch(error => {
    throw new Error(error.message);
  });

  return createdFile;
};
