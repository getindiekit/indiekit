export const getNavigation = (application, request, response) => {
  const defaultNavigation = [
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

  // Merge default navigation items with those added by plugins
  const navigation = [...application.navigationItems, ...defaultNavigation];

  // Translate text strings
  for (const item of navigation) {
    item.text = response.__(item.text);
  }

  return navigation;
};
