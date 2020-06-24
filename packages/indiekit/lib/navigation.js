export const getNavigation = (application, token) => {
  let navigation = [{
    href: `/docs/${application.locale}`,
    text: 'Docs'
  }, (token ? {
    href: '/session/logout',
    text: 'Sign out'
  } : {
    href: '/session/login',
    text: 'Sign in'
  })];

  if (application.endpoints) {
    for (const endpoint of application.endpoints) {
      if (endpoint.navigationItems) {
        navigation = endpoint.navigationItems.concat(navigation);
      }
    }
  }

  return navigation;
};
