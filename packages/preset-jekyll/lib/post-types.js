import plur from "plur";

/**
 * Get paths and URLs for configured post types
 * @param {Map} postTypes - Post type configuration
 * @returns {object} Updated post type configuration
 */
/**
 * Get paths and URLs for configured post types
 * @param {Map} postTypes - Post type configuration
 * @returns {object} Updated post type configuration
 */
export const getPostTypes = (postTypes) => {
  const updates = new Map();

  for (const type of postTypes.keys()) {
    const collection = plur(type);

    if (type === "page") {
      // A page has no date; an index file in its own directory is served at
      // its URL without a permalink setting
      updates.set("page", {
        ...postTypes.get("page"),
        post: {
          path: "{slug}/index.md",
          url: "{slug}",
        },
        media: {
          path: "media/pages/{filename}",
        },
      });
    } else if (type === "article") {
      updates.set("article", {
        ...postTypes.get("article"),
        post: {
          path: "_posts/{yyyy}-{MM}-{dd}-{slug}.md",
          url: "{yyyy}/{MM}/{dd}/{slug}",
        },
        media: {
          path: "media/{yyyy}/{MM}/{dd}/{filename}",
        },
      });
    } else {
      updates.set(type, {
        ...postTypes.get(type),
        post: {
          path: `_${collection}/{yyyy}-{MM}-{dd}-{slug}.md`,
          url: `${collection}/{yyyy}/{MM}/{dd}/{slug}`,
        },
        media: {
          path: `media/${collection}/{yyyy}/{MM}/{dd}/{filename}`,
        },
      });
    }
  }

  for (const [type, value] of updates) {
    postTypes.set(type, value);
  }

  return postTypes;
};
