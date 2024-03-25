---
outline: deep
---

# `Indiekit.addEndpoint`

An [endpoint](../../concepts.md#endpoint) adds Express routes to an Indiekit server. Routes can add new pages to the web interface, or provide API endpoints that support IndieWeb (or other) protocols or APIs.

## Syntax

```js
new Indiekit.addEndpoint(options);
```

## Constructor

`options`
: An object used to customise the behaviour of the plug-in.

## Properties

`name`
: A string with a human readable plug-in name. **Required**.

`mountPath`
: A string representing the path to mount routes onto. **Required**.

`navigationItems`
: A single or array of [`NavigationItem`](#navigationitem) objects used to add items to the web interface’s navigation menu.

`shortcutItems`
: A single or array of [`ShortcutItem`](#shortcutitem) objects used to add [`shortcut` items](https://developer.mozilla.org/en-US/docs/Web/Manifest/shortcuts) to the web app manifest.

## Methods

### `routes()`

An Express [`Router`](#router) supplying routes that require authentication to access.

### `routesPublic()`

An Express [`Router`](#router) supplying routes that can be publicly accessed.

### `routesWellKnown()`

An Express [`Router`](#router) supplying routes that can be accessed at `/.well-known/`.

### `init()`

Used to register the plug-in. Accepts an `Indiekit` instance to allow its modification before returning.

## Interfaces

### `NavigationItem`

`href`
: A string representing the path to the page and used for the link’s `href` attribute. **Required**.

`text`
: A string representing the text shown in the navigation item. **Required**.

`requiresDatabase`
: A boolean for whether the item should only be displayed if a database has been configured.

### `Router`

[Learn about `Router` in the Express.js documentation](https://expressjs.com/en/4x/api.html#router):

> A router object is an isolated instance of middleware and routes. You can think of it as a “mini-application,” capable only of performing middleware and routing functions.

### `ShortcutItem`

`url`
: A string representing the path to the page and used for the shortcut’s `url` attribute. **Required**.

`name`
: A string representing the text shown in the shortcut item. **Required**.

`requiresDatabase`
: A boolean for whether the item should only be displayed if a database has been configured.

## Example

```js
import express from "express";

const router = express.Router();

export default class ExampleEndpoint {
  constructor(options) {
    this.name = "Example endpoint";
    this.mountPath = this.options.mountPath;
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

### Add navigation items

You can add items to the web interface’s navigation menu using the `navigationItems` method. For example, to add a link to the `/example` path:

```js
get navigationItems() {
  return {
    href: this.mountPath,
    text: "Example",
  };
}
```

`navigationItems` will accept either an object or an array. Use an array if you want to add multiple items, for example:

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

If your plug-in is localised, the `text` value should be the key path used in the corresponding localisation string, for example:

```js
get navigationItems() {
  return {
    href: this.mountPath,
    text: "example.navigation.label",
  };
}
```

### Add routes

Routes can be added to Indiekit’s [Express](https://expressjs.com) server by providing an instance of an Express [`Router`](https://expressjs.com/en/4x/api.html#router) with the paths and methods you wish to support.

For example, given a `mountPath` of `/example`, to accept a `POST` request at `/example/secret`, add the following:

```js
get routes() {
  router.post("/secret", (req, res, next) => {…});
  return router;
}
```

The `routes` method attaches routes to Indiekit’s own router after rate limiting and authentication middleware. Any request to your endpoint path will therefore require a user to be signed in or otherwise authenticated.

You can bypass authentication by using the `routesPublic` method.

For example, given a `mountPath` of `/example`, to accept an unauthenticated `GET` request at `/example/public`, add the following:

```js
get routesPublic() {
  router.get("/public", (req, res, next) => {…});
  return router;
}
```

Sometimes its necessary to serve requests to [.well-known paths](https://tools.ietf.org/html/rfc5785), standardized locations for discovering domain-wide metadata (see this registry of [Well-Known URIs](https://www.iana.org/assignments/well-known-uris/well-known-uris.xhtml)).

The `routesWellKnown` method allows you to add resources at this location.

For example, to accept a `GET` request at [`/.well-known/posh/spice.json`](https://www.rfc-editor.org/rfc/rfc7711.html), add the following:

```js
get routesWellKnown() {
  router.get("/posh/spice.json", (req, res, next) => {…});
  return router;
}
```

## See also

Example endpoint plug-in implementations:

- [`@indiekit/endpoint-auth`](https://github.com/getindiekit/indiekit/tree/main/packages/endpoint-auth) adds supports for granting and verifying IndieAuth tokens and authenticating users.

- [`@indiekit/endpoint-share`](https://github.com/getindiekit/indiekit/tree/main/packages/endpoint-share) adds a share page to Indiekit’s web interface.
