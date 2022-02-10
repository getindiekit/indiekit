import camelcaseKeys from "camelcase-keys";
import TOML from "@iarna/toml";
import YAML from "yaml";

// YAML options
YAML.scalarOptions.str.fold.lineWidth = 0;

const defaults = {
  frontMatterFormat: "yaml",
};

export const HugoPreset = class {
  constructor(options = {}) {
    this.id = "hugo";
    this.name = "Hugo preset";
    this.options = { ...defaults, ...options };
  }

  get info() {
    return {
      name: "Hugo",
    };
  }

  /**
   * Get front matter
   *
   * @private
   * @param {object} properties Post data variables
   * @returns {string} Front matter in chosen format
   */
  _getFrontMatter(properties) {
    let delimiters;
    let frontmatter;

    switch (this.options.frontMatterFormat) {
      case "json":
        delimiters = ["", "\n"];
        frontmatter = JSON.stringify(properties, null, 2);
        break;
      case "toml":
        delimiters = ["+++\n", "+++\n"];
        frontmatter = TOML.stringify(properties);
        break;
      case "yaml":
      default:
        delimiters = ["---\n", "---\n"];
        frontmatter = YAML.stringify(properties);
        break;
    }

    return `${delimiters[0]}${frontmatter}${delimiters[1]}`;
  }

  /**
   * Post types
   *
   * @returns {object} Post types config
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
        name: "Reply with RSVP",
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
   *
   * @param {object} properties Post data variables
   * @returns {string} Rendered template
   */
  postTemplate(properties) {
    /*
     * Go templates don’t accept hyphens in property names
     * and Hugo camelCases its predefined front matter keys
     * https://gohugo.io/content-management/front-matter/
     */
    properties = camelcaseKeys(properties, { deep: true });

    let content;
    if (properties.content) {
      content =
        properties.content.text ||
        properties.content.html ||
        properties.content;
      content = `${content}\n`;
    } else {
      content = "";
    }

    properties = {
      date: properties.published,
      ...(properties.name && { title: properties.name }),
      ...(properties.summary && { summary: properties.summary }),
      ...(properties.category && { category: properties.category }),
      ...(properties.start && { start: properties.start }),
      ...(properties.end && { end: properties.end }),
      ...(properties.rsvp && { rsvp: properties.rsvp }),
      ...(properties.location && { location: properties.location }),
      ...(properties.checkin && { checkin: properties.checkin }),
      ...(properties.audio && { audio: properties.audio }),
      ...(properties.photo && { images: properties.photo }),
      ...(properties.video && { videos: properties.video }),
      ...(properties.bookmarkOf && { bookmarkOf: properties.bookmarkOf }),
      ...(properties.likeOf && { likeOf: properties.likeOf }),
      ...(properties.repostOf && { repostOf: properties.repostOf }),
      ...(properties.inReplyTo && { inReplyTo: properties.inReplyTo }),
      ...(properties.postStatus === "draft" && { draft: true }),
      ...(properties.visibility && { visibility: properties.visibility }),
      ...(properties.syndication && { syndication: properties.syndication }),
      ...(properties.mpSyndicateTo && {
        mpSyndicateTo: properties.mpSyndicateTo,
      }),
    };

    const frontMatter = this._getFrontMatter(properties);

    return frontMatter + content;
  }

  init(Indiekit) {
    Indiekit.addPreset(this);
  }
};

export default HugoPreset;
