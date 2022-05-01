export const getNavigation = (application, request, response) => {
  // Default navigation items
  const navigation = [
    request.session.token
      ? {
          href: "/session/logout",
          text: "session.logout.title",
        }
      : {
          href: "/session/login",
          text: "session.login.title",
        },
  ];

  // Plug-in navigation items
  for (const plugin of application.installedPlugins) {
    if (plugin.navigationItems && plugin.navigationItems(application)) {
      navigation.unshift(plugin.navigationItems(application));
    }
  }

  // Translate text strings
  for (const item of navigation) {
    item.text = response.__(item.text);
  }

  return navigation;
};
