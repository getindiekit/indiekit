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
    // A page has no date and lives at the root of the content directory
    if (type === "page") {
      presetPostTypes.page = {
        ...postType,
        post: { path: "content/{slug}.md", url: "{slug}" },
        media: { path: "static/pages/{filename}", url: "pages/{filename}" },
      };
      continue;
    }

    const section = plur(type);

    /**
     * Follow Hugo content management guidelines
     * @see {@link https://gohugo.io/content-management/organization/}
     * @see {@link https://gohugo.io/content-management/static-files/}
     */
    presetPostTypes[type] = {
      ...postType,
      post: { path: `content/${section}/{slug}.md`, url: `${section}/{slug}` },
      media: {
        path: `static/${section}/{filename}`,
        url: `${section}/{filename}`,
      },
    };
  }

  return presetPostTypes;
};
