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

  // Translate text strings
  for (const item of shortcuts) {
    item.name = response.locals.__(item.name);
  }

  return shortcuts;
};
