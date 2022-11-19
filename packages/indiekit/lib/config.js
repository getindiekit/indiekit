import deepmerge from "deepmerge";
import { cosmiconfigSync } from "cosmiconfig";
import { defaultConfig } from "../config/defaults.js";

/**
 * Get user configuration values from package.json or configuration file
 *
 * @access private
 * @param {string} configFilePath - Explicity declared configuration file path
 * @returns {object} User configuration
 * @see {@link https://github.com/davidtheclark/cosmiconfig#readme}
 */
function _getUserConfig(configFilePath) {
  const explorerSync = cosmiconfigSync("indiekit");
  const result = configFilePath
    ? explorerSync.load(configFilePath)
    : explorerSync.search();

  return result.config;
}

/**
 * Get configuration derived from user and default values
 *
 * @param {object} options - Options
 * @param {object} options.config - Configuration object
 * @param {string} options.configFilePath - Configuration file path
 * @returns {object} Combined configuration
 */
export function getIndiekitConfig(options) {
  const { config, configFilePath } = options;
  const userConfig = config || _getUserConfig(configFilePath);
  const mergedConfig = deepmerge(defaultConfig, userConfig);

  return mergedConfig;
}
