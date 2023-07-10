# `Indiekit.addSyndicator`

A [syndicator](../../concepts.md#syndicator) plug-in syndicates content to a third-party service such as a social network via its API.

[[toc]]

## Constructor

<!--@include: .plugin-constructor.md-->

## Properties

| Property | Type | Description |
| :------- | :--- | :---------- |
| `info` | [`Object`][]  | Information about the syndicator. |

### `info`

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

The `info` property returns the following values:

| Property | Type | Description |
| :------- | :--- | :---------- |
| `name` | [`String`][] | The name of the third-party service the syndicator supports. _Required_. |
| `uid` | [`String`][] | URL or path to the syndication target. _Required_. |
| `checked` | [`Boolean`][] | Whether this syndicator should be enabled by default in Micropub clients. _Optional_. |
| `service.name` | [`String`][] | Name of the third-party service. _Optional_. |
| `service.url` | [`String`][] | URL of the third-party service. _Optional_. |
| `service.photo` | [`String`][] | Icon, logo or photo used to identify the third-party service in Micropub clients. _Optional_. |
| `user.name` | [`String`][] | Name of the user on the third-party service. _Optional_. |
| `user.url` | [`String`][] | URL for the user on the third-party service. _Optional_. |

## Methods

| Method | Type | Description |
| :----- | :--- | :---------- |
| `syndicate()` | `async function` | Syndicate a post to a third-party service. |

### `syndicate()`

| Parameters | Type | Description |
| :--------- | :--- | :---------- |
| `properties` | [`Object`][] | Path to file. _Required_. |
| `publication` | [`Object`][] | Path to file. _Required_. |

Returns the URL for the syndicated content as a [`String`][] if successful, else returns [`IndiekitError`][]. For example:

```js
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
```

## Example

```js
import { IndiekitError } from "@indiekit/error";
import exampleClient from 'example-client';

export default class ExampleStore {
  constructor(options) {
    this.id = "example-syndicator";
    this.meta = import.meta;
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

Example syndicator plug-ins:

- [`@indiekit/syndicator-internet-archive`](https://github.com/getindiekit/indiekit/tree/main/packages/syndicator-internet-archive) saves content to the Internet Archive.

- [`@indiekit/syndicator-twitter`](https://github.com/getindiekit/indiekit/tree/main/packages/syndicator-twitter) syndicates content to Twitter.

[`async function`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
[`Boolean`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean
[`Object`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object
[`String`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String
