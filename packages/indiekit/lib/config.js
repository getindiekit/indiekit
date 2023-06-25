import deepmerge from "deepmerge";
import { cosmiconfig } from "cosmiconfig";
import { defaultConfig } from "../config/defaults.js";

/**
 * Get user configuration values from package.json or configuration file
 * @access private
 * @param {string} configFilePath - Explicity declared configuration file path
 * @returns {Promise<object>} User configuration
 * @see {@link https://github.com/cosmiconfig/cosmiconfig#readme}
 */
async function _getUserConfig(configFilePath) {
  const explorer = await cosmiconfig("indiekit");
  const result = await (configFilePath
    ? explorer.load(configFilePath)
    : explorer.search());

  return result.config;
}

/**
 * Get configuration derived from user and default values
 * @param {object} options - Options
 * @param {object} options.config - Configuration object
 * @param {string} options.configFilePath - Configuration file path
 * @returns {Promise<object>} Combined configuration
 */
export async function getIndiekitConfig(options) {
  const { config, configFilePath } = options;
  const userConfig = config || (await _getUserConfig(configFilePath));
  const mergedConfig = deepmerge(defaultConfig, userConfig);

  return mergedConfig;
}
