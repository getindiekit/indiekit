export const getNavigation = (application, token) => {
  const language = application.locale.split('-')[0];

  let navigation = [{
    href: `/docs/${language}`,
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
