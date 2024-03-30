import snakecaseKeys from "snakecase-keys";
import YAML from "yaml";

/**
 * Get content
 * @access private
 * @param {object} properties - JF2 properties
 * @returns {string} Content
 */
const getContent = (properties) => {
  if (properties.content) {
    const content =
      properties.content.text || properties.content.html || properties.content;
    return `\n${content}\n`;
  } else {
    return "";
  }
};

/**
 * Get front matter
 * @access private
 * @param {object} properties - JF2 properties
 * @returns {string} Front matter in chosen format
 */
const getFrontMatter = (properties) => {
  /**
   * Jekyll uses snake_case for YAML property keys, i.e. `excerpt_separator`
   * @see {@link https://jekyllrb.com/docs/posts/#post-excerpts}
   */
  properties = snakecaseKeys(properties, { deep: true });

  /**
   * Replace Microformat properties with Jekyll equivalents
   * @see {@link https://jekyllrb.com/docs/front-matter/ #predefined-variables-for-posts}
   */
  properties = {
    date: properties.published,
    ...(properties.name && { title: properties.name }),
    ...(properties.summary && { excerpt: properties.summary }),
    ...properties,
  };

  /**
   * Draft posts
   * @see {@link https://jekyllrb.com/docs/front-matter/#predefined-global-variables}
   */
  if (properties.post_status === "draft") {
    properties.published = false;
  } else {
    delete properties.published;
  }

  delete properties.content; // Shown below front matter
  delete properties.name; // Use `title`
  delete properties.post_status; // Use `published`
  delete properties.slug; // File path dictates slug
  delete properties.summary; // Use `excerpt`
  delete properties.type; // Not required
  delete properties.url; // Not required

  const frontMatter = YAML.stringify(properties, { lineWidth: 0 });
  return `---\n${frontMatter}---\n`;
};

/**
 * Get post template
 * @param {object} properties - JF2 properties
 * @returns {string} Rendered template
 */
export const getPostTemplate = (properties) => {
  const content = getContent(properties);
  const frontMatter = getFrontMatter(properties);

  return frontMatter + content;
};
