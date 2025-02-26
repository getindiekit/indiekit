/**
 * Add plug-ins to application configuration
 * @param {object} Indiekit - Indiekit instance
 */
export async function getInstalledPlugins(Indiekit) {
  for await (const packageName of Indiekit.config.plugins) {
    const { default: IndiekitPlugin } = await import(packageName);
    if (IndiekitPlugin.register) {
      await IndiekitPlugin.register(Indiekit, packageName);
    }
  }
}

/**
 * Get installed plug-in
 * @param {Set} installedPlugins - Installed plug-ins
 * @param {string} packageName - Plug-in package name
 * @returns {string} Plug-in ID
 */
export const getInstalledPlugin = (installedPlugins, packageName) => {
  return [...installedPlugins].find(
    (plugin) => plugin.packageName === packageName,
  );
};
