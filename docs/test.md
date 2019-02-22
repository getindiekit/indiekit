## Tests

### Testing the service locally

If you want to run the service locally, perhaps to use with a tool like [Postman](https://www.getpostman.com/), ensure the [required environment variables](https://paulrobertlloyd.github.io/indiekit/deploy) have been set and then run `npm start`.

### Running automated tests

Before running any automated tests, the following IndieAuth tokens need to be provided via the following environment variables:

* `TEST_INDIEAUTH_TOKEN`: An IndieAuth token with `create`, `update` and `delete` scopes, whose URL *should* match that used in the destination site’s configuration.
* `TEST_INDIEAUTH_TOKEN_NOT_SCOPED`: An IndieAuth token without a scope, whose URL *should* match that used in the destination site’s configuration.
* `TEST_INDIEAUTH_TOKEN_NOT_ME`: An IndieAuth token with `create` and `update` scopes, and whose URL *should not* match that used in the destination site’s configuration.

[Homebrew Access Token](https://gimme-a-token.5eb.nl) is a useful tool for creating tokens for this purpose. Once these are in place, you can then run `npm test`.
