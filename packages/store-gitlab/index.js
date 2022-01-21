import {Buffer} from 'node:buffer';
import gitbeaker from '@gitbeaker/node';

const defaults = {
  branch: 'main',
  instance: 'https://gitlab.com',
};

/**
 * @typedef Response
 * @property {object} response HTTP response
 */
export const GitlabStore = class {
  constructor(options = {}) {
    this.id = 'gitlab';
    this.name = 'GitLab store';
    this.options = {...defaults, ...options};
    this.projectId = options.projectId || `${options.user}/${options.repo}`;
  }

  get info() {
    const {instance, repo, user} = this.options;

    return {
      name: `${this.projectId} on GitLab`,
      uid: `${instance}/${user}/${repo}`,
    };
  }

  get client() {
    const {Gitlab} = gitbeaker;
    return new Gitlab({
      host: this.options.instance,
      token: this.options.token,
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
    const response = await this.client.RepositoryFiles.create(
      this.projectId,
      path,
      this.options.branch,
      content,
      message, {
        encoding: 'base64',
      },
    );
    return response;
  }

  /**
   * Read file in a repository
   *
   * @param {string} path Path to file
   * @returns {Promise<Response>} A promise to the response
   * @see https://docs.gitlab.com/ee/api/repository_files.html#get-file-from-repository
   */
  async readFile(path) {
    const response = await this.client.RepositoryFiles.show(
      this.projectId,
      path,
      this.options.branch,
    );
    const content = Buffer.from(response.content, 'base64').toString('utf8');
    return content;
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
    const response = await this.client.RepositoryFiles.edit(
      this.projectId,
      path,
      this.options.branch,
      content,
      message, {
        encoding: 'base64',
      },
    );
    return response;
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
    await this.client.RepositoryFiles.remove(
      this.projectId,
      path,
      this.options.branch,
      message,
    );
    return true;
  }
};

export default GitlabStore;
