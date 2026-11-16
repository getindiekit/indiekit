/**
 * Create application configuration for testing
 * @param {Partial<IndiekitApplication>} [values] - Values to use instead
 * @returns {IndiekitApplication} Application configuration
 */
export const testApplication = (values) => ({
  authorizationEndpoint: "/auth",
  collections: new Map(),
  introspectionEndpoint: "/auth/introspect",
  locale: "en",
  localeUsed: "en",
  mediaEndpoint: "/media",
  micropubEndpoint: "/micropub",
  mongodbUrl: false,
  name: "Test configuration",
  package: { version: "1.0.0" },
  port: 3000,
  shareEndpoint: "/share",
  shortcuts: [],
  themeColor: "#04f",
  themeColorScheme: "automatic",
  timeZone: "UTC",
  tokenEndpoint: "/auth/token",
  ttl: 604_800,
  url: "https://server.example",
  userinfoEndpoint: "/auth/userinfo",
  ...values,
});
