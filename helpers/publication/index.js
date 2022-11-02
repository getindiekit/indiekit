import process from "node:process";
import "dotenv/config.js"; // eslint-disable-line import/no-unassigned-import
import TestStore from "@indiekit-test/store";
import JekyllPreset from "@indiekit/preset-jekyll";

export const publication = {
  categories: `${process.env.TEST_PUBLICATION_URL}categories.json`,
  me: process.env.TEST_PUBLICATION_URL,
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
