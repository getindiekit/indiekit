import snakecaseKeys from "snakecase-keys";
import YAML from "yaml";

export default class JekyllPreset {
  constructor() {
    this.id = "jekyll";
    this.meta = import.meta;
    this.name = "Jekyll preset";
  }

  get info() {
    return {
      name: "Jekyll",
    };
  }

  /**
   * Get content
   * @access private
   * @param {object} properties - JF2 properties
   * @returns {string} Content
   */
  #content(properties) {
    if (properties.content) {
      const content =
        properties.content.text ||
        properties.content.html ||
        properties.content;
      return `\n${content}\n`;
    } else {
      return "";
    }
  }

  /**
   * Get front matter
   * @access private
   * @param {object} properties - JF2 properties
   * @returns {string} Front matter
   */
  #frontMatter(properties) {
    /*
     * Jekyll uses snake_case for YAML property keys, i.e. `excerpt_separator`
     * @see {link: https://jekyllrb.com/docs/posts/#post-excerpts}
     */
    properties = snakecaseKeys(properties, { deep: true });

    /*
     * Replace Microformat properties with Jekyll equivalents
     * @see {@link https://jekyllrb.com/docs/front-matter/#predefined-variables-for-posts}
     */
    properties = {
      date: properties.published,
      ...(properties.name && { title: properties.name }),
      ...(properties.summary && { excerpt: properties.summary }),
      ...properties,
    };

    /*
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
    delete properties.summary; // Use `excerpt`
    delete properties.type; // Not required
    delete properties.url; // Not required

    const frontMatter = YAML.stringify(properties, { lineWidth: 0 });
    return `---\n${frontMatter}---\n`;
  }

  /**
   * Post types
   * @returns {object} Post types configuration
   */
  get postTypes() {
    return [
      {
        type: "article",
        name: "Article",
        post: {
          path: "_posts/{yyyy}-{MM}-{dd}-{slug}.md",
          url: "{yyyy}/{MM}/{dd}/{slug}",
        },
        media: {
          path: "media/{yyyy}/{MM}/{dd}/{filename}",
        },
      },
      {
        type: "note",
        name: "Note",
        post: {
          path: "_notes/{yyyy}-{MM}-{dd}-{slug}.md",
          url: "notes/{yyyy}/{MM}/{dd}/{slug}",
        },
      },
      {
        type: "photo",
        name: "Photo",
        post: {
          path: "_photos/{yyyy}-{MM}-{dd}-{slug}.md",
          url: "photos/{yyyy}/{MM}/{dd}/{slug}",
        },
        media: {
          path: "media/photos/{yyyy}/{MM}/{dd}/{filename}",
        },
      },
      {
        type: "video",
        name: "Video",
        post: {
          path: "_videos/{yyyy}-{MM}-{dd}-{slug}.md",
          url: "videos/{yyyy}/{MM}/{dd}/{slug}",
        },
        media: {
          path: "media/videos/{yyyy}/{MM}/{dd}/{filename}",
        },
      },
      {
        type: "audio",
        name: "Audio",
        post: {
          path: "_audio/{yyyy}-{MM}-{dd}-{slug}.md",
          url: "audio/{yyyy}/{MM}/{dd}/{slug}",
        },
        media: {
          path: "media/audio/{yyyy}/{MM}/{dd}/{filename}",
        },
      },
      {
        type: "bookmark",
        name: "Bookmark",
        post: {
          path: "_bookmarks/{yyyy}-{MM}-{dd}-{slug}.md",
          url: "bookmarks/{yyyy}/{MM}/{dd}/{slug}",
        },
      },
      {
        type: "checkin",
        name: "Checkin",
        post: {
          path: "_checkins/{yyyy}-{MM}-{dd}-{slug}.md",
          url: "checkins/{yyyy}/{MM}/{dd}/{slug}",
        },
      },
      {
        type: "event",
        name: "Event",
        post: {
          path: "_events/{yyyy}-{MM}-{dd}-{slug}.md",
          url: "events/{yyyy}/{MM}/{dd}/{slug}",
        },
      },
      {
        type: "rsvp",
        name: "RSVP",
        post: {
          path: "_replies/{yyyy}-{MM}-{dd}-{slug}.md",
          url: "replies/{yyyy}/{MM}/{dd}/{slug}",
        },
      },
      {
        type: "reply",
        name: "Reply",
        post: {
          path: "_replies/{yyyy}-{MM}-{dd}-{slug}.md",
          url: "replies/{yyyy}/{MM}/{dd}/{slug}",
        },
      },
      {
        type: "repost",
        name: "Repost",
        post: {
          path: "_reposts/{yyyy}-{MM}-{dd}-{slug}.md",
          url: "reposts/{yyyy}/{MM}/{dd}/{slug}",
        },
      },
      {
        type: "like",
        name: "Like",
        post: {
          path: "_likes/{yyyy}-{MM}-{dd}-{slug}.md",
          url: "likes/{yyyy}/{MM}/{dd}/{slug}",
        },
      },
    ];
  }

  /**
   * Post template
   * @param {object} properties - JF2 properties
   * @returns {string} Rendered template
   */
  postTemplate(properties) {
    const content = this.#content(properties);
    const frontMatter = this.#frontMatter(properties);

    return frontMatter + content;
  }

  init(Indiekit) {
    Indiekit.addPreset(this);
  }
}
