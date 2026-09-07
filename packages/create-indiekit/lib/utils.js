import { styleText } from "node:util";

import prompts from "prompts";

/**
 * Add plug-in to Indiekit configuration
 * @param {string} pluginName - Name of selected plug-in
 * @param {object} config - Indiekit configuration
 * @returns {Promise<object>} Updated configuration
 */
export const addPluginConfig = async (pluginName, config) => {
  const plugin = await getPlugin(pluginName);
  const { info } = console;

  info(
    `${styleText("green", "v")} ${styleText("white", `Configuring ${plugin.name}…`)}`,
  );

  // Add plug-in to list of installed plug-ins
  config.plugins.push(pluginName);

  // Add any plug-in configuration values
  const pluginConfig = await prompts(plugin.prompts);
  if (Object.keys(pluginConfig).length > 0) {
    config[pluginName] = pluginConfig;
  }

  return config;
};

/**
 * Pack a version's major and minor into a single comparable number.
 * The patch segment is ignored. Minor is padded to three digits, so
 * "24.100" sorts above "24.9".
 * @param {string} version - Version to pack, i.e. "24.17.0"
 * @returns {number} Comparable value, i.e. 24017
 */
function majorMinorValue(version) {
  const MINOR_PADDING = 1000;
  const [major, minor = 0] = version.split(".").map(Number);
  return major * MINOR_PADDING + minor;
}

/**
 * Check if Node.js version meets minimum requirement
 * @param {string} currentVersion - Current Node.js version
 * @param {string} minimumSupportedVersion - Minimum version required
 * @returns {boolean} Current version meets minimum Node.js requirement
 */
export const isCompatibleNodeVersion = (
  currentVersion,
  minimumSupportedVersion,
) => {
  return (
    majorMinorValue(currentVersion) >= majorMinorValue(minimumSupportedVersion)
  );
};

/**
 * Get question prompts specified by plug-in
 * @param {string} pluginName - Plug-in name
 * @returns {Promise<object>} Plug-in
 */
export const getPlugin = async (pluginName) => {
  const { default: IndiekitPlugin } = await import(pluginName);
  const plugin = new IndiekitPlugin();

  return plugin;
};
