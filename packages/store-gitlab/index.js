import process from "node:process";
import { Buffer } from "node:buffer";
import { IndiekitError } from "@indiekit/error";
import { RepositoryFiles } from "@gitbeaker/rest";

const defaults = {
  branch: "main",
  instance: "https://gitlab.com",
  token: process.env.GITLAB_TOKEN,
};

/**
 * @typedef {import("@gitbeaker/rest").RepositoryFiles} RepositoryFiles
 */
export default class GitlabStore {
  /**
   * @param {object} [options] - Plugin options
   * @param {string} [options.instance] - Instance URL
   * @param {string} [options.projectId] - Project ID
   * @param {string} [options.user] - Username
   * @param {string} [options.repo] - Repository
   * @param {string} [options.branch] - Branch
   * @param {string} [options.token] - Access token
   */
  constructor(options = {}) {
    this.id = "gitlab";
    this.meta = import.meta;
    this.name = "GitLab store";
    this.options = { ...defaults, ...options };
    this.projectId = options.projectId || `${options.user}/${options.repo}`;
  }

  get info() {
    const { instance, repo, user } = this.options;

    return {
      name: `${this.projectId} on GitLab`,
      uid: `${instance}/${user}/${repo}`,
    };
  }

  get prompts() {
    return [
      {
        type: "text",
        name: "instance",
        message: "Where is GitLab hosted?",
        description: "i.e. https://gitlab.com",
        initial: defaults.instance,
      },
      {
        type: "text",
        name: "user",
        message: "What is your GitLab username?",
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
   * @returns {RepositoryFiles} GitLab repository files interface
   */
  get #client() {
    return new RepositoryFiles({
      host: this.options.instance,
      token: this.options.token,
    });
  }

  /**
   * Create file in a repository
   * @param {string} path - Path to file
   * @param {string} content - File content
   * @param {string} message - Commit message
   * @returns {Promise<boolean>} File created
   * @see {@link https://docs.gitlab.com/ee/api/repository_files.html#create-new-file-in-repository}
   */
  async createFile(path, content, message) {
    try {
      content = Buffer.from(content).toString("base64");
      await this.#client.create(
        this.projectId,
        path,
        this.options.branch,
        content,
        message,
        {
          encoding: "base64",
        }
      );

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
   * @see {@link https://docs.gitlab.com/ee/api/repository_files.html#get-file-from-repository}
   */
  async readFile(path) {
    try {
      const response = await this.#client.showRaw(
        this.projectId,
        path,
        this.options.branch
      );

      return response.text();
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
   * @see {@link https://docs.gitlab.com/ee/api/repository_files.html#update-existing-file-in-repository}
   */
  async updateFile(path, content, message) {
    try {
      content = Buffer.from(content).toString("base64");
      await this.#client.edit(
        this.projectId,
        path,
        this.options.branch,
        content,
        message,
        {
          encoding: "base64",
        }
      );

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
   * @see {@link https://docs.gitlab.com/ee/api/repository_files.html#delete-existing-file-in-repository}
   */
  async deleteFile(path, message) {
    try {
      await this.#client.remove(
        this.projectId,
        path,
        this.options.branch,
        message
      );

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
