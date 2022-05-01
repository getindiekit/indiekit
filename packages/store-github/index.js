import process from "node:process";
import { Buffer } from "node:buffer";
import octokit from "@octokit/rest";

const defaults = {
  branch: "main",
  token: process.env.GITHUB_TOKEN,
};

/**
 * @typedef Response
 * @property {object} response HTTP response
 */
export const GithubStore = class {
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
   * @param {string} path Path to file
   * @param {string} content File content
   * @param {string} message Commit message
   * @returns {Promise<Response>} A promise to the response
   * @see {@link https://docs.github.com/en/free-pro-team@latest/rest/reference/repos#create-or-update-file-contents}
   */
  async createFile(path, content, message) {
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
  }

  /**
   * Read file in a repository
   *
   * @param {string} path Path to file
   * @returns {Promise<Response>} A promise to the response
   * @see {@link https://docs.github.com/en/free-pro-team@latest/rest/reference/repos#get-repository-content}
   */
  async readFile(path) {
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
  }

  /**
   * Update file in a repository
   *
   * @param {string} path Path to file
   * @param {string} content File content
   * @param {string} message Commit message
   * @returns {Promise<Response>} A promise to the response
   * @see {@link https://docs.github.com/en/free-pro-team@latest/rest/reference/repos#create-or-update-file-contents}
   */
  async updateFile(path, content, message) {
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
  }

  /**
   * Delete file in a repository
   *
   * @param {string} path Path to file
   * @param {string} message Commit message
   * @returns {Promise<Response>} A promise to the response
   * @see {@link https://docs.github.com/en/free-pro-team@latest/rest/reference/repos#delete-a-file}
   */
  async deleteFile(path, message) {
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
  }

  init(Indiekit) {
    Indiekit.addStore(this);
  }
};

export default GithubStore;
