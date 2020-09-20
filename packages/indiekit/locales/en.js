export const en = {
  error: 'Error',
  noValue: 'Not set',
  optionalValue: '(optional)',
  guidance: {
    discovery: 'So that %s can be discovered by Micropub clients and request permission to post to your website, add the following values to your website’s `<head>`:'
  },
  session: {
    login: {
      title: 'Sign in',
      me: 'Web address',
      submit: 'Sign in',
      error: {
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
      mediaEndpoint: 'Media endpoint'
    }
  }
};
