import JekyllPreset from "@indiekit/preset-jekyll";
import TestStore from "@indiekit-test/store";

export const publication = {
  categories: `https://website.example/categories.json`,
  me: "https://website.example",
  postTemplate: (/** @type {Jf2Properties} */ properties) =>
    JSON.stringify(properties),
  mediaStore: new TestStore({
    user: "user",
  }),
  store: new TestStore({
    user: "user",
  }),
  storeMessageTemplate: (
    /** @type {Parameters<IndiekitPublication["storeMessageTemplate"]>[0]} */ metadata,
  ) => `${metadata.action} ${metadata.postType} ${metadata.fileType}`,
  preset: new JekyllPreset(),
};
