#!/usr/bin/env node
import process from "node:process";

import chalk from "chalk";
import prompts from "prompts";

/**
 * Add plug-in to Indiekit configuration
 * @param {string} packageName - Plug-in package name
 * @param {object} config - Indiekit configuration
 * @returns {Promise<object>} Updated configuration
 */
export const addPluginConfig = async (packageName, config) => {
  const plugin = await getPlugin(packageName);
  const { info } = console;

  info(`${chalk.green(">")} ${chalk.white(`Configuring ${plugin.name}…`)}`);

  // Add plug-in to list of installed plug-ins
  config.plugins.push(packageName);

  // Add any plug-in configuration values
  const pluginConfig = await prompts(plugin.prompts);
  if (Object.keys(pluginConfig).length > 0) {
    config[packageName] = pluginConfig;
  }

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
    10,
  );

  if (requiredMajorVersion < minimumMajorVersion) {
    console.info(`Node.js v${currentVersion} is not supported.`);
    console.info(`Please use Node.js v${minimumMajorVersion} or higher.`);
    process.exit(1);
  }
};

/**
 * Get question prompts specified by plug-in
 * @param {string} packageName - Plug-in package name
 * @returns {Promise<object>} Plug-in
 */
export const getPlugin = async (packageName) => {
  const { default: IndiekitPlugin } = await import(packageName);
  const plugin = new IndiekitPlugin();

  return plugin;
};
