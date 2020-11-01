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
   * @see https://docs.github.com/en/free-pro-team@latest/rest/reference/repos#create-or-update-file-contents
   */
  async createFile(path, content, message) {
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
  }

  /**
   * Read file in a repository
   *
   * @param {string} path Path to file
   * @returns {Promise<Response>} A promise to the response
   * @see https://docs.github.com/en/free-pro-team@latest/rest/reference/repos#get-repository-content
   */
  async readFile(path) {
    const response = await this.github().repos.getContent({
      owner: this.options.user,
      repo: this.options.repo,
      ref: this.options.branch,
      path
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
   * @see https://docs.github.com/en/free-pro-team@latest/rest/reference/repos#create-or-update-file-contents
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
  }

  /**
   * Delete file in a repository
   *
   * @param {string} path Path to file
   * @param {string} message Commit message
   * @returns {Promise<Response>} A promise to the response
   * @see https://docs.github.com/en/free-pro-team@latest/rest/reference/repos#delete-a-file
   */
  async deleteFile(path, message) {
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
  }
};
