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
   * Initialize plug-in
   *
   * This method should be overridden by plug-in implementations to add
   * specific functionality.
   * @returns {Promise<void>} Promise that resolves when initialization complete
   * @async
   */
  async init() {
    debug(`Initiating ${this.#packageName}`);
  }
}
