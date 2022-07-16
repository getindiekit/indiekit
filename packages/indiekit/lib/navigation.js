export const getNavigation = (application, request, response) => {
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

  // Add navigation items from endpoint plug-ins
  for (const endpoint of application.endpoints) {
    if (endpoint.navigationItems) {
      const navigationItems = Array.isArray(endpoint.navigationItems)
        ? endpoint.navigationItems
        : [endpoint.navigationItems];
      navigation = [...navigationItems, ...navigation];
    }
  }

  // Remove navigation items that require a database if no database configured
  if (!application.hasDatabase) {
    navigation = navigation.filter((item) => !item.requiresDatabase);
  }

  // Translate text strings
  for (const item of navigation) {
    item.text = response.__(item.text);
  }

  return navigation;
};
