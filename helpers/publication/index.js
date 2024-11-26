import JekyllPreset from "@indiekit/preset-jekyll";
import TestStore from "@indiekit-test/store";

export const publication = {
  categories: `https://website.example/categories.json`,
  me: "https://website.example",
  postTemplate(properties) {
    return JSON.stringify(properties);
  },
  mediaStore: new TestStore({
    user: "user",
  }),
  store: new TestStore({
    user: "user",
  }),
  storeMessageTemplate: (metaData) =>
    `${metaData.action} ${metaData.postType} ${metaData.fileType}`,
  preset: new JekyllPreset(),
};
