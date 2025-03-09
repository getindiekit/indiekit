import makeDebug from "debug";

import { IndiekitPlugin } from "./base.js";

const debug = makeDebug(`indiekit:plugin`);

/**
 * @typedef StoreInformation
 * @property {string} name - Name of content store
 * @property {string} uid - Unique identifier
 */

/**
 * Content store plug-in
 * @class
 * @augments {IndiekitPlugin}
 */
export class IndiekitStorePlugin extends IndiekitPlugin {
  /**
   * Content store information
   * @type {StoreInformation}
   */
  info = undefined;

  #addStore() {
    debug(`Adding content store: ${this.name}`);
    this.indiekit.stores.add(this);
  }

  /**
   * Create file
   * @param {string} filePath - Path to file
   * @param {string} content - File content
   * @param {object} [options] - Options
   * @param {string} [options.message] - Commit message
   * @returns {Promise<string>} Created file URL
   */
  // eslint-disable-next-line no-unused-vars
  async createFile(filePath, content, options) {
    debug(`Creating ${filePath} to ${this.name}`);
    return;
  }

  /**
   * Read file
   * @param {string} filePath - Path to file
   * @returns {Promise<string>} File content
   */
  async readFile(filePath) {
    debug(`Reading ${filePath} at ${this.name}`);
    return;
  }

  /**
   * Update file
   * @param {string} filePath - Path to file
   * @param {string} content - File content
   * @param {object} [options] - Options
   * @param {string} [options.message] - Commit message
   * @param {string} [options.newPath] - New path to file
   * @returns {Promise<string>} Updated file URL
   */
  // eslint-disable-next-line no-unused-vars
  async updateFile(filePath, content, options) {
    debug(`Updating ${filePath} at ${this.name}`);
    return;
  }

  /**
   * Delete file
   * @param {string} filePath - Path to file
   * @param {object} [options] - Options
   * @param {string} [options.message] - Commit message
   * @returns {Promise<boolean>} File deleted
   */
  // eslint-disable-next-line no-unused-vars
  async deleteFile(filePath, options) {
    debug(`Creating ${filePath} to ${this.name}`);
    return;
  }

  async init() {
    await super.init();

    this.#addStore();
  }
}
