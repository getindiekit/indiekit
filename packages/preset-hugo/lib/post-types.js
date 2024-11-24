import plur from "plur";

/**
 * Get paths and URLs for configured post types
 * @param {Map} postTypes - Post type configuration
 * @returns {object} Updated post type configuration
 */
export const getPostTypes = (postTypes) => {
  for (const type of postTypes.keys()) {
    const section = plur(type);

    /**
     * Follow Hugo content management guidelines
     * @see {@link https://gohugo.io/content-management/organization/}
     * @see {@link https://gohugo.io/content-management/static-files/}
     */
    postTypes.set(type, {
      ...postTypes.get(type),
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

  return postTypes;
};
