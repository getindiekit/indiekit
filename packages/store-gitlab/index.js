import { Buffer } from "node:buffer";
import path from "node:path";
import process from "node:process";

// eslint-disable-next-line import/no-unresolved
import { Gitlab } from "@gitbeaker/rest";
import { IndiekitError } from "@indiekit/error";

const defaults = {
  branch: "main",
  instance: "https://gitlab.com",
  token: process.env.GITLAB_TOKEN,
};

/**
 * @typedef {import("@gitbeaker/rest").RepositoryFiles} RepositoryFiles
 */
export default class GitlabStore {
  name = "GitLab store";

  /**
   * @param {object} [options] - Plug-in options
   * @param {string} [options.instance] - Instance URL
   * @param {string} [options.projectId] - Project ID
   * @param {string} [options.user] - Username
   * @param {string} [options.repo] - Repository
   * @param {string} [options.branch] - Branch
   * @param {string} [options.token] - Access token
   */
  constructor(options = {}) {
    this.options = { ...defaults, ...options };
    this.projectId = options.projectId || `${options.user}/${options.repo}`;
  }

  get environment() {
    return ["GITLAB_TOKEN"];
  }

  get info() {
    const { instance, projectId, repo, user } = this.options;
    const path = projectId ? `/projects/${projectId}` : `/${user}/${repo}`;

    return {
      name: `${this.projectId} on GitLab`,
      uid: `${instance}${path}`,
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
   * @returns {object} GitLab interfaces
   */
  get #client() {
    const client = new Gitlab({
      host: this.options.instance,
      token: this.options.token,
    });

    return client;
  }

  /**
   * Check if file exists
   * @param {string} filePath - Path to file
   * @returns {Promise<boolean>} File exists
   * @see {@link https://docs.gitlab.com/ee/api/repository_files.html#get-file-from-repository}
   */
  async fileExists(filePath) {
    try {
      await this.#client.RepositoryFiles.show(
        this.projectId,
        filePath,
        this.options.branch,
      );

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
   * @see {@link https://docs.gitlab.com/ee/api/repository_files.html#create-new-file-in-repository}
   */
  async createFile(filePath, content, { message }) {
    try {
      const fileExists = await this.fileExists(filePath);
      if (fileExists) {
        return;
      }

      const createResponse = await this.#client.RepositoryFiles.create(
        this.projectId,
        filePath,
        this.options.branch,
        Buffer.from(content).toString("base64"),
        message,
        {
          encoding: "base64",
        },
      );

      const url = new URL(this.info.uid);
      url.pathname = path.join(url.pathname, createResponse.file_path);

      return url.href;
    } catch (error) {
      throw new IndiekitError(error.cause.description, {
        cause: error.cause,
        plugin: this.name,
        status: error.cause.response.status,
      });
    }
  }

  /**
   * Read file
   * @param {string} filePath - Path to file
   * @returns {Promise<string>} File content
   * @see {@link https://docs.gitlab.com/ee/api/repository_files.html#get-file-from-repository}
   */
  async readFile(filePath) {
    try {
      const readResponse = await this.#client.RepositoryFiles.showRaw(
        this.projectId,
        filePath,
        this.options.branch,
      );

      return readResponse.text();
    } catch (error) {
      throw new IndiekitError(error.cause.description, {
        cause: error.cause,
        plugin: this.name,
        status: error.cause.response.status,
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
   * @see {@link https://docs.gitlab.com/ee/api/repository_files.html#update-existing-file-in-repository}
   */
  async updateFile(filePath, content, { message, newPath }) {
    try {
      await this.#client.Commits.create(
        this.projectId,
        this.options.branch,
        message,
        [
          {
            action: "update",
            content: Buffer.from(content).toString("base64"),
            encoding: "base64",
            filePath,
          },
          ...(newPath
            ? [
                {
                  action: "move",
                  filePath: newPath,
                  previousPath: filePath,
                },
              ]
            : []),
        ],
      );

      const updateFilePath = newPath || filePath;
      const url = new URL(this.info.uid);
      url.pathname = path.join(url.pathname, updateFilePath);

      return url.href;
    } catch (error) {
      throw new IndiekitError(error.cause.description, {
        cause: error.cause,
        plugin: this.name,
        status: error.cause.response.status,
      });
    }
  }

  /**
   * Delete file
   * @param {string} filePath - Path to file
   * @param {object} options - Options
   * @param {string} options.message - Commit message
   * @returns {Promise<boolean>} File deleted
   * @see {@link https://docs.gitlab.com/ee/api/repository_files.html#delete-existing-file-in-repository}
   */
  async deleteFile(filePath, { message }) {
    try {
      await this.#client.RepositoryFiles.remove(
        this.projectId,
        filePath,
        this.options.branch,
        message,
      );

      return true;
    } catch (error) {
      throw new IndiekitError(error.cause.description, {
        cause: error.cause,
        plugin: this.name,
        status: error.cause.response.status,
      });
    }
  }

  init(Indiekit) {
    Indiekit.addStore(this);
  }
}
