# IndieKit

*An IndieWeb publishing toolkit*

Learn more about this project on the [documentation site](https://paulrobertlloyd.github.io/indiekit/).

## Local development

```
npm start
```

If you want to run the service locally, perhaps to use with a tool like [Postman](https://www.getpostman.com/), ensure the [required environment variables](https://paulrobertlloyd.github.io/indiekit/deploy) have been set.

If you’re developing a new feature and want the application to automatically restart whenever a file change is detected, you can use `npm run dev`.

## Tests

```
npm test
```

Before running any automated tests, different IndieAuth tokens need to be provided via the following environment variables:

* `TEST_INDIEAUTH_TOKEN`: An IndieAuth token with `create`, `update` and `delete` scopes, whose URL *should* match that used for `INDIEKIT_URL`.
* `TEST_INDIEAUTH_TOKEN_NOT_SCOPED`: An IndieAuth token without a scope, whose URL *should* match that used for `INDIEKIT_URL`.
* `TEST_INDIEAUTH_TOKEN_NOT_ME`: An IndieAuth token with `create` and `update` scopes, and whose URL *should not* match that used for `INDIEKIT_URL`.

[Homebrew Access Token](https://gimme-a-token.5eb.nl) is a useful tool for creating tokens for this purpose.
