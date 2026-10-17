import plur from "plur";

/**
 * Get paths and URLs for configured post types
 * @param {Map<string, Partial<IndiekitPostType>>} postTypes - Post type configuration
 * @returns {Record<string, Partial<IndiekitPostType>>} Updated post type configuration
 */
export const getPostTypes = (postTypes) => {
  /**
   * @type {Record<string, Partial<IndiekitPostType>>}
   */
  const presetPostTypes = {};

  for (const [type, postType] of postTypes) {
    // A page has no date and lives at the root, where Eleventy serves it
    if (type === "page") {
      presetPostTypes[type] = {
        ...postType,
        post: {
          path: "{slug}.md",
          url: "{slug}",
        },
        media: {
          path: "media/pages/{filename}",
        },
      };
      continue;
    }

    const collection = plur(type);

    presetPostTypes[type] = {
      ...postType,
      post: {
        path: `${collection}/{yyyy}/{MM}/{dd}/{slug}.md`,
        url: `${collection}/{yyyy}/{MM}/{dd}/{slug}`,
      },
      media: {
        path: `media/${collection}/{yyyy}/{MM}/{dd}/{filename}`,
      },
    };
  }

  return presetPostTypes;
};
