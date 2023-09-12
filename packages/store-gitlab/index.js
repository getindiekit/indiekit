import process from "node:process";
import { Buffer } from "node:buffer";
import { IndiekitError } from "@indiekit/error";
import { Commits, RepositoryFiles } from "@gitbeaker/rest";

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
   * @param {object} [options] - Plug-in options
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
    const commits = new Commits({
      host: this.options.instance,
      token: this.options.token,
    });

    const files = new RepositoryFiles({
      host: this.options.instance,
      token: this.options.token,
    });

    return { commits, files };
  }

  /**
   * Create file
   * @param {string} filePath - Path to file
   * @param {string} content - File content
   * @param {object} options - Options
   * @param {string} options.message - Commit message
   * @returns {Promise<boolean>} File created
   * @see {@link https://docs.gitlab.com/ee/api/repository_files.html#create-new-file-in-repository}
   */
  async createFile(filePath, content, { message }) {
    try {
      content = Buffer.from(content).toString("base64");
      await this.#client.files.create(
        this.projectId,
        filePath,
        this.options.branch,
        content,
        message,
        {
          encoding: "base64",
        },
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
   * Read file
   * @param {string} filePath - Path to file
   * @returns {Promise<string>} File content
   * @see {@link https://docs.gitlab.com/ee/api/repository_files.html#get-file-from-repository}
   */
  async readFile(filePath) {
    try {
      const response = await this.#client.files.showRaw(
        this.projectId,
        filePath,
        this.options.branch,
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
   * Update file
   * @param {string} filePath - Path to file
   * @param {string} content - File content
   * @param {object} options - Options
   * @param {string} options.message - Commit message
   * @param {string} options.newPath - New path to file
   * @returns {Promise<boolean>} File updated
   * @see {@link https://docs.gitlab.com/ee/api/repository_files.html#update-existing-file-in-repository}
   */
  async updateFile(filePath, content, { message, newPath }) {
    try {
      content = Buffer.from(content).toString("base64");

      await this.#client.commits.create(
        this.projectId,
        this.options.branch,
        message,
        [
          {
            action: "update",
            content,
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
   * Delete file
   * @param {string} filePath - Path to file
   * @param {object} options - Options
   * @param {string} options.message - Commit message
   * @returns {Promise<boolean>} File deleted
   * @see {@link https://docs.gitlab.com/ee/api/repository_files.html#delete-existing-file-in-repository}
   */
  async deleteFile(filePath, { message }) {
    try {
      await this.#client.files.remove(
        this.projectId,
        filePath,
        this.options.branch,
        message,
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
