import process from "node:process";
import { Buffer } from "node:buffer";
import { IndiekitError } from "@indiekit/error";

const defaults = {
  branch: "main",
  instance: "https://gitea.com",
  token: process.env.GITEA_TOKEN,
};

export default class GiteaStore {
  /**
   * @param {object} [options] - Plug-in options
   * @param {string} [options.instance] - Instance URL
   * @param {string} [options.user] - Username
   * @param {string} [options.repo] - Repository
   * @param {string} [options.branch] - Branch
   * @param {string} [options.token] - Access token
   */
  constructor(options = {}) {
    this.name = "Gitea store";
    this.options = { ...defaults, ...options };
  }

  get environment() {
    return ["GITEA_TOKEN"];
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
   * @access private
   * @param {string} filePath - Request path
   * @param {string} [method] - Request method
   * @param {object} [body] - Request body
   * @returns {Promise<Response>} Gitea client interface
   */
  async #client(filePath, method = "GET", body) {
    const { instance, user, repo, token } = this.options;
    const url = new URL(
      filePath,
      `${instance}/api/v1/repos/${user}/${repo}/contents/`,
    );

    const response = await fetch(url.href, {
      method,
      headers: {
        authorization: `token ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const body = await response.json();
      throw new Error(body.message);
    }

    return response;
  }

  /**
   * Create file
   * @param {string} filePath - Path to file
   * @param {string} content - File content
   * @param {object} options - Options
   * @param {string} options.message - Commit message
   * @returns {Promise<string>} Created file URL
   * @see {@link https://gitea.com/api/swagger#/repository/repoCreateFile}
   */
  async createFile(filePath, content, { message }) {
    try {
      const createResponse = await this.#client(filePath, "POST", {
        branch: this.options.branch,
        content: Buffer.from(content).toString("base64"),
        message,
      });

      const { commit } = await createResponse.json();

      return commit.html_url;
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
   * @returns {Promise<string>} File contents
   * @see {@link https://gitea.com/api/swagger#/repository/repoGetContents}
   */
  async readFile(filePath) {
    try {
      const readResponse = await this.#client(
        `${filePath}?ref=${this.options.branch}`,
      );
      const body = await readResponse.json();
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
   * Update file
   * @param {string} filePath - Path to file
   * @param {string} content - File content
   * @param {object} options - Options
   * @param {string} options.message - Commit message
   * @param {string} [options.newPath] - New path to file
   * @returns {Promise<string>} Updated file URL
   * @see {@link https://gitea.com/api/swagger#/repository/repoUpdateFile}
   */
  async updateFile(filePath, content, { message, newPath }) {
    try {
      const readResponse = await this.#client(
        `${filePath}?ref=${this.options.branch}`,
      );
      const { sha } = await readResponse.json();
      const updateFilePath = newPath || filePath;

      const updateResponse = await this.#client(updateFilePath, "PUT", {
        branch: this.options.branch,
        content: Buffer.from(content).toString("base64"),
        fromPath: filePath,
        message,
        sha,
      });

      const { commit } = await updateResponse.json();

      return commit.html_url;
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
   * @see {@link https://gitea.com/api/swagger#/repository/repoDeleteFile}
   */
  async deleteFile(filePath, { message }) {
    try {
      const readResponse = await this.#client(
        `${filePath}?ref=${this.options.branch}`,
      );
      const { sha } = await readResponse.json();

      await this.#client(filePath, "DELETE", {
        branch: this.options.branch,
        message,
        sha,
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
