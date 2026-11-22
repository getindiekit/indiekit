import { cosmiconfig } from "cosmiconfig";
import deepmerge from "deepmerge";

import { defaultConfig } from "../config/defaults.js";

/**
 * Get user configuration values from package.json or configuration file
 * @access private
 * @param {string} [configFilePath] - Explicity declared configuration file path
 * @returns {Promise<IndiekitConfig>} User configuration
 * @see {@link https://github.com/cosmiconfig/cosmiconfig#readme}
 */
async function _getUserConfig(configFilePath) {
  const explorer = await cosmiconfig("indiekit");
  const result = await (configFilePath
    ? explorer.load(configFilePath)
    : explorer.search());

  if (!result) {
    throw new Error("No Indiekit configuration found");
  }

  return result.config;
}

/**
 * Remove undefined values from configuration, so that they don’t replace
 * default values (for example, `themeColor: process.env.THEME_COLOR` where
 * the environment variable isn’t set). Only plain objects are changed; arrays
 * and class instances (such as plug-ins) are returned as they are.
 * @template T
 * @param {T} value - Configuration value
 * @returns {T} Configuration value without undefined properties
 */
export const _withoutUndefined = (value) =>
  value?.constructor === Object
    ? /** @type {T} */ (
        Object.fromEntries(
          Object.entries(value)
            .filter(([, entry]) => entry !== undefined)
            .map(([key, entry]) => [key, _withoutUndefined(entry)]),
        )
      )
    : value;

/**
 * Get configuration derived from user and default values
 * @param {object} options - Options
 * @param {IndiekitConfig} [options.config] - Configuration object
 * @param {string} [options.configFilePath] - Configuration file path
 * @returns {Promise<IndiekitResolvedConfig>} Combined configuration
 */
export async function getIndiekitConfig(options) {
  const { config, configFilePath } = options;
  const userConfig = config || (await _getUserConfig(configFilePath));
  const mergedConfig = deepmerge(defaultConfig, _withoutUndefined(userConfig));

  return mergedConfig;
}
