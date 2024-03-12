---
outline: deep
---

# `Indiekit.addSyndicator`

A [syndicator](../../concepts.md#syndicator) shares content to a third-party service such as a social network, typically via its API.

## Syntax

```js
new Indiekit.addSyndicator(options);
```

## Constructor

`options`
: An object used to customise the behaviour of the plug-in.

## Properties

`info` <Badge type="info" text="Required" />
: An object representing information about the third-party service. The `info` property should return the following values:

  `name` <Badge type="info" text="Required" />
  : A string representing the name of the third-party service the plug-in supports.

  `uid` <Badge type="info" text="Required" />
  : A string representing the URL to third-party service.

  `checked`
  : A boolean indicating whether this syndicator should be enabled by default in Micropub clients.

  `error`
  : Information about any configuration errors. This will be shown in Indiekit’s interface.

  `service`
  : An object containing information about the third-party service.

    `name`
    : A string representing the name of the third-party service.

    `url`
    : A string representing the URL of the third-party service.

    `photo`
    : A string providing a URL to an icon, logo or photo used to identify the third-party service in Micropub clients.

  `user`
  : An object containing information about the user account on the third-party service.

    `name`
    : A string representing the name of the user account.

    `url`
    : A string representing the URL for the user account.

## Methods

### `syndicate()`

An async function used to syndicate posts to the third-party service.

### `init()`

Used to register the plug-in. Accepts an `Indiekit` instance to allow its modification before returning.

#### Parameters

`properties` <Badge type="info" text="Required" />
: An object containing properties for a post. These conform to the [JF2 Post Serialisation Format](https://jf2.spec.indieweb.org).

`publication` <Badge type="info" text="Required" />
: An object containing the [publication’s configuration](/configuration/#publication).

#### Return value

A string representing the URL for the syndicated content if successful, else [`IndiekitError`][].

## Example

```js
import { IndiekitError } from "@indiekit/error";
import exampleClient from 'example-client';

export default class ExampleStore {
  constructor(options) {
    this.name = "Example syndicator";
    this.options = options;
  }

  get info() {
    const { user } = this.options;

    return {
      name: `${user} on Example service`,
      uid: `https://service.example/${user}`,
      checked: true,
      service: {
        name: "Example service",
        url: "https://service.example/",
        photo: "/assets/example-syndicator/icon.svg",
      },
      user: {
        name: user,
        url: `https://service.example/${user}`,
      },
    };
  }

  async syndicate(properties, publication) {
    try {
      return await exampleClient.post(properties, publication);
    } catch (error) {
      throw new IndiekitError(error.message, {
        cause: error,
        plugin: this.name,
        status: error.status,
      });
    }
  }

  init(Indiekit) {
    Indiekit.addSyndicator(this);
  }
}
```

### Add target information

Indiekit’s web interface expects a syndicator plug-in to provide some information about the third-party service it supports. In addition, some Micropub clients may also use this information in their publishing interface. This information is provided by the `info` property:

```js
get info() {
  const { user } = this.options;

  return {
    name: `${user} on Example service`,
    uid: `https://service.example/${user}`,
    checked: true,
    service: {
      name: "Example service",
      url: "https://service.example/",
      photo: "/assets/example-syndicator/icon.svg",
    },
    user: {
      name: user,
      url: `https://service.example/${user}`,
    },
  };
}
```

## See also

Example syndicator plug-ins:

- [`@indiekit/syndicator-internet-archive`](https://github.com/getindiekit/indiekit/tree/main/packages/syndicator-internet-archive) saves content to the Internet Archive.

[`IndiekitError`]: error.md
