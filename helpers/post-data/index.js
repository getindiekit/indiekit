export const postData = {
  storeProperties: {
    path: "foo.md",
  },
  properties: {
    name: "note",
    "post-status": "published",
    "post-type": "note",
    published: "2020-01-01T00:00:00+00:00",
    url: "https://website.example/foo",
  },
};

export const deletedPostData = {
  storeProperties: {
    path: "foo.md",
  },
  properties: {
    deleted: "2020-01-02T00:00:00+00:00",
    name: "note",
    "post-type": "note",
    published: "2020-01-01T00:00:00+00:00",
    url: "https://website.example/foo",
  },
  _deletedProperties: {
    name: "note",
    "post-status": "published",
    "post-type": "note",
    published: "2020-01-01T00:00:00+00:00",
    url: "https://website.example/foo",
  },
};
