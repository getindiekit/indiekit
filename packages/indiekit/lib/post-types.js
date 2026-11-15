import _ from "lodash";

/**
 * Get merged preset and custom post types
 * @param {IndiekitInstance} Indiekit - Indiekit instance
 * @returns {Record<string, IndiekitPostType>} Merged configuration
 */
export const getPostTypes = ({
  config,
  postTypes: pluginPostTypes,
  publication,
}) => {
  let postTypes = Object.fromEntries(pluginPostTypes);

  // Add publication preset values
  if (publication.preset?.postTypes) {
    postTypes = _.merge(postTypes, publication.preset.postTypes);
  }

  // Add user configuration values
  if (config.publication.postTypes) {
    postTypes = _.merge(postTypes, config.publication.postTypes);
  }

  // Add fallback values
  for (const [type, postType] of Object.entries(postTypes)) {
    const { fields, h = "entry", name } = postType;

    postType.type = type;
    postType.name = name || _.upperFirst(type);
    postType.h = h;
    postType.properties = fields && Object.keys(fields);
    postType["required-properties"] =
      fields &&
      Object.entries(fields)
        .filter((entry) => entry[1].required)
        .map((entry) => entry[0]);
  }

  // Only return fully configured post types, now with a type and name
  const fullyConfiguredPostTypes =
    /** @type {Record<string, IndiekitPostType>} */ (
      Object.fromEntries(
        Object.entries(postTypes).filter(([, value]) => value.properties),
      )
    );

  return fullyConfiguredPostTypes;
};
