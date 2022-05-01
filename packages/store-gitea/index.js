import process from "node:process";
import { Buffer } from "node:buffer";
import got from "got";

const defaults = {
  branch: "main",
  instance: "https://gitea.com",
  token: process.env.GITEA_TOKEN,
};

/**
 * @typedef Response
 * @property {object} response HTTP response
 */
export const GiteaStore = class {
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

  get client() {
    return got.extend({
      headers: {
        authorization: `token ${this.options.token}`,
      },
      prefixUrl: `${this.options.instance}/api/v1/repos/${this.options.user}/${this.options.repo}/contents`,
      responseType: "json",
    });
  }

  /**
   * Create file in a repository
   *
   * @param {string} path Path to file
   * @param {string} content File content
   * @param {string} message Commit message
   * @returns {Promise<Response>} HTTP response
   * @see {@link https://gitea.com/api/swagger#/repository/repoCreateFile}
   */
  async createFile(path, content, message) {
    content = Buffer.from(content).toString("base64");
    const response = await this.client.post(path, {
      json: {
        branch: this.options.branch,
        content,
        message,
      },
    });
    return response;
  }

  /**
   * Read file in a repository
   *
   * @param {string} path Path to file
   * @returns {Promise<Response>} A promise to the response
   * @see {@link https://gitea.com/api/swagger#/repository/repoGetContents}
   */
  async readFile(path) {
    const { body } = await this.client.get(
      `${path}?ref=${this.options.branch}`
    );
    const content = Buffer.from(body.content, "base64").toString("utf8");
    return content;
  }

  /**
   * Update file in a repository
   *
   * @param {string} path Path to file
   * @param {string} content File content
   * @param {string} message Commit message
   * @returns {Promise<Response>} A promise to the response
   * @see {@link https://gitea.com/api/swagger#/repository/repoUpdateFile}
   */
  async updateFile(path, content, message) {
    const { body } = await this.client.get(
      `${path}?ref=${this.options.branch}`
    );

    content = Buffer.from(content).toString("base64");
    const response = await this.client.put(path, {
      json: {
        branch: this.options.branch,
        content,
        message,
        sha: body.sha,
      },
    });
    return response;
  }

  /**
   * Delete file in a repository
   *
   * @param {string} path Path to file
   * @param {string} message Commit message
   * @returns {Promise<Response>} A promise to the response
   * @see {@link https://gitea.com/api/swagger#/repository/repoDeleteFile}
   */
  async deleteFile(path, message) {
    const { body } = await this.client.get(
      `${path}?ref=${this.options.branch}`
    );

    const response = await this.client.delete(path, {
      json: {
        branch: this.options.branch,
        message,
        sha: body.sha,
      },
    });
    return response;
  }

  init(Indiekit) {
    Indiekit.addStore(this);
  }
};

export default GiteaStore;
