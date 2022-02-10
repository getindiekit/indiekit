---
parent: Customisation
nav_order: 5
---

# Commit messages

Indiekit provides content store plug-ins with a `metaData` object. This contains the following meta data that can be used in commit messages:

- `action`: Action to take i.e. ‘create’, ‘upload’.
- `result`: Result of action, i.e. ‘created’, ’uploaded'.
- `fileType`: File type, i.e. ’post’ or ‘file‘.
- `postType`: IndieWeb post type, i.e. ‘note’, ‘photo’, ‘reply’.

By default, Indiekit outputs the `action`, `postType` and `fileType`, for example:

> `create photo post`  
> `upload photo file`

If you want to change the commit message format, you can do the following:

```js
// indiekit.config.cjs
export default {
  publication: {
    storeMessageTemplate: (metaData) =>
      `🤖 ${metaData.result} a ${metaData.postType} ${metaData.fileType}`,
  },
};
```

For a photo post, this would create the following commit messages:

> `🤖 created a photo post`\\ > `🤖 uploaded a photo file`
