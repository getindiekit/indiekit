import process from "node:process";
import { Buffer } from "node:buffer";
import { IndiekitError } from "@indiekit/error";
import { fetch } from "undici";

const defaults = {
  branch: "main",
  instance: "https://gitea.com",
  token: process.env.GITEA_TOKEN,
};

/**
 * @typedef Response
 * @property {object} response - HTTP response
 */
export default class GiteaStore {
  constructor(options = {}) {
    this.id = "gitea";
    this.meta = import.meta;
    this.name = "Gitea store";
    this.options = { ...defaults, ...options };
  }

  get info() {
    const { instance, repo, user } = this.options;

    return {
      name: `${user}/${repo} on Gitea`,
      uid: `${instance}/${user}/${repo}`,
    };
  }

  get prompts() {
    return [
      {
        type: "text",
        name: "instance",
        message: "Where is Gitea hosted?",
        description: "i.e. https://gitea.com",
        initial: defaults.instance,
      },
      {
        type: "text",
        name: "user",
        message: "What is your Gitea username?",
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
   * @param {string} path - Request path
   * @param {string} [method=GET] - Request method
   * @param {object} [body] - Request body
   * @returns {Function} Gitea client interface
   */
  async #client(path, method = "GET", body) {
    const { instance, user, repo } = this.options;
    const url = new URL(
      path,
      `${instance}/api/v1/repos/${user}/${repo}/contents/`
    );

    const response = await fetch(url.href, {
      method,
      headers: {
        authorization: `token ${this.options.token}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    return response;
  }

  /**
   * Create file in a repository
   * @param {string} path - Path to file
   * @param {string} content - File content
   * @param {string} message - Commit message
   * @returns {Promise<Response>} HTTP response
   * @see {@link https://gitea.com/api/swagger#/repository/repoCreateFile}
   */
  async createFile(path, content, message) {
    try {
      content = Buffer.from(content).toString("base64");
      await this.#client(path, "POST", {
        branch: this.options.branch,
        content,
        message,
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
   * @see {@link https://gitea.com/api/swagger#/repository/repoGetContents}
   */
  async readFile(path) {
    try {
      const response = await this.#client(`${path}?ref=${this.options.branch}`);
      const body = await response.json();
      const content = Buffer.from(body.content, "base64").toString("utf8");

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
   * @see {@link https://gitea.com/api/swagger#/repository/repoUpdateFile}
   */
  async updateFile(path, content, message) {
    try {
      content = Buffer.from(content).toString("base64");
      const response = await this.#client(`${path}?ref=${this.options.branch}`);
      const body = await response.json();
      await this.#client(path, "PUT", {
        branch: this.options.branch,
        content,
        message,
        sha: body.sha,
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
   * @see {@link https://gitea.com/api/swagger#/repository/repoDeleteFile}
   */
  async deleteFile(path, message) {
    try {
      const response = await this.#client(`${path}?ref=${this.options.branch}`);
      const body = await response.json();
      await this.#client(path, "DELETE", {
        branch: this.options.branch,
        message,
        sha: body.sha,
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
