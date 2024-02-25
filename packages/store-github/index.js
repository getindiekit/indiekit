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
   * @param {object} [options] - Plug-in options
   * @param {string} [options.user] - Username
   * @param {string} [options.repo] - Repository
   * @param {string} [options.branch] - Branch
   * @param {string} [options.token] - Personal access token
   */
  constructor(options = {}) {
    this.id = "github";
    this.name = "GitHub store";
    this.options = { ...defaults, ...options };
  }

  get environment() {
    return ["GITHUB_TOKEN"];
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
   * @param {string} filePath - Request path
   * @param {string} [method] - Request method
   * @param {object} [body] - Request body
   * @returns {Promise<Response>} GitHub client interface
   */
  async #client(filePath, method = "GET", body) {
    const { baseUrl, user, repo, token } = this.options;
    const url = new URL(filePath, `${baseUrl}/repos/${user}/${repo}/contents/`);

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
   * Create file
   * @param {string} filePath - Path to file
   * @param {string} content - File content
   * @param {object} options - Options
   * @param {string} options.message - Commit message
   * @returns {Promise<string>} Created file URL
   * @see {@link https://docs.github.com/en/rest/repos/contents#create-or-update-file-contents}
   */
  async createFile(filePath, content, { message }) {
    const createResponse = await this.#client(filePath, "PUT", {
      branch: this.options.branch,
      content: Buffer.from(content).toString("base64"),
      message,
    });

    const file = await createResponse.json();

    return file.content.html_url;
  }

  /**
   * Read file
   * @param {string} filePath - Path to file
   * @returns {Promise<string>} File content
   * @see {@link https://docs.github.com/en/rest/repos/contents#get-repository-content}
   */
  async readFile(filePath) {
    const readResponse = await this.#client(
      `${filePath}?ref=${this.options.branch}`,
    );
    const { content } = await readResponse.json();

    return Buffer.from(content, "base64").toString("utf8");
  }

  /**
   * Update file
   * @param {string} filePath - Path to file
   * @param {string} content - File content
   * @param {object} options - Options
   * @param {string} options.message - Commit message
   * @param {string} [options.newPath] - New path to file
   * @returns {Promise<string>} Updated file URL
   * @see {@link https://docs.github.com/en/rest/repos/contents#create-or-update-file-contents}
   */
  async updateFile(filePath, content, { message, newPath }) {
    const readResponse = await this.#client(
      `${filePath}?ref=${this.options.branch}`,
    );
    const { sha } = await readResponse.json();
    const updateFilePath = newPath || filePath;
    const updateResponse = await this.#client(updateFilePath, "PUT", {
      branch: this.options.branch,
      content: Buffer.from(content).toString("base64"),
      message,
      sha: sha || false,
    });

    const file = await updateResponse.json();

    if (newPath) {
      await this.deleteFile(filePath, { message });
    }

    return file.content.html_url;
  }

  /**
   * Delete file
   * @param {string} filePath - Path to file
   * @param {object} options - Options
   * @param {string} options.message - Commit message
   * @returns {Promise<boolean>} File deleted
   * @see {@link https://docs.github.com/en/rest/repos/contents#delete-a-file}
   */
  async deleteFile(filePath, { message }) {
    const readResponse = await this.#client(
      `${filePath}?ref=${this.options.branch}`,
    );
    const { sha } = await readResponse.json();

    await this.#client(filePath, "DELETE", {
      branch: this.options.branch,
      sha,
      message,
    });

    return true;
  }

  init(Indiekit) {
    Indiekit.addStore(this);
  }
}
