import JekyllPreset from "@indiekit/preset-jekyll";
import TestStore from "@indiekit-test/store";

/**
 * Create publication configuration for testing
 * @param {Partial<IndiekitPublication>} [values] - Values to use instead
 * @returns {IndiekitPublication} Publication configuration
 */
export const testPublication = (values) => ({
  categories: [],
  channels: {},
  locale: "en",
  me: "https://website.example",
  mediaStore: new TestStore({ user: "user" }),
  postTemplate: (properties) => JSON.stringify(properties),
  postTypes: {},
  preset: new JekyllPreset(),
  slugSeparator: "-",
  store: new TestStore({ user: "user" }),
  storeMessageTemplate: (metadata) =>
    `${metadata.action} ${metadata.postType} ${metadata.fileType}`,
  syndicationTargets: [],
  ...values,
});
