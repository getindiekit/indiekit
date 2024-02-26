# `Indiekit.addEndpoint`

An [endpoint](../../concepts.md#endpoint) plug-in adds new routes to an Indiekit server. Routes can add new pages to the web interface, or provide API endpoints that support IndieWeb (or other) protocols or APIs.

[[toc]]

## Constructor

<!--@include: .plugin-constructor.md-->

## Properties

| Property | Type | Description |
| :------- | :--- | :---------- |
| `mountPath` | `String` | Path to mount routes onto. _Required_. |
| `navigationItems` | `Object` or `Array` | Add navigation items to the web interface. _Optional_. |
| `routes` | [`Router`][] | Plug-in routes that require authentication to access. _Optional_. |
| `routesPublic` | [`Router`][] | Plug-in routes that can be publicly accessed. _Optional_. |
| `routesWellKnown` | [`Router`][] | Plug-in routes that can be accessed at `/.well-known/`. _Optional_. |

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

`navigationItems` will accept either an `Object` or an `Array`. Use an `Array` if you want to add multiple items to the navigation menu, for example:

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
| `href` | `String` | The value of the navigation link’s href attribute. _Required_. |
| `text` | `String` | Text of the navigation link. _Required_. |
| `requiresDatabase` | `Boolean` | Whether feature requires a database. _Optional_, defaults to `false`. |

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

For example, given a `mountPath` of `/example`, to accept a `POST` request at `/example/secret`, add the following:

```js
get routes() {
  router.post("/secret", (req, res, next) => {…});
  return router;
}
```

### `routesPublic`

The `routes` method attaches routes to Indiekit’s own router after rate limiting and IndieAuth authentication middleware. Any request to your endpoint path will therefore require a user to be signed in or otherwise authenticated.

You can bypass authentication by using the `routesPublic` method.

For example, given a `mountPath` of `/example`, to accept an unauthenticated `GET` request at `/example/public`, add the following:

```js
get routesPublic() {
  router.get("/public", (req, res, next) => {…});
  return router;
}
```

### `routesWellKnown`

Sometimes its necessary to serve requests to [.well-known paths](https://tools.ietf.org/html/rfc5785), standardized locations for discovering domain-wide metadata (see this registry of [Well-Known URIs](https://www.iana.org/assignments/well-known-uris/well-known-uris.xhtml)).

The `routesWellKnown` method allows you to add resources at this location.

For example, to accept a `GET` request at [`/.well-known/posh/spice.json`](https://www.rfc-editor.org/rfc/rfc7711.html), add the following:

```js
get routesWellKnown() {
  router.get("/posh/spice.json", (req, res, next) => {…});
  return router;
}
```

## Example

```js
import express from "express";

const router = express.Router();

export default class ExampleEndpoint {
  constructor() {
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
    router.post("/secret", (req, res, next) => {…});
    return router;
  }

  get routesPublic() {
    router.get("/public", (req, res, next) => {…});
    return router;
  }

  get routesWellKnown() {
    router.get("/posh/spice.json", (req, res, next) => {…});
    return router;
  }

  init(Indiekit) {
    Indiekit.addEndpoint(this);
  }
}
```

Example endpoint plug-ins:

- [`@indiekit/endpoint-auth`](https://github.com/getindiekit/indiekit/tree/main/packages/endpoint-auth) adds supports for granting and verifying IndieAuth tokens and authenticating users.

- [`@indiekit/endpoint-share`](https://github.com/getindiekit/indiekit/tree/main/packages/endpoint-share) adds a share page to Indiekit’s web interface.

[`Router`]: https://expressjs.com/en/4x/api.html#router
