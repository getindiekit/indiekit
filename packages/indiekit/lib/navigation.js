/**
 * Get navigation items
 * @param {object} Indiekit - Indiekit instance
 * @param {import("express").Request} request - Request
 * @param {import("express").Response} response - Response
 * @returns {object} Shortcuts
 */
export const getNavigation = (Indiekit, request, response) => {
  const { database, endpoints } = Indiekit;

  // Default navigation items
  let navigation = [
    request.session.access_token
      ? {
          href: "/session/logout",
          text: "session.logout.title",
        }
      : {
          href: "/session/login",
          text: "session.login.title",
        },
  ];

  if (request.session.access_token) {
    navigation.push({
      href: "/status",
      text: "status.title",
      secondary: true,
    });
  }

  // Add navigation items from endpoint plug-ins
  for (const endpoint of endpoints) {
    if (endpoint.navigationItems) {
      const navigationItems = Array.isArray(endpoint.navigationItems)
        ? endpoint.navigationItems
        : [endpoint.navigationItems];
      navigation = [...navigationItems, ...navigation];
    }
  }

  // Remove navigation items that require a database if no database configured
  if (!database) {
    navigation = navigation.filter((item) => !item.requiresDatabase);
  }

  // Translate text strings
  for (const item of navigation) {
    item.text = response.locals.__(item.text);
    item.attributes = {
      "aria-current": String(request.path.startsWith(item.href)),
    };
  }

  return navigation;
};
