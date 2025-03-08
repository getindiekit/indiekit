import path from "node:path";
import process from "node:process";

import { IndiekitError } from "@indiekit/error";
import { IndiekitStorePlugin } from "@indiekit/plugin";
// eslint-disable-next-line import/default
import bitbucket from "bitbucket";

const defaults = {
  branch: "main",
  password: process.env.BITBUCKET_PASSWORD,
};

/**
 * @typedef {import("bitbucket").APIClient} APIClient
 */
export default class BitbucketStorePlugin extends IndiekitStorePlugin {
  environment = ["BITBUCKET_PASSWORD"];

  name = "Bitbucket store";

  /**
   * @type {import('prompts').PromptObject[]}
   */
  prompts = [
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

  /**
   * @param {object} [options] - Plug-in options
   * @param {string} [options.user] - Username
   * @param {string} [options.repo] - Repository
   * @param {string} [options.branch] - Branch
   * @param {string} [options.password] - Password
   */
  constructor(options = {}) {
    super(options);

    this.options = { ...defaults, ...options };

    this.info = {
      name: `${this.options.user}/${this.options.repo} on Bitbucket`,
      uid: `https://bitbucket.org/${this.options.user}/${this.options.repo}`,
    };
  }

  /**
   * @access private
   * @returns {APIClient} Bitbucket client interface
   */
  get #client() {
    // eslint-disable-next-line import/no-named-as-default-member
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
   * Check if file exists
   * @param {string} filePath - Path to file
   * @returns {Promise<boolean>} File exists
   * @see {@link https://bitbucketjs.netlify.app/#api-repositories-repositories_readSrc}
   */
  async fileExists(filePath) {
    try {
      await this.#client.repositories.readSrc({
        format: "meta",
        commit: this.options.branch,
        path: filePath,
        repo_slug: this.options.repo,
        workspace: this.options.user,
      });

      return true;
    } catch {
      return false;
    }
  }

  /**
   * Create file
   * @param {string} filePath - Path to file
   * @param {string} content - File content
   * @param {object} options - Options
   * @param {string} options.message - Commit message
   * @returns {Promise<string>} Created file URL
   * @see {@link https://bitbucketjs.netlify.app/#api-repositories-repositories_createSrcFileCommit}
   */
  async createFile(filePath, content, { message }) {
    try {
      const fileExists = await this.fileExists(filePath);
      if (fileExists) {
        return;
      }

      await this.#client.repositories.createSrcFileCommit({
        [filePath]: content,
        branch: this.options.branch,
        message,
        repo_slug: this.options.repo,
        workspace: this.options.user,
      });

      const url = new URL(this.info.uid);
      url.pathname = path.join(url.pathname, filePath);

      return url.href;
    } catch (error) {
      throw new IndiekitError(error.message, {
        cause: error,
        plugin: this.name,
        status: error.status,
      });
    }
  }

  /**
   * Read file
   * @param {string} filePath - Path to file
   * @returns {Promise<string>} File content
   * @see {@link https://bitbucketjs.netlify.app/#api-repositories-repositories_readSrc}
   */
  async readFile(filePath) {
    try {
      const readResponse = await this.#client.repositories.readSrc({
        format: "rendered",
        commit: this.options.branch,
        path: filePath,
        repo_slug: this.options.repo,
        workspace: this.options.user,
      });
      const content = readResponse.data.raw;

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
   * Update file
   * @param {string} filePath - Path to file
   * @param {string} content - File content
   * @param {object} options - Options
   * @param {string} options.message - Commit message
   * @param {string} [options.newPath] - New path to file
   * @returns {Promise<string>} Updated file URL
   * @see {@link https://bitbucketjs.netlify.app/#api-repositories-repositories_createSrcFileCommit}
   */
  async updateFile(filePath, content, { message, newPath }) {
    try {
      const updateFilePath = newPath || filePath;

      await this.#client.repositories.createSrcFileCommit({
        [updateFilePath]: content,
        branch: this.options.branch,
        message,
        repo_slug: this.options.repo,
        workspace: this.options.user,
      });

      if (newPath) {
        await this.deleteFile(filePath, { message });
      }

      const url = new URL(this.info.uid);
      url.pathname = path.join(url.pathname, updateFilePath);

      return url.href;
    } catch (error) {
      throw new IndiekitError(error.message, {
        cause: error,
        plugin: this.name,
        status: error.status,
      });
    }
  }

  /**
   * Delete file
   * @param {string} filePath - Path to file
   * @param {object} options - Options
   * @param {string} options.message - Commit message
   * @returns {Promise<boolean>} File deleted
   * @see {@link https://bitbucketjs.netlify.app/#api-repositories-repositories_createSrcFileCommit}
   */
  async deleteFile(filePath, { message }) {
    try {
      await this.#client.repositories.createSrcFileCommit({
        branch: this.options.branch,
        files: filePath,
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
}
