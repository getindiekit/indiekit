# Application options

The following properties in the `application` configuration option are used to configure Indiekit’s server and application interface.

## `authorizationEndpoint`

Indiekit uses its own authorization endpoint, but you can use a third-party service by setting a URL for this option.

Defaults to `"[application.url]/auth"`.

## `introspectionEndpoint`

Indiekit uses its own token introspection endpoint, but you can use a third-party service by setting a URL for this option.

Defaults to `"[application.url]/auth/introspect"`.

## `locale`

A [ISO 639-1 language code](https://en.wikipedia.org/wiki/ISO_639-1) representing the language to use in the application interface.

Defaults to system language if Indiekit has that localisation, else `"en"` (English).

See [Localisation →](localisation.md)

## `mediaEndpoint`

Indiekit uses its own [Micropub media endpoint](https://micropub.spec.indieweb.org/#media-endpoint), but you can use a third-party service by setting a URL for this option.

Defaults to `"[application.url]/media"`.

## `micropubEndpoint`

Indiekit uses its own Micropub endpoint, but you can use a third-party service by setting a URL for this option.

Defaults to `"[application.url]/micropub"`.

## `mongodbUrl`

A [MongoDB connection string](https://www.mongodb.com/docs/manual/reference/connection-string/). Used by features that require a database.

> [!WARNING]
> This value may contain private information such as a username and password. It’s recommended that you store this value in an environment (or configuration) variable which can only be seen by you and the application.

To use a specifically named database, include this in your path (the default database name is `indiekit`). For example, `mongodb://mongodb0.example.com:27017/custom-name`.

Defaults to connection string provided in `process.env.MONGO_URL`.

## `port`

A number representing the port the application server should listen on.

Defaults to `3000`.

## `name`

A string representing the name of your server.

Defaults to `"Indiekit"`.

## `themeColor`

A string containing a hexadecimal colour value representing the accent colour used in the application interface.

Defaults to `"#0055ee"`.

## `themeColorScheme`

Color scheme used in the application interface: `"automatic"`, `"light"` or `"dark"`.

Defaults to `"automatic"`.

## `timeZone`

The time zone for the application. By default this is set to `"UTC"`, however if you want to offset dates according to your time zone you can provide [a time zone name](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones). This option also accepts a number of other values.

Defaults to `"UTC"`.

See [customising the time zone →](time-zone.md)

## `tokenEndpoint`

Indiekit uses its own token endpoint, but you can use a third-party service by setting a URL for this option.

Defaults to `"[application.url]/auth/token"`.

## `ttl`

A number representing the length of time to cache external data requests (in seconds).

Defaults to `604800` (7 days).

## `url`

The URL of your server. Useful if Indiekit is running behind a reverse proxy.

Defaults to the URL of your server (as provided by request headers).
