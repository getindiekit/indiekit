import { fileURLToPath } from "node:url";

/**
 * Get list of directories containing view templates
 *
 * @param {object} indiekitConfig
 * @returns {Array} Directories containing view templates
 */
export const views = (indiekitConfig) => {
  const { application } = indiekitConfig;

  // Application views
  const views = [fileURLToPath(new URL("../views", import.meta.url))];

  // Plug-in views
  for (const plugin of application.installedPlugins) {
    if (plugin.meta?.url) {
      views.push(
        ...[
          fileURLToPath(new URL("includes", plugin.meta.url)),
          fileURLToPath(new URL("views", plugin.meta.url)),
        ]
      );
    }
  }

  return views;
};
