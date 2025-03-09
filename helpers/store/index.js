import { IndiekitError } from "@indiekit/error";
import { IndiekitStorePlugin } from "@indiekit/plugin";

const defaults = {
  baseUrl: "https://store.example",
};

/**
 * @typedef Response
 * @property {object} response - HTTP response
 */
export default class TestStorePlugin extends IndiekitStorePlugin {
  name = "Test store";

  /**
   * @param {object} [options] - Plug-in options
   * @param {string} [options.baseUrl] - Base URL
   * @param {string} [options.user] - Username
   */
  constructor(options = {}) {
    super(options);

    this.options = { ...defaults, ...options };

    this.info = {
      name: "Test store",
      uid: `${this.options.baseUrl}/${this.options.user}`,
    };
  }

  /**
   * @access private
   * @param {string} path - Request path
   * @param {string} [method] - Request method
   * @param {object} [body] - Request body
   * @returns {Promise<Response>} Store client interface
   */
  async #client(path, method = "GET", body) {
    const { baseUrl, user } = this.options;
    const url = new URL(path, `${baseUrl}/${user}/`);

    try {
      const response = await fetch(url.href, {
        method,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

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
   * Create file
   * @param {string} path - Path to file
   * @param {string} content - File content
   * @param {object} options - Options
   * @param {string} options.message - Commit message
   * @returns {Promise<string>} Created file URL
   */
  async createFile(path, content, { message }) {
    await this.#client(path, "PUT", { content, message });
    return `${this.info.uid}/${path}`;
  }

  /**
   * Read file
   * @param {string} path - Path to file
   * @returns {Promise<string>} File content
   */
  async readFile(path) {
    const response = await this.#client(path);
    const { content } = await response.json();
    return content;
  }

  /**
   * Update file
   * @param {string} path - Path to file
   * @param {string} content - File content
   * @param {object} options - Options
   * @param {string} options.message - Commit message
   * @param {string} options.newPath - New path to file
   * @returns {Promise<string>} Updated file URL
   */
  async updateFile(path, content, { message, newPath }) {
    path = path || newPath;
    await this.#client(path, "PATCH", { content, message, newPath });
    return `${this.info.uid}/${path}`;
  }

  /**
   * Delete file
   * @param {string} path - Path to file
   * @param {string} message - Commit message
   * @returns {Promise<boolean>} File deleted
   */
  async deleteFile(path, message) {
    await this.#client(path, "DELETE", { message });
    return true;
  }
}
