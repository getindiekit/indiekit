# `Indiekit.addStore`

A [content store](../../concepts.md#content-store) plug-in interfaces with CRUD (create, read, update, delete) methods provided by a file system, server, database or API.

[[toc]]

## Constructor

<!--@include: .plugin-constructor.md-->

## Properties

| Property | Type | Description |
| :------- | :--- | :---------- |
| `info` | [`Object`][] | Information about the content store. _Required_. |

### `info`

Indiekit’s web interface expects a content store plugin to provide some information about the content store it supports. This is provided by the `info` property:

```js
get info() {
  return {
    name: "Example content store",
    uid: "https://store.example"
  };
}
```

The `info` property returns the following values:

| Property | Type | Description |
| :------- | :--- | :---------- |
| `name` | [`String`][] | The name of the content store the preset supports. _Required_. |
| `uid` | [`String`][] | URL or path to content store. _Required_. |

## Methods

| Method | Type | Description |
| :----- | :--- | :---------- |
| `createFile()` | [`async function`][] | Create a file on the content store. |
| `readFile()` | [`async function`][] | Read a file from the content store. |
| `updateFile()` | [`async function`][] | Update a file on the content store. |
| `deleteFile()` | [`async function`][] | Delete a file on the content store. |

### `createFile()`

| Parameters | Type | Description |
| :--------- | :--- | :---------- |
| `path` | [`String`][] | Path to file. _Required_. |
| `content` | [`String`][] | File content. _Required_. |
| `options.message` | [`String`][] | Commit message. _Optional_. |

Returns a [`Boolean`][] if successful, else returns [`IndiekitError`][]. For example:

```js
async createFile(path, content, { message }) {
  try {
    await exampleClient.create(path, content, message);
    return true;
  } catch (error) {
    throw new IndiekitError(error.message);
  }
}
```

### `readFile()`

| Parameters | Type | Description |
| :--------- | :--- | :---------- |
| `path` | [`String`][] | Path to file. _Required_. |

Returns content as a [`String`][] if successful, else returns [`IndiekitError`][]. For example:

```js
async readFile(path) {
  try {
    await exampleClient.read(path);
    return true;
  } catch (error) {
    throw new IndiekitError(error.message);
  }
}
```

### `updateFile()`

| Parameters | Type | Description |
| :--------- | :--- | :---------- |
| `path` | [`String`][] | Path to file. _Required_. |
| `content` | [`String`][] | File content. _Required_. |
| `options.message` | [`String`][] | Commit message. _Optional_. |

Returns a [`Boolean`][] if successful, else returns [`IndiekitError`][]. For example:

```js
async updateFile(path, content, { message }) {
  try {
    await exampleClient.update(path, content, message);
    return true;
  } catch (error) {
    throw new IndiekitError(error.message);
  }
}
```

### `deleteFile()`

| Parameters | Type | Description |
| :--------- | :--- | :---------- |
| `path` | [`String`][] | Path to file. _Required_. |
| `options.message` | [`String`][] | Commit message. _Optional_. |

Returns a [`Boolean`][] if successful, else returns [`IndiekitError`][]. For example:

```js
async deleteFile(path, { message }) {
  try {
    await exampleClient.delete(path, message);
    return true;
  } catch (error) {
    throw new IndiekitError(error.message);
  }
}
```

## Example

```js
import { IndiekitError } from "@indiekit/error";
import exampleClient from 'example-client';

export default class ExampleStore {
  constructor() {
    this.id = "example-store";
    this.meta = import.meta;
    this.name = "Example store";
  }

  get info() {
    return {
      name: "Example application",
      uid: "https://store.example"
    };
  }

  async createFile(path, content, message) {
    try {
      await exampleClient.create(path, content, message);
      return true;
    } catch (error) {
      throw new IndiekitError(error.message);
    }
  }

  async readFile(path) {
    try {
      await exampleClient.read(path);
      return true;
    } catch (error) {
      throw new IndiekitError(error.message);
    }
  }

  async updateFile(path, content, message) {
    try {
      await exampleClient.update(path, content, message);
      return true;
    } catch (error) {
      throw new IndiekitError(error.message);
    }
  }

  async deleteFile(path, message) {
    try {
      await exampleClient.delete(path, content, message);
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

Example content store plug-ins:

- [`@indiekit/store-github`](https://github.com/getindiekit/indiekit/tree/main/packages/store-github) saves content to a GitHub repository.

- [`@indiekit/store-file-system`](https://github.com/getindiekit/indiekit/tree/main/packages/store-file-system) saves content to a directory on a local file system.

[`async function`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
[`Boolean`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean
[`Object`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object
[`String`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String
[`IndiekitError`]: error.md
