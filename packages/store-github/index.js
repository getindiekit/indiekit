import octokit from '@octokit/rest';
const {Octokit} = octokit;

/**
 * @typedef Response
 * @property {object} response HTTP response
 */

export const GithubStore = class {
  constructor(options) {
    this.id = 'github';
    this.name = 'GitHub';
    this._options = options;
    this._github = new Octokit({
      auth: `token ${options.token}`
    });
  }

  /**
   * Create file in a repository
   *
   * @param {string} path Path to file
   * @param {string} content File content
   * @param {string} message Commit message
   * @returns {Promise<Response>} A promise to the response
   * @see https://developer.github.com/v3/repos/contents/#create-or-update-a-file
   */
  async createFile(path, content, message) {
    content = Buffer.from(content).toString('base64');
    try {
      const response = await this._github.repos.createOrUpdateFileContents({
        owner: this._options.user,
        repo: this._options.repo,
        branch: this._options.branch || 'master',
        message,
        path,
        content
      });
      return response;
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * Read file in a repository
   *
   * @param {string} path Path to file
   * @returns {Promise<Response>} A promise to the response
   * @see https://developer.github.com/v3/repos/contents/#get-contents
   */
  async readFile(path) {
    try {
      const response = await this._github.repos.getContent({
        owner: this._options.user,
        repo: this._options.repo,
        ref: this._options.branch || 'master',
        path
      });
      const content = Buffer.from(response.data.content, 'base64').toString('utf8');
      return content;
    } catch (error) {
      throw new Error(error);
    }
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
    const contents = await this._github.repos.getContent({
      owner: this._options.user,
      repo: this._options.repo,
      ref: this._options.branch || 'master',
      path
    }).catch(() => {
      return false;
    });

    content = Buffer.from(content).toString('base64');
    try {
      const response = await this._github.repos.createOrUpdateFileContents({
        owner: this._options.user,
        repo: this._options.repo,
        branch: this._options.branch || 'master',
        sha: (contents) ? contents.data.sha : false,
        message,
        path,
        content
      });
      return response;
    } catch (error) {
      throw new Error(error);
    }
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
    try {
      const contents = await this._github.repos.getContent({
        owner: this._options.user,
        repo: this._options.repo,
        ref: this._options.branch || 'master',
        path
      });
      const response = await this._github.repos.deleteFile({
        owner: this._options.user,
        repo: this._options.repo,
        branch: this._options.branch || 'master',
        sha: contents.data.sha,
        message,
        path
      });
      return response;
    } catch (error) {
      throw new Error(error);
    }
  }
};
