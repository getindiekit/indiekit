import { Buffer } from "node:buffer";
import path from "node:path";
import process from "node:process";

import { IndiekitError } from "@indiekit/error";
import makeDebug from "debug";

const debug = makeDebug(`indiekit-store:github`);

const defaults = {
  baseUrl: "https://api.github.com",
  branch: "main",
  token: process.env.GITHUB_TOKEN,
};

const crudErrorMessage = ({ error, operation, filePath, branch, repo }) => {
  const summary = `Could not ${operation} file ${filePath} in repo ${repo}, branch ${branch}`;

  const details = [
    `Original error message: ${error.message}`,
    `Ensure the GitHub token is not expired and has the necessary permissions`,
    `You can check your tokens here: https://github.com/settings/tokens`,
  ];
  if (operation !== "create") {
    details.push(`Ensure the file exists`);
  }

  return `${summary}. ${details.join(". ")}`;
};

export default class GithubStore {
  name = "GitHub store";

  /**
   * @param {object} [options] - Plug-in options
   * @param {string} [options.user] - Username
   * @param {string} [options.repo] - Repository
   * @param {string} [options.branch] - Branch
   * @param {string} [options.token] - Personal access token
   */
  constructor(options = {}) {
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
    const apiPath = path.join(`repos/${user}/${repo}/contents`, filePath);
    const url = new URL(apiPath, baseUrl);

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
   * Check if file exists
   * @param {string} filePath - Path to file
   * @returns {Promise<boolean>} File exists
   * @see {@link https://docs.github.com/en/rest/repos/contents#get-repository-content}
   */
  async fileExists(filePath) {
    const { branch, repo } = this.options;

    try {
      debug(`Try reading file ${filePath} in repo ${repo}, branch ${branch}`);
      await this.#client(`${filePath}?ref=${branch}`);

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
   * @see {@link https://docs.github.com/en/rest/repos/contents#create-or-update-file-contents}
   */
  async createFile(filePath, content, { message }) {
    const { branch, repo } = this.options;

    let createResponse;
    try {
      const fileExists = await this.fileExists(filePath);
      if (fileExists) {
        return;
      }

      debug(`Try creating file ${filePath} in repo ${repo}, branch ${branch}`);
      createResponse = await this.#client(filePath, "PUT", {
        branch,
        content: Buffer.from(content).toString("base64"),
        message,
      });
      debug(`Creating file ${filePath}`);

      const file = await createResponse.json();

      return file.content.html_url;
    } catch (error) {
      const message = crudErrorMessage({
        error,
        operation: "create",
        filePath,
        repo,
        branch,
      });
      debug(message);
      throw new Error(message);
    }
  }

  /**
   * Read file
   * @param {string} filePath - Path to file
   * @returns {Promise<string>} File content
   * @see {@link https://docs.github.com/en/rest/repos/contents#get-repository-content}
   */
  async readFile(filePath) {
    const { branch, repo } = this.options;

    let readResponse;
    try {
      debug(`Try reading file ${filePath} in repo ${repo}, branch ${branch}`);
      readResponse = await this.#client(`${filePath}?ref=${branch}`);
    } catch (error) {
      const message = crudErrorMessage({
        error,
        operation: "read",
        filePath,
        repo,
        branch,
      });
      debug(message);
      throw new Error(message);
    }

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
    const { branch, repo } = this.options;

    let readResponse;
    try {
      debug(`Try reading file ${filePath} in repo ${repo}, branch ${branch}`);
      readResponse = await this.#client(`${filePath}?ref=${branch}`);
    } catch (error) {
      const message = crudErrorMessage({
        error,
        operation: "read",
        filePath,
        repo,
        branch,
      });
      debug(message);
      throw new Error(message);
    }

    const { sha } = await readResponse.json();
    const updateFilePath = newPath || filePath;

    let updateResponse;
    try {
      debug(`Try updating file ${filePath} in repo ${repo}, branch ${branch}`);
      updateResponse = await this.#client(updateFilePath, "PUT", {
        branch,
        content: Buffer.from(content).toString("base64"),
        message,
        sha: sha || false,
      });
      debug(`Updated file ${filePath}`);
    } catch (error) {
      const message = crudErrorMessage({
        error,
        operation: "update",
        filePath,
        repo,
        branch,
      });
      debug(message);
      throw new Error(message);
    }

    const file = await updateResponse.json();

    if (newPath) {
      debug(`Try deleting file ${filePath} in repo ${repo}, branch ${branch}`);
      await this.deleteFile(filePath, { message });
      debug(`Deleted file ${filePath}`);
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
    const repo = this.options.repo;
    const branch = this.options.branch;

    let readResponse;
    try {
      debug(`Try reading file ${filePath} in repo ${repo}, branch ${branch}`);
      readResponse = await this.#client(`${filePath}?ref=${branch}`);
    } catch (error) {
      const message = crudErrorMessage({
        error,
        operation: "read",
        filePath,
        repo,
        branch,
      });
      debug(message);
      throw new Error(message);
    }

    const { sha } = await readResponse.json();

    try {
      debug(`Try deleting file ${filePath} in repo ${repo}, branch ${branch}`);
      await this.#client(filePath, "DELETE", {
        branch,
        message,
        sha,
      });
      debug(`Deleted file ${filePath}`);
    } catch (error) {
      const message = crudErrorMessage({
        error,
        operation: "delete",
        filePath,
        repo,
        branch,
      });
      debug(message);
      throw new Error(message);
    }

    return true;
  }

  init(Indiekit) {
    const required_configs = ["baseUrl", "branch", "repo", "token", "user"];
    for (const required of required_configs) {
      if (!this.options[required]) {
        const message = `Could not initialize ${this.name}: ${required} not set. See https://www.npmjs.com/package/@indiekit/store-github for details.`;
        debug(message);
        console.error(message);
        throw new Error(message);
      }
    }
    Indiekit.addStore(this);
  }
}
