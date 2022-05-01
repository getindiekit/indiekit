import process from "node:process";
import chalk from "chalk";
import prompts from "prompts";

/**
 * Add plug-in to Indiekit configuration
 *
 * @param {string} pluginName Name of selected plugin
 * @param {object} config Indiekit configuration
 * @returns {object} Updated configuration
 */
export const addPluginConfig = async (pluginName, config) => {
  const plugin = await getPlugin(pluginName);

  console.log(
    `${chalk.green(">")} ${chalk.white(`Configuring ${plugin.name}…`)}`
  );

  // Add plug-in to list of installed plug-ins
  config.plugins.push(pluginName);

  // Add plug-in configuration values
  const pluginConfig = await prompts(plugin.prompts);
  config[pluginName] = pluginConfig;

  return config;
};

/**
 * Check if Node.js version meets minimum requirement
 *
 * @param {string} currentVersion Current Node.js version
 * @param {number} minimumMajorVersion Minimum major version required
 */
export const checkNodeVersion = (currentVersion, minimumMajorVersion) => {
  const requiredMajorVersion = Number.parseInt(
    currentVersion.split(".")[0],
    10
  );

  if (requiredMajorVersion < minimumMajorVersion) {
    console.info(`Node.js v${currentVersion} is not supported.`);
    console.info(`Please use Node.js v${minimumMajorVersion} or higher.`);
    process.exit(1);
  }
};

/**
 * Check if given string is a valid URL
 *
 * @param {object} string URL
 * @returns {boolean} String is a URL
 */
export const isUrl = (string) => {
  if (typeof string !== "string") {
    throw new TypeError("Expected a string");
  }

  try {
    new URL(string); // eslint-disable-line no-new
    return true;
  } catch {
    return false;
  }
};

/**
 * Get question prompts specified by plugin
 *
 * @param {string} pluginName Plug-in name
 * @returns {object} Plug-in
 */
export const getPlugin = async (pluginName) => {
  // eslint-disable-next-line node/no-unsupported-features/es-syntax
  const { default: IndiekitPlugin } = await import(pluginName);
  const plugin = new IndiekitPlugin();

  return plugin;
};
