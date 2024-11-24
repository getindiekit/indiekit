import plur from "plur";

/**
 * Get paths and URLs for configured post types
 * @param {Map} postTypes - Post type configuration
 * @returns {object} Updated post type configuration
 */
export const getPostTypes = (postTypes) => {
  for (const type of postTypes.keys()) {
    const collection = plur(type);

    if (type === "article") {
      /**
       * Posts use `_posts` folder
       * @see {@link https://jekyllrb.com/docs/posts/}
       */
      postTypes.set("article", {
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
      /**
       * Other post types use collection folders
       * @see {@link https://jekyllrb.com/docs/collections/}
       */
      postTypes.set(type, {
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

  return postTypes;
};
