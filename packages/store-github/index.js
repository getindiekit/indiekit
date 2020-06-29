import octokit from '@octokit/rest';

const defaults = {
  branch: 'master'
};

/**
 * @typedef Response
 * @property {object} response HTTP response
 */
export const GithubStore = class {
  constructor(options = {}) {
    this.id = 'github';
    this.name = 'GitHub';
    this.options = {...defaults, ...options};
  }

  github() {
    const {Octokit} = octokit;
    return new Octokit({
      auth: `token ${this.options.token}`
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
    try {
      content = Buffer.from(content).toString('base64');
      const response = await this.github().repos.createOrUpdateFileContents({
        owner: this.options.user,
        repo: this.options.repo,
        branch: this.options.branch,
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
      const response = await this.github().repos.getContent({
        owner: this.options.user,
        repo: this.options.repo,
        ref: this.options.branch,
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
    const contents = await this.github().repos.getContent({
      owner: this.options.user,
      repo: this.options.repo,
      ref: this.options.branch,
      path
    }).catch(() => {
      return false;
    });

    try {
      content = Buffer.from(content).toString('base64');
      const response = await this.github().repos.createOrUpdateFileContents({
        owner: this.options.user,
        repo: this.options.repo,
        branch: this.options.branch,
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
      const contents = await this.github().repos.getContent({
        owner: this.options.user,
        repo: this.options.repo,
        ref: this.options.branch,
        path
      });
      const response = await this.github().repos.deleteFile({
        owner: this.options.user,
        repo: this.options.repo,
        branch: this.options.branch,
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
