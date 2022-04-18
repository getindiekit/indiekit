---
nav_order: 5
parent: Plug-in API
---

# `IndiekitError`

A custom error handler, [`IndiekitError`](https://github.com/getindiekit/indiekit/blob/main/packages/error/index.js), is available to plug-ins to return consistent and predictable error responses to Indiekit.

```js
import { IndiekitError } from "@indiekit/error";

throw new IndiekitError(message, options);
```

| Parameters | Type | Description |
| :--------- | :--- | :---------- |
| `message` | [`String`][] | Human readable error message. _Required_. |
| `options.cause` | [`Error`][] | Original error. _Optional_. |
| `options.code` | [`String`][] | [Error code][]. _Optional_. |
| `options.plugin` | [`String`][] | Name of plug-in. This is used to prefix any error messages caused by a plug-in. _Optional_. |
| `options.scope` | [`String`][] | OAuth authentication scope. _Optional_. |
| `options.status` | [`Number`][] | [HTTP response status code][]. _Optional_. |
| `options.uri` | [`String`][] | URL to webpage providing information about the cause of the error and how to resolve it. _Optional_. |

[Error code]: https://github.com/getindiekit/indiekit/blob/main/packages/error/errors.js
[`Error`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
[`Number`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number
[`Object`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object
[`String`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String
[HTTP response status code]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
