# Plug-in API

Indiekit is a Node.js Express server designed to interoperate with IndieWeb protocols and features. Plug-ins allow new features to be added, and different protocols and specifications to be supported.

A plug-in can provide any of the following features:

* [application endpoints](add-endpoint.md)
* [publication presets](add-preset.md)
* [content store functions](add-store.md)
* [syndication functions](add-syndicator.md)

## Anatomy of a plug-in

A plug-in is a `Class` with an `init()` function that is used to register endpoints, presets, stores and syndicators. You can also use the `init()` function to modify Indiekit’s [configuration](../../configuration/index.md). For example:

```js
export default class PluginName {
  constructor() {
    this.id = "plugin-name";
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

### Plug-in icon

To provide an icon for your plug-in, include a square shaped SVG file at `/assets/icon.svg`.

### Homepage widget

To provide a small widget for the signed-in homepage, include a Nunjucks file at `/includes/[plugin.id]-widget.njk`, and use the `widget` component to ensure correct markup and styling. [Here’s an example](https://github.com/getindiekit/indiekit/blob/main/packages/endpoint-posts/includes/endpoint-posts-widget.njk).
