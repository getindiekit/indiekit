import _ from "lodash";

/**
 * Get merged preset and custom post types
 * @param {object} Indiekit - Indiekit instance
 * @param {Map} Indiekit.postTypes - Application post types
 * @param {object} Indiekit.publication - Publication configuration
 * @returns {object} Merged configuration
 */
export const getPostTypes = ({ postTypes, publication }) => {
  postTypes = Object.fromEntries(postTypes);

  // Add publication preset values
  if (publication.preset?.postTypes) {
    postTypes = _.merge(postTypes, publication.preset.postTypes);
  }

  // Add user configuration values
  if (publication.postTypes) {
    postTypes = _.merge(postTypes, publication.postTypes);
  }

  // Add fallback values
  for (const type of Object.keys(postTypes)) {
    const { fields, h, name } = postTypes[type];

    postTypes[type].type = type;
    postTypes[type].name = name || _.upperFirst(type);
    postTypes[type].h = h || "entry";
    postTypes[type].properties = fields && Object.keys(fields);
    postTypes[type]["required-properties"] =
      fields &&
      Object.entries(fields)
        .filter((entry) => entry[1].required)
        .map((entry) => entry[0]);
  }

  return postTypes;
};
