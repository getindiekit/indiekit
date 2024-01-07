import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { IndiekitError } from "@indiekit/error";

const defaults = {
  directory: process.cwd(),
};

/**
 * @typedef Response
 * @property {object} response - Response
 */
export default class FileSystemStore {
  constructor(options = {}) {
    this.id = "file-system";
    this.meta = import.meta;
    this.name = "File system store";
    this.options = { ...defaults, ...options };
  }

  get info() {
    const { directory } = this.options;

    return {
      name: directory,
      uid: `file://${directory}`,
    };
  }

  get prompts() {
    return [
      {
        type: "text",
        name: "directory",
        message: "Which directory do you want to save files in?",
      },
    ];
  }

  /**
   * Get absolute file path
   * @access private
   * @param {string} filePath - Path to file
   * @returns {string} Absolute file path
   */
  #absolutePath(filePath) {
    return path.join(this.options.directory, filePath);
  }

  /**
   * Create file
   * @param {string} filePath - Path to file
   * @param {string} content - File content
   * @returns {Promise<string>} Created file URL
   */
  async createFile(filePath, content) {
    try {
      const absolutePath = this.#absolutePath(filePath);
      const dirname = path.dirname(absolutePath);

      if (!existsSync(dirname)) {
        await fs.mkdir(dirname, { recursive: true });
      }

      await fs.writeFile(absolutePath, content);

      const url = new URL(this.info.uid);
      url.pathname = path.join(url.pathname, filePath);

      return url.href;
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
   * @param {object} [options] - Options
   * @param {string} [options.newPath] - New path to file
   * @returns {Promise<string>} Updated file URL
   */
  async updateFile(filePath, content, options) {
    try {
      const absolutePath = this.#absolutePath(filePath);

      await fs.writeFile(absolutePath, content);

      if (options?.newPath) {
        await fs.rename(absolutePath, this.#absolutePath(options.newPath));
      }

      const url = new URL(this.info.uid);
      url.pathname = path.join(url.pathname, options?.newPath || filePath);

      return url.href;
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
   * @returns {Promise<boolean>} File deleted
   */
  async deleteFile(filePath) {
    try {
      const absolutePath = this.#absolutePath(filePath);

      await fs.rm(absolutePath);

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
