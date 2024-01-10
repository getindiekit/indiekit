import camelcaseKeys from "camelcase-keys";
import TOML from "@iarna/toml";
import YAML from "yaml";

const defaults = {
  frontMatterFormat: "yaml",
};

export default class HugoPreset {
  constructor(options = {}) {
    this.id = "hugo";
    this.meta = import.meta;
    this.name = "Hugo preset";
    this.options = { ...defaults, ...options };
  }

  get info() {
    return {
      name: "Hugo",
    };
  }

  get prompts() {
    return [
      {
        type: "select",
        name: "frontMatterFormat",
        message: "Which front matter format are you using?",
        choices: [
          {
            title: "JSON",
            value: "json",
          },
          {
            title: "TOML",
            value: "toml",
          },
          {
            title: "YAML",
            value: "yaml",
          },
        ],
        initial: 2,
      },
    ];
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
   * @returns {string} Front matter in chosen format
   */
  #frontMatter(properties) {
    let delimiters;
    let frontMatter;

    /*
     * Go templates don’t accept hyphens in property names
     * and Hugo camelCases its predefined front matter keys
     * @see {link: https://gohugo.io/content-management/front-matter/}
     */
    properties = camelcaseKeys(properties, { deep: true });

    /*
     * Replace Microformat properties with Hugo equivalents
     * @see {link: https://gohugo.io/content-management/front-matter/}
     */
    properties = {
      date: properties.published,
      publishDate: properties.published,
      ...(properties.postStatus === "draft" && { draft: true }),
      ...(properties.updated && { lastmod: properties.updated }),
      ...(properties.deleted && { expiryDate: properties.deleted }),
      ...(properties.name && { title: properties.name }),
      ...(properties.photo && {
        images: properties.photo.map((image) => image.url),
      }),
      ...properties,
    };

    delete properties.content; // Shown below front matter
    delete properties.deleted; // Use `expiryDate`
    delete properties.name; // Use `title`
    delete properties.postStatus; // Use `draft`
    delete properties.published; // Use `date`
    delete properties.type; // Not required
    delete properties.updated; // Use `lastmod`
    delete properties.url; // Not required

    switch (this.options.frontMatterFormat) {
      case "json": {
        delimiters = ["", "\n"];
        frontMatter = JSON.stringify(properties, undefined, 2);
        break;
      }

      case "toml": {
        delimiters = ["+++\n", "+++\n"];
        frontMatter = TOML.stringify(properties);
        break;
      }

      default: {
        delimiters = ["---\n", "---\n"];
        frontMatter = YAML.stringify(properties, { lineWidth: 0 });
        break;
      }
    }

    return `${delimiters[0]}${frontMatter}${delimiters[1]}`;
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
          path: "content/articles/{slug}.md",
          url: "articles/{slug}",
        },
        media: {
          path: "static/articles/{filename}",
          url: "articles/{filename}",
        },
      },
      {
        type: "note",
        name: "Note",
        post: {
          path: "content/notes/{slug}.md",
          url: "notes/{slug}",
        },
      },
      {
        type: "photo",
        name: "Photo",
        post: {
          path: "content/photos/{slug}.md",
          url: "photos/{slug}",
        },
        media: {
          path: "static/photos/{filename}",
          url: "photos/{filename}",
        },
      },
      {
        type: "video",
        name: "Video",
        post: {
          path: "content/videos/{slug}.md",
          url: "videos/{slug}",
        },
        media: {
          path: "static/videos/{filename}",
          url: "videos/{filename}",
        },
      },
      {
        type: "audio",
        name: "Audio",
        post: {
          path: "content/audio/{slug}.md",
          url: "audio/{slug}",
        },
        media: {
          path: "static/audio/{filename}",
          url: "audio/{filename}",
        },
      },
      {
        type: "bookmark",
        name: "Bookmark",
        post: {
          path: "content/bookmarks/{slug}.md",
          url: "bookmarks/{slug}",
        },
      },
      {
        type: "checkin",
        name: "Checkin",
        post: {
          path: "content/checkins/{slug}.md",
          url: "checkins/{slug}",
        },
      },
      {
        type: "event",
        name: "Event",
        post: {
          path: "content/events/{slug}.md",
          url: "events/{slug}",
        },
      },
      {
        type: "rsvp",
        name: "RSVP",
        post: {
          path: "content/replies/{slug}.md",
          url: "replies/{slug}",
        },
      },
      {
        type: "reply",
        name: "Reply",
        post: {
          path: "content/replies/{slug}.md",
          url: "replies/{slug}",
        },
      },
      {
        type: "repost",
        name: "Repost",
        post: {
          path: "content/reposts/{slug}.md",
          url: "reposts/{slug}",
        },
      },
      {
        type: "like",
        name: "Like",
        post: {
          path: "content/likes/{slug}.md",
          url: "likes/{slug}",
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
