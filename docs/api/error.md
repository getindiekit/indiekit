# `IndiekitError`

A custom error handler, [`IndiekitError`](https://github.com/getindiekit/indiekit/blob/main/packages/error/index.js), is available to plug-ins to return consistent and predictable error responses to Indiekit.

## Syntax

```js
import { IndiekitError } from "@indiekit/error";

throw new IndiekitError(message, options);
```

## Constructor

`message`
: Human readable error message. **Required**

`options`
: An object used to customise the behaviour of the error.

  `cause`
  : An error object containing the original error.

  `code`
  : A string representing the internal [error code][].

  `plugin`
  : A string representing the name of plug-in. Used to prefix error messages caused by a plug-in.

  `scope`
  : A string representing an OAuth authentication scope.

  `status`
  : A number representing an [HTTP response status code][].

  `uri`
  : A string representing a URL to webpage providing information about the cause of the error and how to resolve it.

[error code]: https://github.com/getindiekit/indiekit/blob/main/packages/error/errors.js
[HTTP response status code]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
