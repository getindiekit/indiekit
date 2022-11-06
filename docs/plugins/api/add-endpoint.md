# `Indiekit.addEndpoint`

An [endpoint](../../concepts.md#endpoint) plug-in adds new routes to an Indiekit server. Routes can add new pages to the web interface, or provide API endpoints that support IndieWeb (or other) protocols or APIs.

[[toc]]

## Constructor

<!--@include: .plugin-constructor.md-->

## Properties

| Property | Type | Description |
| :------- | :--- | :---------- |
| `mountPath` | [`String`][] | Path to mount routes onto. _Required_. |
| `navigationItems` | [`Object`][] or [`Array`][] | Add navigation items to the web interface. _Optional_. |
| `routes` | [`Router`][] | Plug-in routes that require authentication to access. _Optional_. |
| `routesPublic` | [`Router`][] | Plug-in routes that can be publicly accessed. _Optional_. |

### `mountPath`

Path to mount routes onto.

```js
get mountPath() {
  return "/example";
}
```

### `navigationItems`

Add items to the web interface’s navigation menu using the `navigationItems` property. For example, to add a link to the `/example` path:

```js
get navigationItems() {
  return {
    href: this.mountPath,
    text: "Example",
  };
}
```

`navigationItems` will accept either an [`Object`][] or an [`Array`][]. Use an [`Array`][] if you want to add multiple items to the navigation menu, for example:

```js
get navigationItems() {
  return [{
    href: this.mountPath,
    text: "Example",
  }, {
    href: this.mountPath + "/page",
    text: "Example page",
  }];
}
```

Each object in `navigationItems` should return the following values:

| Property | Type | Description |
| :------- | :--- | :---------- |
| `href` | [`String`][] | The value of the navigation link’s href attribute. _Required_. |
| `text` | [`String`][] | Text of the navigation link. _Required_. |
| `requiresDatabase` | [`Boolean`][] | Whether feature requires a database. _Optional_, defaults to `false`. |

Note that, if your plug-in is localised, the `text` value should be the key path to the corresponding localisation string, for example:

```js
get navigationItems() {
  return {
    href: this.mountPath,
    text: "example.navigation.label",
  };
}
```

### `routes`

Routes can be added to Indiekit’s [Express](https://expressjs.com) server by providing an instance of an Express [`Router`][] with the paths and methods you wish to support.

For example, to accept a `POST` request to `/example`:

```js
get routes() {
  router.post("/", (req, res, next) => {…});
  return router;
}
```

### `routesPublic`

Routes added with the `routes` method are attached to Indiekit’s own router after rate limiting and IndieAuth authentication middleware. Any request to your endpoint path will therefore require a user to be signed in or otherwise authenticated.

You can bypass authentication by instead using the `routesPublic` method.

For example, to accept a `GET` request on the `/example` path that can be accessed publicly:

```js
get routesPublic() {
  router.get("/", (req, res, next) => {…});
  return router;
}
```

## Example

```js
import express from "express";

const router = express.Router();

export default class ExampleEndpoint {
  constructor() {
    this.id = "example-endpoint";
    this.meta = import.meta;
    this.name = "Example endpoint";
    this.mountPath = "/example";
  }

  get navigationItems() {
    return {
      href: this.mountPath,
      text: "Example",
    };
  }

  get routes() {
    router.post("/", (req, res, next) => {…});
    return router;
  }

  get routesPublic() {
    router.get("/", (req, res, next) => {…});
    return router;
  }

  init(Indiekit) {
    Indiekit.addEndpoint(this);
  }
}
```

Example endpoint plug-ins:

- [`@indiekit/endpoint-token`](https://github.com/getindiekit/indiekit/tree/main/packages/endpoint-token) adds supports granting and verifying IndieAuth tokens.

- [`@indiekit/endpoint-share`](https://github.com/getindiekit/indiekit/tree/main/packages/endpoint-share) adds a share page to Indiekit’s web interface.

[`Array`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
[`Boolean`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean
[`Function`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function
[`Object`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object
[`String`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String
[`Router`]: https://expressjs.com/en/4x/api.html#router
