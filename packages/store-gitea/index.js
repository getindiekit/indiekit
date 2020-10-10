import got from 'got';

const defaults = {
  branch: 'master',
  instance: 'https://gitea.com'
};

/**
 * @typedef Response
 * @property {object} response HTTP response
 */
export const GiteaStore = class {
  constructor(options = {}) {
    this.id = 'gitea';
    this.name = 'Gitea';
    this.options = {...defaults, ...options};
  }

  gitea() {
    return got.extend({
      prefixUrl: `${this.options.instance}/api/v1/repos/${this.options.user}/${this.options.repo}/contents`,
      responseType: 'json',
      headers: {
        authorization: `token ${this.options.token}`
      }
    });
  }

  /**
   * Create file in a repository
   *
   * @param {string} path Path to file
   * @param {string} content File content
   * @param {string} message Commit message
   * @returns {Promise<Response>} HTTP response
   * @see https://gitea.com/api/swagger#/repository/repoCreateFile
   */
  async createFile(path, content, message) {
    content = Buffer.from(content).toString('base64');
    const response = await this.gitea().post(path, {
      json: {
        branch: this.options.branch,
        content,
        message
      }
    });
    return response;
  }

  /**
   * Read file in a repository
   *
   * @param {string} path Path to file
   * @returns {Promise<Response>} A promise to the response
   * @see https://gitea.com/api/swagger#/repository/repoGetContents
   */
  async readFile(path) {
    const request = await this.gitea().get(`${path}?ref=${this.options.branch}`, {
      resolveBodyOnly: true
    });
    const content = Buffer.from(request.content, 'base64').toString('utf8');
    return content;
  }

  /**
   * Update file in a repository
   *
   * @param {string} path Path to file
   * @param {string} content File content
   * @param {string} message Commit message
   * @returns {Promise<Response>} A promise to the response
   * @see https://gitea.com/api/swagger#/repository/repoUpdateFile
   */
  async updateFile(path, content, message) {
    const request = await this.gitea().get(`${path}?ref=${this.options.branch}`, {
      resolveBodyOnly: true
    }).catch(() => {
      return false;
    });

    content = Buffer.from(content).toString('base64');
    const response = await this.gitea().put(path, {
      json: {
        branch: this.options.branch,
        content,
        message,
        sha: (request) ? request.sha : false
      }
    });
    return response;
  }

  /**
   * Delete file in a repository
   *
   * @param {string} path Path to file
   * @param {string} message Commit message
   * @returns {Promise<Response>} A promise to the response
   * @see https://gitea.com/api/swagger#/repository/repoDeleteFile
   */
  async deleteFile(path, message) {
    const contents = await this.gitea().get(`${path}?ref=${this.options.branch}`, {
      resolveBodyOnly: true
    }).catch(() => {
      return false;
    });

    await this.gitea().delete(path, {
      json: {
        branch: this.options.branch,
        message,
        sha: (contents) ? contents.sha : false
      }
    });
    return true;
  }
};
