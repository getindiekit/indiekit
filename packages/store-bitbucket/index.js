import { Buffer } from "node:buffer";
import path from "node:path";
import process from "node:process";

import { IndiekitError } from "@indiekit/error";

const defaults = {
  branch: "main",
  token: process.env.BITBUCKET_TOKEN,
};

export default class BitbucketStore {
  name = "Bitbucket store";

  /**
   * @param {object} [options] - Plug-in options
   * @param {string} [options.email] - Atlassian account email address
   * @param {string} [options.user] - Workspace (used in repository paths)
   * @param {string} [options.repo] - Repository
   * @param {string} [options.branch] - Branch
   * @param {string} [options.token] - API token
   */
  constructor(options = {}) {
    this.options = { ...defaults, ...options };
  }

  /**
   * @access private
   * @param {string} [requestPath] - Path appended to the repository’s `src` endpoint
   * @param {RequestInit} [requestOptions] - Fetch options
   * @returns {Promise<Response>} Fetch response
   * @see {@link https://developer.atlassian.com/cloud/bitbucket/rest/api-group-source/}
   */
  async #client(requestPath = "", requestOptions = {}) {
    const { user, repo, email, token } = this.options;
    const apiPath = path.join(
      "2.0/repositories",
      user,
      repo,
      "src",
      requestPath,
    );
    const url = new URL(apiPath, "https://api.bitbucket.org");
    const credentials = Buffer.from(`${email}:${token}`).toString("base64");

    try {
      const response = await fetch(url.href, {
        ...requestOptions,
        headers: {
          authorization: `Basic ${credentials}`,
          ...requestOptions.headers,
        },
      });

      if (!response.ok) {
        const body = await response.json();
        throw new Error(body.error.message);
      }

      return response;
    } catch (error) {
      throw new IndiekitError(error.message, {
        cause: error.cause,
        plugin: this.name,
        status: error.cause?.status,
      });
    }
  }

  get environment() {
    return ["BITBUCKET_TOKEN"];
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
        message: "What is your Bitbucket workspace?",
      },
      {
        type: "text",
        name: "repo",
        message: "Which repository is your publication stored on?",
      },
      {
        type: "text",
        name: "email",
        message:
          "What email address is associated with your Bitbucket account?",
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
   * Check if file exists
   * @param {string} filePath - Path to file
   * @returns {Promise<boolean>} File exists
   * @see {@link https://developer.atlassian.com/cloud/bitbucket/rest/api-group-source/#api-repositories-workspace-repo-slug-src-commit-path-get}
   */
  async fileExists(filePath) {
    try {
      await this.#client(`${this.options.branch}/${filePath}?format=meta`);

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
   * @returns {Promise<string|undefined>} Created file URL
   * @see {@link https://developer.atlassian.com/cloud/bitbucket/rest/api-group-source/#api-repositories-workspace-repo-slug-src-post}
   */
  async createFile(filePath, content, { message }) {
    const fileExists = await this.fileExists(filePath);
    if (fileExists) {
      return;
    }

    const body = new FormData();
    body.set(filePath, new Blob([content]), path.basename(filePath));
    body.set("branch", this.options.branch);
    body.set("message", message);

    await this.#client("", { method: "POST", body });

    const url = new URL(this.info.uid);
    url.pathname = path.join(url.pathname, filePath);

    return url.href;
  }

  /**
   * Read file
   * @param {string} filePath - Path to file
   * @returns {Promise<string>} File content
   * @see {@link https://developer.atlassian.com/cloud/bitbucket/rest/api-group-source/#api-repositories-workspace-repo-slug-src-commit-path-get}
   */
  async readFile(filePath) {
    const response = await this.#client(`${this.options.branch}/${filePath}`);

    return response.text();
  }

  /**
   * Update file
   * @param {string} filePath - Path to file
   * @param {string} content - File content
   * @param {object} options - Options
   * @param {string} options.message - Commit message
   * @param {string} [options.newPath] - New path to file
   * @returns {Promise<string>} Updated file URL
   * @see {@link https://developer.atlassian.com/cloud/bitbucket/rest/api-group-source/#api-repositories-workspace-repo-slug-src-post}
   */
  async updateFile(filePath, content, { message, newPath }) {
    const updateFilePath = newPath || filePath;

    const body = new FormData();
    body.set(
      updateFilePath,
      new Blob([content]),
      path.basename(updateFilePath),
    );
    body.set("branch", this.options.branch);
    body.set("message", message);

    await this.#client("", { method: "POST", body });

    if (newPath) {
      await this.deleteFile(filePath, { message });
    }

    const url = new URL(this.info.uid);
    url.pathname = path.join(url.pathname, updateFilePath);

    return url.href;
  }

  /**
   * Delete file
   * @param {string} filePath - Path to file
   * @param {object} options - Options
   * @param {string} options.message - Commit message
   * @returns {Promise<boolean>} File deleted
   * @see {@link https://developer.atlassian.com/cloud/bitbucket/rest/api-group-source/#api-repositories-workspace-repo-slug-src-post}
   */
  async deleteFile(filePath, { message }) {
    const body = new FormData();
    body.set("files", filePath);
    body.set("branch", this.options.branch);
    body.set("message", message);

    await this.#client("", { method: "POST", body });

    return true;
  }

  init(Indiekit) {
    Indiekit.addStore(this);
  }
}
