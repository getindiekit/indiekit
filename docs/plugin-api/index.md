---
has_children: true
nav_order: 7
has_toc: false
---

# Plug-in API

Indiekit is a Node.js Express server designed to interoperate with IndieWeb protocols and features. Plug-ins allow new features to be added, and different protocols and specifications to be supported.

A plug-in can provide any of the following features:

* [application endpoints](add-endpoint.md)
* [publication presets](add-preset.md)
* [content store functions](add-store.md)
* [syndication functions](add-syndicator.md)

## Anatomy of a plug-in

A plug-in is a `Class` with an `init()` function that is used to register endpoints, presets, stores and syndicators. You can also use the `init()` function to modify Indiekit’s [configuration](/options). For example:

```js
export default class PluginName {
  constructor() {
    this.id = "plugin-name";
    this.meta = import.meta;
    this.name = "Plugin name";
  }

  syndicate() {…}

  init(Indiekit) {
    // Register a plug-in method
    Indiekit.addSyndicator(this)

    // Update Indiekit’s configuration
    Indiekit.config.application.foo = "bar"
  }
};
```

## Folder structure

Indiekit expects plug-in packages to provide assets in the following directories:

| Folder name | Contents |
| :---------- | :------- |
| `/assets` | Static files (for example images, stylesheets). _Optional_. |
| `/includes` | Nunjucks partials used in views. _Optional_. |
| `/locales` | Localisation files. _Optional_. |
| `/views` | Nunjucks view templates. _Optional_. |

You can also choose to provide an icon for your plug-in. This should be a square shaped SVG provided at `/assets/icon.svg`.
