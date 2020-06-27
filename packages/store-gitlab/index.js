import gitbeaker from '@gitbeaker/node';
const {Gitlab} = gitbeaker;

/**
 * @typedef Response
 * @property {object} response HTTP response
 */

export const GitlabStore = class {
  constructor(options) {
    this.id = 'gitlab';
    this.name = 'GitLab';
    this._options = options;
    this._projectId = options.projectId || `${options.user}/${options.repo}`;
    this._gitlab = new Gitlab({
      host: options.instance || 'https://gitlab.com',
      token: options.token
    });
  }

  /**
   * Create file in a repository
   *
   * @param {string} path Path to file
   * @param {string} content File content
   * @param {string} message Commit message
   * @returns {Promise<Response>} HTTP response
   * @see https://docs.gitlab.com/ee/api/repository_files.html#create-new-file-in-repository
   */
  async createFile(path, content, message) {
    content = Buffer.from(content).toString('base64');

    try {
      const response = await this._gitlab.RepositoryFiles.create(
        this._projectId,
        path,
        this._options.branch,
        content,
        message, {
          encoding: 'base64'
        }
      );
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
   * @see https://docs.gitlab.com/ee/api/repository_files.html#get-file-from-repository
   */
  async readFile(path) {
    try {
      const response = await this._gitlab.RepositoryFiles.show(
        this._projectId,
        path,
        this._options.branch
      );
      const content = Buffer.from(response.content, 'base64').toString('utf8');
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
   * @see https://docs.gitlab.com/ee/api/repository_files.html#update-existing-file-in-repository
   */
  async updateFile(path, content, message) {
    content = Buffer.from(content).toString('base64');
    try {
      const response = await this._gitlab.RepositoryFiles.edit(
        this._projectId,
        path,
        this._options.branch,
        content,
        message, {
          encoding: 'base64'
        }
      );
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
   * @see https://docs.gitlab.com/ee/api/repository_files.html#delete-existing-file-in-repository
   */
  async deleteFile(path, message) {
    try {
      await this._gitlab.RepositoryFiles.remove(
        this._projectId,
        path,
        this._options.branch,
        message
      );
      return true;
    } catch (error) {
      throw new Error(error);
    }
  }
};
