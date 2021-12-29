import deepmerge from 'deepmerge';
import {cosmiconfigSync} from 'cosmiconfig';
import {defaultConfig} from '../config/defaults.js';

/**
 * Get user config values from package.json or config file.
 *
 * @see {@link https://github.com/davidtheclark/cosmiconfig#readme}
 * @param {string} configFilePath Explicity declared config file path
 * @access private
 * @returns {object} User config
 */
function _getUserConfig(configFilePath) {
  const explorerSync = cosmiconfigSync('indiekit');
  const result = configFilePath
    ? explorerSync.load(configFilePath)
    : explorerSync.search();

  return result.config;
}

/**
 * Get config derived from user and default config values.
 *
 * @param {object} options Options
 * @param {object} options.config Configuration object
 * @param {string} options.configFilePath Configuration file path
 * @returns {object} Combined config
 */
export function getIndiekitConfig(options) {
  const {config, configFilePath} = options;
  const userConfig = config ? config : _getUserConfig(configFilePath);
  const mergedConfig = deepmerge(defaultConfig, userConfig);

  return mergedConfig;
}
