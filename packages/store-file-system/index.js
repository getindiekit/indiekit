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
   *
   * @private
   * @param {string} filePath - Path to file
   * @returns {string} Absolute file path
   */
  #absolutePath(filePath) {
    return path.join(this.options.directory, filePath);
  }

  /**
   * Create file in a directory
   *
   * @param {string} filePath - Path to file
   * @param {string} content - File content
   * @returns {Promise<Response>} A promise to the response
   */
  async createFile(filePath, content) {
    try {
      const absolutePath = this.#absolutePath(filePath);
      const dirname = path.dirname(absolutePath);

      if (!existsSync(dirname)) {
        await fs.mkdir(dirname, { recursive: true });
      }

      await fs.writeFile(absolutePath, content);

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
   * Update file in a directory
   *
   * @param {string} filePath - Path to file
   * @param {string} content - File content
   * @returns {Promise<Response>} A promise to the response
   */
  async updateFile(filePath, content) {
    try {
      const absolutePath = this.#absolutePath(filePath);

      await fs.writeFile(absolutePath, content);

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
   * Delete file in a directory
   *
   * @param {string} filePath - Path to file
   * @returns {Promise<Response>} A promise to the response
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
