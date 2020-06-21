import octokit from '@octokit/rest';
const {Octokit} = octokit;

/**
 * @typedef Response
 * @property {object} response HTTP response
 */

export const Store = class {
  constructor(options) {
    this.options = options;
    this.github = new Octokit({
      auth: `token ${this.options.token}`
    });
  }

  /**
   * Create file in a repository.
   *
   * @param {string} path Path to file
   * @param {string} content File content
   * @param {string} message Commit message
   * @returns {Promise<Response>} A promise to the response
   * @see https://developer.github.com/v3/repos/contents/#create-or-update-a-file
   */
  async createFile(path, content, message) {
    content = Buffer.from(content).toString('base64');
    const response = await this.github.repos.createOrUpdateFileContents({
      owner: this.options.user,
      repo: this.options.repo,
      branch: this.options.branch,
      message,
      path,
      content
    }).catch(error => {
      throw new Error(error);
    });

    return response;
  }

  /**
   * Delete file in a repository
   *
   * @param {string} path Path to file
   * @param {string} message Commit message
   * @returns {Promise<Response>} A promise to the response
   * @see https://developer.github.com/v3/repos/contents/#delete-a-file
   */
  async deleteFile(path, message) {
    const contents = await this.github.repos.getContent({
      owner: this.options.user,
      repo: this.options.repo,
      ref: this.options.branch,
      path
    }).catch(error => {
      throw new Error(error);
    });

    const response = await this.github.repos.deleteFile({
      owner: this.options.user,
      repo: this.options.repo,
      branch: this.options.branch,
      sha: contents.data.sha,
      message,
      path
    }).catch(error => {
      throw new Error(error);
    });

    return response;
  }

  /**
   * Read file in a repository
   *
   * @param {string} path Path to file
   * @returns {Promise<Response>} A promise to the response
   * @see https://developer.github.com/v3/repos/contents/#get-contents
   */
  async readFile(path) {
    const response = await this.github.repos.getContent({
      owner: this.options.user,
      repo: this.options.repo,
      ref: this.options.branch,
      path
    }).catch(error => {
      throw new Error(error);
    });

    const content = Buffer.from(response.data.content, 'base64').toString('utf8');
    return content;
  }

  /**
   * Update file in a repository
   *
   * @param {string} path Path to file
   * @param {string} content File content
   * @param {string} message Commit message
   * @returns {Promise<Response>} A promise to the response
   */
  async updateFile(path, content, message) {
    const contents = await this.github.repos.getContent({
      owner: this.options.user,
      repo: this.options.repo,
      ref: this.options.branch,
      path
    }).catch(() => {
      return false;
    });

    content = Buffer.from(content).toString('base64');
    const response = await this.github.repos.createOrUpdateFileContents({
      owner: this.options.user,
      repo: this.options.repo,
      branch: this.options.branch,
      sha: (contents) ? contents.data.sha : false,
      message,
      path,
      content
    }).catch(error => {
      throw new Error(error);
    });

    return response;
  }
};
