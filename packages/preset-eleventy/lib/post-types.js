import plur from "plur";

/**
 * Get paths and URLs for configured post types
 * @param {object} postTypes - Post type configuration
 * @returns {object} Updated post type configuration
 */
export const getPostTypes = (postTypes) => {
  for (const type of postTypes.keys()) {
    const collection = plur(type);

    postTypes.set(type, {
      ...postTypes.get(type),
      post: {
        path: `${collection}/{yyyy}-{MM}-{dd}-{slug}.md`,
        url: `${collection}/{yyyy}/{MM}/{dd}/{slug}`,
      },
      media: {
        path: `media/${collection}/{yyyy}/{MM}/{dd}/{filename}`,
      },
    });
  }

  return postTypes;
};
