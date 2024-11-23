import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Get list of directories containing view templates
 * @param {object} Indiekit - Indiekit instance
 * @returns {Array} Directories containing view templates
 */
export const views = (Indiekit) => {
  const { application } = Indiekit;

  // Application views
  const views = [fileURLToPath(new URL("../views", import.meta.url))];

  // Plug-in views
  for (const plugin of application.installedPlugins) {
    if (plugin.filePath) {
      views.push(
        path.join(plugin.filePath, "includes"),
        path.join(plugin.filePath, "views"),
      );
    }
  }

  return views;
};
