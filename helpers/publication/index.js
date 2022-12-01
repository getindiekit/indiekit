import TestStore from "@indiekit-test/store";
import JekyllPreset from "@indiekit/preset-jekyll";

export const publication = {
  categories: `https://website.example/categories.json`,
  me: "https://website.example",
  postTemplate(properties) {
    return JSON.stringify(properties);
  },
  store: new TestStore({
    user: "user",
  }),
  storeMessageTemplate: (metaData) =>
    `${metaData.action} ${metaData.postType} ${metaData.fileType}`,
  preset: new JekyllPreset(),
};
