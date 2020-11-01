export const en = {
  error: 'Error',
  errorSummaryTitle: 'There is a problem',
  noValue: 'Not set',
  optionalValue: '(optional)',
  guidance: {
    discovery: 'So that %s can be discovered by Micropub clients and request permission to post to your website, add the following values to your website’s `<head>`:'
  },
  session: {
    login: {
      title: 'Sign in',
      description: 'Sign in with IndieAuth to verify that you own %s',
      me: 'Web address',
      submit: 'Sign in with IndieAuth',
      error: {
        validateRedirect: 'Invalid redirect attempted',
        validateState: 'Missing code or state mismatch'
      }
    },
    logout: {
      title: 'Sign out'
    }
  },
  status: {
    title: 'Server status',
    application: {
      summaryTitle: 'Application settings',
      name: 'Name',
      locale: 'Language',
      localeNotAvailable: '{{ app }} has not been translated into {{ locale }} yet',
      themeColor: 'Theme color',
      themeColorScheme: 'Theme',
      themeColorSchemeValue: {
        automatic: 'Automatic',
        light: 'Light',
        dark: 'Dark'
      },
      endpoints: 'Endpoints'
    },
    publication: {
      summaryTitle: 'Puplication settings',
      me: 'Web address',
      locale: 'Language',
      timeZone: 'Time zone',
      store: 'Content store',
      preset: 'Preset',
      postTypes: 'Post types',
      syndicationTargets: 'Syndication targets',
      mediaEndpoint: 'Media endpoint',
      accessToken: 'Access token'
    }
  }
};
