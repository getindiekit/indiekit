import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const defaults = {
  directory: process.cwd(),
};

/**
 * @typedef Response
 * @property {boolean} response Response
 */
export const FileSystemStore = class {
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
  #getAbsolutePath(filePath) {
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
    const absolutePath = this.#getAbsolutePath(filePath);
    const dirname = path.dirname(absolutePath);

    try {
      if (!existsSync(dirname)) {
        await fs.mkdir(dirname, { recursive: true });
      }

      await fs.writeFile(absolutePath, content);
    } catch (error) {
      throw new Error(error.message);
    }

    return true;
  }

  /**
   * Update file in a directory
   *
   * @param {string} filePath - Path to file
   * @param {string} content - File content
   * @returns {Promise<Response>} A promise to the response
   */
  async updateFile(filePath, content) {
    const absolutePath = this.#getAbsolutePath(filePath);

    try {
      await fs.writeFile(absolutePath, content);
    } catch (error) {
      throw new Error(error.message);
    }

    return true;
  }

  /**
   * Delete file in a directory
   *
   * @param {string} filePath - Path to file
   * @returns {Promise<Response>} A promise to the response
   */
  async deleteFile(filePath) {
    const absolutePath = this.#getAbsolutePath(filePath);

    try {
      await fs.rm(absolutePath);
    } catch (error) {
      throw new Error(error.message);
    }

    return true;
  }

  init(Indiekit) {
    Indiekit.addStore(this);
  }
};

export default FileSystemStore;
