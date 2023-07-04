#!/usr/bin/env node
import process from "node:process";
import chalk from "chalk";
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

  info(`${chalk.green(">")} ${chalk.white(`Configuring ${plugin.name}…`)}`);

  // Add plug-in to list of installed plug-ins
  config.plugins.push(pluginName);

  // Add plug-in configuration values
  const pluginConfig = await prompts(plugin.prompts);
  config[pluginName] = pluginConfig;

  return config;
};

/**
 * Check if Node.js version meets minimum requirement
 * @param {string} currentVersion - Current Node.js version
 * @param {number} minimumMajorVersion - Minimum major version required
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
 * Get question prompts specified by plugin
 * @param {string} pluginName - Plug-in name
 * @returns {Promise<object>} Plug-in
 */
export const getPlugin = async (pluginName) => {
  const { default: IndiekitPlugin } = await import(pluginName);
  const plugin = new IndiekitPlugin();

  return plugin;
};
