import { createRequire } from "node:module";
import path from "node:path";
const require = createRequire(import.meta.url);

/**
 * Add plug-ins to application configuration
 * @param {object} Indiekit - Indiekit instance
 */
export async function getInstalledPlugins(Indiekit) {
  for await (const pluginName of Indiekit.config.plugins) {
    const { default: IndiekitPlugin } = await import(pluginName);
    const plugin = new IndiekitPlugin(Indiekit.config[pluginName]);

    // Add plug-in file path
    plugin.filePath = path.dirname(require.resolve(pluginName));

    // Add plug-in ID
    plugin.id = getPluginId(pluginName);

    // Register plug-in functions
    if (plugin.init) {
      await plugin.init(Indiekit);
      Indiekit.installedPlugins.add(plugin);
    }
  }
}

/**
 * Get installed plug-in
 * @param {Set} installedPlugins - Installed plug-ins
 * @param {string} pluginName - Plug-in Name
 * @returns {string} Plug-in ID
 */
export const getInstalledPlugin = (installedPlugins, pluginName) => {
  return [...installedPlugins].find(
    (plugin) => plugin.id === getPluginId(pluginName),
  );
};

/**
 * Get normalised plug-in ID
 * @param {string} pluginName - Plug-in Name
 * @returns {string} Plug-in ID
 */
export const getPluginId = (pluginName) => {
  return pluginName.replace("/", "-");
};
