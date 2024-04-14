export const getShortcuts = (application, response) => {
  // Default shortcut items
  let shortcuts = [];

  // Add shortcut items from endpoint plug-ins
  for (const endpoint of application.endpoints) {
    if (endpoint.shortcutItems) {
      const shortcutItems = Array.isArray(endpoint.shortcutItems)
        ? endpoint.shortcutItems
        : [endpoint.shortcutItems];
      shortcuts = [...shortcutItems, ...shortcuts];
    }
  }

  // Remove shortcut items that require a database if no database configured
  if (!application.hasDatabase) {
    shortcuts = shortcuts.filter((item) => !item.requiresDatabase);
  }

  for (const item of shortcuts) {
    // Translate text strings
    item.name = response.locals.__(item.name);

    // Add shortcut icon
    if (item.iconName) {
      item.icons = [
        {
          src: `/assets/shortcut-icon-96-${item.iconName}.png`,
          sizes: "96x96",
        },
      ];
      delete item.iconName;
    }

    // Remove database requirement check
    delete item.requiresDatabase;
  }

  return shortcuts;
};
