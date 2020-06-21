export const getNavigation = (locale, token) => {
  const navigation = [{
    href: `/docs/${locale}`,
    text: 'Docs'
  }, (token ? {
    href: '/session/logout',
    text: 'Sign out'
  } : {
    href: '/session/login',
    text: 'Sign in'
  })];

  return navigation;
};
