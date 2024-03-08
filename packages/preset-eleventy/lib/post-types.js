import plur from "plur";

/**
 * Get paths and URLs for configured post types
 * @param {object} postTypes - Post type configuration
 * @returns {object} Updated post type configuration
 */
export const getPostTypes = (postTypes) => {
  for (const type of Object.keys(postTypes)) {
    const collection = plur(type);

    postTypes[type] = {
      ...postTypes[type],
      post: {
        path: `${collection}/{yyyy}-{MM}-{dd}-{slug}.md`,
        url: `${collection}/{yyyy}/{MM}/{dd}/{slug}`,
      },
      media: {
        path: `media/${collection}/{yyyy}/{MM}/{dd}/{filename}`,
      },
    };
  }

  return postTypes;
};
