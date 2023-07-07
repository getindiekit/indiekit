import process from "node:process";
import bitbucket from "bitbucket";
import { IndiekitError } from "@indiekit/error";

const defaults = {
  branch: "main",
  password: process.env.BITBUCKET_PASSWORD,
};

/**
 * @typedef {import("bitbucket").APIClient} APIClient
 */
export default class BitbucketStore {
  /**
   * @param {object} [options] - Plugin options
   * @param {string} [options.user] - Username
   * @param {string} [options.repo] - Repository
   * @param {string} [options.branch] - Branch
   * @param {string} [options.password] - Password
   */
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
   * @access private
   * @returns {APIClient} Bitbucket client interface
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
   * @returns {Promise<boolean>} File created
   * @see {@link https://bitbucketjs.netlify.app/#api-repositories-repositories_createSrcFileCommit}
   */
  async createFile(path, content, message) {
    try {
      await this.#client.repositories.createSrcFileCommit({
        [path]: content,
        branch: this.options.branch,
        message,
        repo_slug: this.options.repo,
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
   * @returns {Promise<string>} File content
   * @see {@link https://bitbucketjs.netlify.app/#api-repositories-repositories_readSrc}
   */
  async readFile(path) {
    try {
      const response = await this.#client.repositories.readSrc({
        format: "rendered",
        commit: this.options.branch,
        path,
        repo_slug: this.options.repo,
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
   * @returns {Promise<boolean>} File updated
   * @see {@link https://bitbucketjs.netlify.app/#api-repositories-repositories_createSrcFileCommit}
   */
  async updateFile(path, content, message) {
    try {
      await this.#client.repositories.createSrcFileCommit({
        [path]: content,
        branch: this.options.branch,
        message,
        repo_slug: this.options.repo,
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
   * @returns {Promise<boolean>} File deleted
   * @see {@link https://bitbucketjs.netlify.app/#api-repositories-repositories_createSrcFileCommit}
   */
  async deleteFile(path, message) {
    try {
      await this.#client.repositories.createSrcFileCommit({
        branch: this.options.branch,
        files: path,
        message,
        repo_slug: this.options.repo,
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
