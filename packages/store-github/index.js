import process from "node:process";
import { Buffer } from "node:buffer";
import { IndiekitError } from "@indiekit/error";
import octokit from "@octokit/rest";

const defaults = {
  branch: "main",
  token: process.env.GITHUB_TOKEN,
};

/**
 * @typedef Response
 * @property {object} response - HTTP response
 */
export default class GithubStore {
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

  get client() {
    const { Octokit } = octokit;
    return new Octokit({
      auth: `token ${this.options.token}`,
    });
  }

  /**
   * Create file in a repository
   *
   * @param {string} path - Path to file
   * @param {string} content - File content
   * @param {string} message - Commit message
   * @returns {Promise<Response>} A promise to the response
   * @see {@link https://docs.github.com/en/rest/repos/contents#create-or-update-file-contents}
   */
  async createFile(path, content, message) {
    try {
      content = Buffer.from(content).toString("base64");
      const response = await this.client.repos.createOrUpdateFileContents({
        owner: this.options.user,
        repo: this.options.repo,
        branch: this.options.branch,
        message,
        path,
        content,
      });

      return response;
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
   *
   * @param {string} path - Path to file
   * @returns {Promise<Response>} A promise to the response
   * @see {@link https://docs.github.com/en/rest/repos/contents#get-repository-content}
   */
  async readFile(path) {
    try {
      const response = await this.client.repos.getContent({
        owner: this.options.user,
        repo: this.options.repo,
        ref: this.options.branch,
        path,
      });
      const content = Buffer.from(response.data.content, "base64").toString(
        "utf8"
      );

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
   *
   * @param {string} path - Path to file
   * @param {string} content - File content
   * @param {string} message - Commit message
   * @returns {Promise<Response>} A promise to the response
   * @see {@link https://docs.github.com/en/rest/repos/contents#create-or-update-file-contents}
   */
  async updateFile(path, content, message) {
    try {
      const contents = await this.client.repos
        .getContent({
          owner: this.options.user,
          repo: this.options.repo,
          ref: this.options.branch,
          path,
        })
        .catch(() => false);

      content = Buffer.from(content).toString("base64");
      const response = await this.client.repos.createOrUpdateFileContents({
        owner: this.options.user,
        repo: this.options.repo,
        branch: this.options.branch,
        sha: contents ? contents.data.sha : false,
        message,
        path,
        content,
      });

      return response;
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
   *
   * @param {string} path - Path to file
   * @param {string} message - Commit message
   * @returns {Promise<Response>} A promise to the response
   * @see {@link https://docs.github.com/en/rest/repos/contents#delete-a-file}
   */
  async deleteFile(path, message) {
    try {
      const contents = await this.client.repos.getContent({
        owner: this.options.user,
        repo: this.options.repo,
        ref: this.options.branch,
        path,
      });
      const response = await this.client.repos.deleteFile({
        owner: this.options.user,
        repo: this.options.repo,
        branch: this.options.branch,
        sha: contents.data.sha,
        message,
        path,
      });

      return response;
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
