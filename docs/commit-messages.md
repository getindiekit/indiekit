# Customising commit messages

Indiekit provides content store plug-ins with a `metaData` object. This contains the following meta data that can be used in commit messages:

* `action`: Action to take i.e. ‘create’, ‘upload’.
* `result`: Result of action, i.e. ‘created’, ’uploaded'.
* `fileType`: File type, i.e. ’post’ or ‘file‘.
* `postType`: IndieWeb post type, i.e. ‘note’, ‘photo’, ‘reply’.

By default, Indiekit outputs the `action`, `postType` and `fileType`, for example `create photo post`. If you want to change the format to output `Created a photo post`, you can do the following:

```js
const _ = require('lodash');

indiekit.set('publication.storeMessageTemplate', metaData => {
  const {result, postType, fileType} = metaData;
  return `${_.upperFirst(result)} a ${postType} ${fileType}`;
});
```
