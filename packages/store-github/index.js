import process from "node:process";
import { Buffer } from "node:buffer";
import { IndiekitError } from "@indiekit/error";

const defaults = {
  baseUrl: "https://api.github.com",
  branch: "main",
  token: process.env.GITHUB_TOKEN,
};

export default class GithubStore {
  /**
   * @param {object} [options] - Plugin options
   * @param {string} [options.user] - Username
   * @param {string} [options.repo] - Repository
   * @param {string} [options.branch] - Branch
   * @param {string} [options.token] - Personal access token
   */
  constructor(options = {}) {
    this.id = "github";
    this.meta = import.meta;
    this.name = "GitHub store";
    this.options = { ...defaults, ...options };
  }

  get info() {
    const { repo, user } = this.options;

    return {
      name: `${user}/${repo} on GitHub`,
      uid: `https://github.com/${user}/${repo}`,
    };
  }

  get prompts() {
    return [
      {
        type: "text",
        name: "user",
        message: "What is your GitHub username?",
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
   * @param {string} path - Request path
   * @param {string} [method] - Request method
   * @param {object} [body] - Request body
   * @returns {Promise<Response>} GitHub client interface
   */
  async #client(path, method = "GET", body) {
    const { baseUrl, user, repo, token } = this.options;
    const url = new URL(path, `${baseUrl}/repos/${user}/${repo}/contents/`);

    try {
      const response = await fetch(url.href, {
        method,
        headers: {
          accept: "application/vnd.github+json",
          authorization: `token ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      return response;
    } catch (error) {
      throw new IndiekitError(error.message, {
        cause: error.cause,
        plugin: this.name,
        status: error.status,
      });
    }
  }

  /**
   * Create file in a repository
   * @param {string} path - Path to file
   * @param {string} content - File content
   * @param {string} message - Commit message
   * @returns {Promise<boolean>} File created
   * @see {@link https://docs.github.com/en/rest/repos/contents#create-or-update-file-contents}
   */
  async createFile(path, content, message) {
    content = Buffer.from(content).toString("base64");

    await this.#client(path, "PUT", {
      branch: this.options.branch,
      content,
      message,
    });

    return true;
  }

  /**
   * Read file in a repository
   * @param {string} path - Path to file
   * @returns {Promise<string>} File content
   * @see {@link https://docs.github.com/en/rest/repos/contents#get-repository-content}
   */
  async readFile(path) {
    const response = await this.#client(`${path}?ref=${this.options.branch}`);
    const { content } = await response.json();

    return Buffer.from(content, "base64").toString("utf8");
  }

  /**
   * Update file in a repository
   * @param {string} path - Path to file
   * @param {string} content - File content
   * @param {string} message - Commit message
   * @returns {Promise<boolean>} File updated
   * @see {@link https://docs.github.com/en/rest/repos/contents#create-or-update-file-contents}
   */
  async updateFile(path, content, message) {
    const response = await this.#client(`${path}?ref=${this.options.branch}`);
    const json = await response.json();
    content = Buffer.from(content).toString("base64");

    await this.#client(path, "PUT", {
      branch: this.options.branch,
      content,
      message,
      sha: json ? json.sha : false,
    });

    return true;
  }

  /**
   * Delete file in a repository
   * @param {string} path - Path to file
   * @param {string} message - Commit message
   * @returns {Promise<boolean>} File deleted
   * @see {@link https://docs.github.com/en/rest/repos/contents#delete-a-file}
   */
  async deleteFile(path, message) {
    const response = await this.#client(`${path}?ref=${this.options.branch}`);
    const json = await response.json();

    await this.#client(path, "DELETE", {
      branch: this.options.branch,
      sha: json.sha,
      message,
    });

    return true;
  }

  init(Indiekit) {
    Indiekit.addStore(this);
  }
}
