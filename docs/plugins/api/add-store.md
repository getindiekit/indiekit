---
outline: deep
---

# `Indiekit.addStore`

A [content store](../../concepts.md#content-store) interfaces with CRUD (create, read, update, delete) methods provided by a file system, version control system, server, database or API.

## Syntax

```js
new Indiekit.addStore(options);
```

## Constructor

`options`
: An object used to customise the behaviour of the plug-in.

## Properties

`info` <Badge type="info" text="Required" />
: An object representing information about the content store. The `info` property should return the following values:

  `name` <Badge type="info" text="Required" />
  : The name of the content store the plug-in supports.

  `uid` <Badge type="info" text="Required" />
  : URL or path to content store.

## Methods

### `createFile()`

An async function that creates a file on the content store.

#### Parameters

`filePath` <Badge type="info" text="Required" />
: A string representing the path to a file.

`content` <Badge type="info" text="Required" />
: A string representing the file content.

`options.message`
: A string representing the commit message.

#### Return value

A string containing the file’s URL if successful, else [`IndiekitError`][].

### `readFile()`

An async function that reads a file from the content store.

#### Parameters

`filePath` <Badge type="info" text="Required" />
: A string representing the path to a file.

#### Return value

A string containing the file’s content if successful, else [`IndiekitError`][].

### `updateFile()`

An async function that updates a file on the content store.

#### Parameters

`filePath` <Badge type="info" text="Required" />
: A string representing the path to a file.

`content` <Badge type="info" text="Required" />
: A string representing the updated file content.

`options.message`
: A string representing the commit message.

`options.newPath`
: A string representing the new path to file, if changed.

#### Return value

A string containing the file’s updated URL if successful, else [`IndiekitError`][].

### `deleteFile()`

An async function that deletes a file on the content store.

#### Parameters

`filePath` <Badge type="info" text="Required" />
: A string representing the path to a file.

`options.message`
: A string representing the commit message.

#### Return value

`true` if successful, else [`IndiekitError`][].

### `init()`

Used to register the plug-in. Accepts an `Indiekit` instance to allow its modification before returning.

## Example

```js
import { IndiekitError } from "@indiekit/error";
import exampleClient from 'example-client';

export default class ExampleStore {
  constructor() {
    this.name = "Example store";
  }

  get info() {
    return {
      name: "Example application",
      uid: "https://store.example"
    };
  }

  async createFile(filePath, content, message) {
    try {
      await exampleClient.create(filePath, content, message);
      return true;
    } catch (error) {
      throw new IndiekitError(error.message);
    }
  }

  async readFile(filePath) {
    try {
      await exampleClient.read(filePath);
      return true;
    } catch (error) {
      throw new IndiekitError(error.message);
    }
  }

  async updateFile(filePath, content, message) {
    try {
      await exampleClient.update(filePath, content, message);
      return true;
    } catch (error) {
      throw new IndiekitError(error.message);
    }
  }

  async deleteFile(filePath, message) {
    try {
      await exampleClient.delete(filePath, content, message);
      return true;
    } catch (error) {
      throw new IndiekitError(error.message);
    }
  }

  init(Indiekit) {
    Indiekit.addStore(this);
  }
}
```

### Add store information

Indiekit’s web interface expects a content store plugin to provide some information about the content store it supports. This is provided by the `info` property:

```js
get info() {
  return {
    name: "Example content store",
    uid: "https://store.example"
  };
}
```

## See also

Example content store plug-ins:

- [`@indiekit/store-github`](https://github.com/getindiekit/indiekit/tree/main/packages/store-github) saves content to a GitHub repository.

- [`@indiekit/store-file-system`](https://github.com/getindiekit/indiekit/tree/main/packages/store-file-system) saves content to a directory on a local file system.

[`IndiekitError`]: error.md
