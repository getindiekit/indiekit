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

  navigation = [...application.navigationItems, ...navigation];

  return navigation;
};
