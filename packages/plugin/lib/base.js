import { createRequire } from "node:module";
import path from "node:path";

import { IndiekitError } from "@indiekit/error";
import makeDebug from "debug";

const debug = makeDebug(`indiekit:plugin`);

/**
 * Base class for Indiekit plug-ins
 *
 * Plug-in registration, initialization, and utility methods.
 * @class
 */
export class IndiekitPlugin {
  /**
   * Register plug-in with Indiekit
   * @param {object} Indiekit - Indiekit instance
   * @param {string} packageName - Name of the plug-in package
   * @returns {Promise<IndiekitPlugin>} Registered plug-in instance
   * @static
   * @async
   */
  static async register(Indiekit, packageName) {
    debug(`Registering ${packageName}`);

    const plugin = new this(Indiekit.config[packageName]);
    plugin.indiekit = Indiekit;
    plugin.name = plugin.name || packageName;
    plugin.#packageName = packageName;

    // Initiate plug-in features
    await plugin.init();

    // Add plug-in to Indiekit
    Indiekit.installedPlugins.add(plugin);

    return plugin;
  }

  /**
   * Database collection used by the plug-in
   * @type {string}
   */
  collection = undefined;

  /**
   * Environment variables (used when configuring Docker)
   * @type {string[]}
   */
  environment = undefined;

  /**
   * Human-readable name for the plug-in
   * @type {string}
   */
  name = undefined;

  /**
   * Questions to ask when creating a new configuration file
   * @type {import("prompts").PromptObject[]}
   */
  prompts = undefined;

  /**
   * Get validation schemas for form validation
   * @type {import('express-validator').Schema} Form validation
   */
  validationSchemas = undefined;

  /**
   * NPM package name
   * @type {string}
   */
  #packageName = undefined;

  /**
   * Create new plug-in instance
   * @param {object} options - Plug-in options
   */
  constructor(options) {
    this.indiekit = undefined;
    this.options = options;
  }

  /**
   * Get file path to plug-in package directory
   * @returns {string} Absolute path to plug-in package directory
   * @throws {IndiekitError} Plug-in package cannot be resolved
   */
  get filePath() {
    const require = createRequire(import.meta.url);

    try {
      return path.dirname(require.resolve(`${this.#packageName}/package.json`));
    } catch (error) {
      throw new IndiekitError(
        `Could not resolve path for ${this.#packageName}`,
        {
          cause: error,
          plugin: this.#packageName,
        },
      );
    }
  }

  /**
   * Get unique identifier for plug-in
   * @returns {string} Plug-in identifier derived from package name
   */
  get id() {
    return this.#packageName.replace("/", "-");
  }

  /**
   * Add database collection
   */
  #addCollection() {
    if (!this.collection) {
      return;
    }

    if (this.indiekit.collections.has(this.collection)) {
      console.warn(`Collection ‘${this.collection}’ already added`);
    } else if (this.indiekit.database) {
      this.indiekit.collections.set(
        this.collection,
        this.indiekit.database.collection(this.collection),
      );
      debug(`Added database collection: ${this.collection}`);
    }
  }

  /**
   * Add validation schemas
   */
  #addValidationSchemas() {
    const validationSchemas = this.validationSchemas;
    if (validationSchemas) {
      for (const [field, schema] of Object.entries(validationSchemas)) {
        debug("Adding validation schemas for", field);
        this.indiekit.validationSchemas.set(field, schema);
      }
    }
  }

  /**
   * Initialize plug-in
   *
   * This method should be overridden by plug-in implementations to add
   * specific functionality.
   * @returns {Promise<void>} Promise that resolves when initialization complete
   * @async
   */
  async init() {
    debug(`Initiating ${this.#packageName}`);
    this.#addCollection();
    this.#addValidationSchemas();
  }
}
