/* eslint-disable import/no-anonymous-default-export */
export default {
  error: "Error",
  errorSummaryTitle: "There is a problem",
  noValue: "Not set",
  optionalValue: "(optional)",
  guidance: {
    discovery:
      "So that %s can be discovered by Micropub clients and request permission to post to your website, add the following values to your website’s `<head>`:",
  },
  errors: {
    notFound: {
      title: "Page not found",
      content: "If you entered a web address please check it was correct.",
    },
    noDatabase: {
      content: "This feature requires a database.",
    },
  },
  session: {
    login: {
      title: "Sign in",
      description: "Sign in with IndieAuth to verify that you own %s",
      me: "Web address",
      submit: "Sign in with IndieAuth",
      error: {
        validateRedirect: "Invalid redirect attempted",
        validateState: "Missing code or state mismatch",
      },
    },
    logout: {
      title: "Sign out",
    },
  },
  status: {
    title: "Server status",
    application: {
      summaryTitle: "Application settings",
      accessToken: "Access token",
      scope: "Provided scope",
      name: "Name",
      locale: "Language",
      localeNotAvailable:
        "{{ app }} has not been translated into {{ locale }} yet",
      themeColor: "Theme color",
      themeColorScheme: "Theme",
      themeColorSchemeValue: {
        automatic: "Automatic",
        light: "Light",
        dark: "Dark",
      },
      installedPlugins: "Installed plug-ins",
    },
    publication: {
      summaryTitle: "Publication settings",
      me: "Web address",
      locale: "Language",
      timeZone: "Time zone",
      store: "Content store",
      preset: "Preset",
      postTypes: "Post types",
      syndicationTargets: "Syndication targets",
      authorizationEndpoint: "Authorization endpoint",
      mediaEndpoint: "Media endpoint",
      micropubEndpoint: "Micropub endpoint",
      tokenEndpoint: "Token endpoint",
    },
  },
};
