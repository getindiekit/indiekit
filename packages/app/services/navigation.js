export const getNavigation = (locale, token) => {
  const navigation = [(token ? {
    href: '/settings',
    text: 'Settings'
  } : {}), {
    href: `/docs/${locale}`,
    text: 'Docs'
  }, (token ? {} : {
    href: '/session/login',
    text: 'Sign in'
  }), (token ? {
    href: '/session/logout',
    text: 'Sign out'
  } : {})];

  return navigation;
};
