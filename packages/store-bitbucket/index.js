import process from "node:process";
import bitbucket from "bitbucket";
import { IndiekitError } from "@indiekit/error";

const defaults = {
  branch: "main",
  password: process.env.BITBUCKET_PASSWORD,
};

/**
 * @typedef Response
 * @property {object} response - HTTP response
 */
export default class BitbucketStore {
  constructor(options = {}) {
    this.id = "bitbucket";
    this.meta = import.meta;
    this.name = "Bitbucket store";
    this.options = { ...defaults, ...options };
  }

  get info() {
    const { repo, user } = this.options;

    return {
      name: `${user}/${repo} on Bitbucket`,
      uid: `https://bitbucket.org/${user}/${repo}`,
    };
  }

  get prompts() {
    return [
      {
        type: "text",
        name: "user",
        message: "What is your Bitbucket username?",
      },
      {
        type: "text",
        name: "repo",
        message: "Which repository is your publication stored on?",
      },
      {
        type: "text",
        name: "branch",
        message: "Which branch are you publishing from?",
        initial: defaults.branch,
      },
    ];
  }

  /**
   * @private
   * @returns {Function} Bitbucket client interface
   */
  get #client() {
    const { Bitbucket } = bitbucket;
    return new Bitbucket({
      auth: {
        username: this.options.user,
        password: this.options.password,
      },
      notice: false,
    });
  }

  /**
   * Create file in a repository
   * @param {string} path - Path to file
   * @param {string} content - File content
   * @param {string} message - Commit message
   * @returns {Promise<Response>} A promise to the response
   * @see {@link https://bitbucketjs.netlify.app/#api-repositories-repositories_createSrcFileCommit}
   */
  async createFile(path, content, message) {
    try {
      await this.#client.repositories.createSrcFileCommit({
        [path]: content,
        branch: this.options.branch,
        message,
        repo_slug: this.options.repo, // eslint-disable-line camelcase
        workspace: this.options.user,
      });

      return true;
    } catch (error) {
      throw new IndiekitError(error.message, {
        cause: error,
        plugin: this.name,
        status: error.status,
      });
    }
  }

  /**
   * Read file in a repository
   * @param {string} path - Path to file
   * @returns {Promise<Response>} A promise to the response
   * @see {@link https://bitbucketjs.netlify.app/#api-repositories-repositories_readSrc}
   */
  async readFile(path) {
    try {
      const response = await this.#client.repositories.readSrc({
        format: "rendered",
        commit: this.options.branch,
        path,
        repo_slug: this.options.repo, // eslint-disable-line camelcase
        workspace: this.options.user,
      });
      const content = response.data.raw;

      return content;
    } catch (error) {
      throw new IndiekitError(error.message, {
        cause: error,
        plugin: this.name,
        status: error.status,
      });
    }
  }

  /**
   * Update file in a repository
   * @param {string} path - Path to file
   * @param {string} content - File content
   * @param {string} message - Commit message
   * @returns {Promise<Response>} A promise to the response
   * @see {@link https://bitbucketjs.netlify.app/#api-repositories-repositories_createSrcFileCommit}
   */
  async updateFile(path, content, message) {
    try {
      await this.#client.repositories.createSrcFileCommit({
        [path]: content,
        branch: this.options.branch,
        message,
        repo_slug: this.options.repo, // eslint-disable-line camelcase
        workspace: this.options.user,
      });

      return true;
    } catch (error) {
      throw new IndiekitError(error.message, {
        cause: error,
        plugin: this.name,
        status: error.status,
      });
    }
  }

  /**
   * Delete file in a repository
   * @param {string} path - Path to file
   * @param {string} message - Commit message
   * @returns {Promise<Response>} A promise to the response
   * @see {@link https://bitbucketjs.netlify.app/#api-repositories-repositories_createSrcFileCommit}
   */
  async deleteFile(path, message) {
    try {
      await this.#client.repositories.createSrcFileCommit({
        branch: this.options.branch,
        files: path,
        message,
        repo_slug: this.options.repo, // eslint-disable-line camelcase
        workspace: this.options.user,
      });

      return true;
    } catch (error) {
      throw new IndiekitError(error.message, {
        cause: error,
        plugin: this.name,
        status: error.status,
      });
    }
  }

  init(Indiekit) {
    Indiekit.addStore(this);
  }
}
