import plur from "plur";

/**
 * Get paths and URLs for configured post types
 * @param {object} postTypes - Post type configuration
 * @returns {object} Updated post type configuration
 */
export const getPostTypes = (postTypes) => {
  const types = [];

  for (const postType of postTypes) {
    const { type } = postType;
    const section = plur(type);

    /**
     * Follow Hugo content management guidelines
     * @see {@link https://gohugo.io/content-management/organization/}
     * @see {@link https://gohugo.io/content-management/static-files/}
     */
    types.push({
      type,
      post: {
        path: `content/${section}/{slug}.md`,
        url: `${section}/{slug}`,
      },
      media: {
        path: `static/${section}/{filename}`,
        url: `${section}/{filename}`,
      },
    });
  }

  return types;
};
