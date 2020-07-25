import TOML from '@iarna/toml';
import YAML from 'yaml';

const defaults = {
  frontmatterFormat: 'json'
};

export const HugoConfig = class {
  constructor(options = {}) {
    this.id = 'hugo';
    this.name = 'Hugo';
    this.frontmatterFormat = options.frontmatterFormat
  }

  /**
   * Publication config
   *
   * @returns {object} Publication config
   */
  get config() {
    return {
      categories: [],
      'post-types': [{
        type: 'article',
        name: 'Article',
        post: {
          path: 'content/articles/{slug}.md',
          url: 'articles/{slug}'
        },
        media: {
          path: 'static/articles/{filename}',
          url: 'articles/{filename}'
        }
      }, {
        type: 'note',
        name: 'Note',
        post: {
          path: 'content/notes/{slug}.md',
          url: 'notes/{slug}'
        }
      }, {
        type: 'photo',
        name: 'Photo',
        post: {
          path: 'content/photos/{slug}.md',
          url: 'photos/{slug}'
        },
        media: {
          path: 'static/photos/{filename}',
          url: 'photos/{filename}',
        }
      }, {
        type: 'video',
        name: 'Video',
        post: {
          path: 'content/videos/{slug}.md',
          url: 'videos/{slug}'
        },
        media: {
          path: 'static/videos/{filename}',
          url: 'videos/{filename}'
        }
      }, {
        type: 'audio',
        name: 'Audio',
        post: {
          path: 'content/audio/{slug}.md',
          url: 'audio/{slug}'
        },
        media: {
          path: 'static/audio/{filename}',
          url: 'audio/{filename}'
        }
      }, {
        type: 'bookmark',
        name: 'Bookmark',
        post: {
          path: 'content/bookmarks/{slug}.md',
          url: 'bookmarks/{slug}'
        }
      }, {
        type: 'checkin',
        name: 'Checkin',
        post: {
          path: 'content/checkins/{slug}.md',
          url: 'checkins/{slug}'
        }
      }, {
        type: 'event',
        name: 'Event',
        post: {
          path: 'content/events/{slug}.md',
          url: 'events/{slug}'
        }
      }, {
        type: 'rsvp',
        name: 'Reply with RSVP',
        post: {
          path: 'content/replies/{slug}.md',
          url: 'replies/{slug}'
        }
      }, {
        type: 'reply',
        name: 'Reply',
        post: {
          path: 'content/replies/{slug}.md',
          url: 'replies/{slug}'
        }
      }, {
        type: 'repost',
        name: 'Repost',
        post: {
          path: 'content/reposts/{slug}.md',
          url: 'reposts/{slug}'
        }
      }, {
        type: 'like',
        name: 'Like',
        post: {
          path: 'content/likes/{slug}.md',
          url: 'likes/{slug}'
        }
      }],
      'slug-separator': '-',
      'syndicate-to': []
    };
  }

  /**
   * Render post template
   *
   * @param {object} properties Post properties
   * @returns {string} Rendered template
   */
  postTemplate(properties) {
    const content = properties.content ? `${properties.content}\n` : '';
    properties = {
      date: properties.published[0],
      ...(properties.name && {title: properties.name[0]}),
      ...(properties.summary && {summary: properties.summary[0]}),
      ...(properties.category && {category: properties.category}),
      ...(properties.start && {start: properties.start[0]}),
      ...(properties.end && {end: properties.end[0]}),
      ...(properties.rsvp && {rsvp: properties.rsvp[0]}),
      ...(properties.location && {location: properties.location.properties}),
      ...(properties.checkin && {checkin: properties.checkin.properties}),
      ...(properties.audio && {audio: properties.audio}),
      ...(properties.photo && {images: properties.photo}),
      ...(properties.video && {videos: properties.video}),
      ...(properties['bookmark-of'] && {'bookmark-of': properties['bookmark-of'][0]}),
      ...(properties['like-of'] && {'bookmark-of': properties['like-of'][0]}),
      ...(properties['repost-of'] && {'repost-of': properties['repost-of'][0]}),
      ...(properties['in-reply-to'] && {'in-reply-to': properties['in-reply-to'][0]}),
      ...(properties['syndicate-to'] && {'syndicate-to': properties['syndicate-to']})
    };

    let delimiters;
    let frontmatter;
    switch (this.frontmatterFormat) {
      case 'json':
        delimiters = ['', '\n'];
        frontmatter = JSON.stringify(properties, null, 2);
        break;
      case 'toml':
        delimiters = ['+++\n', '+++\n'];
        frontmatter = TOML.stringify(properties);
        break;
      case 'yaml':
      default:
        delimiters = ['---\n', '---\n'];
        frontmatter = YAML.stringify(properties);
        break;
    };

    return `${delimiters[0]}${frontmatter}${delimiters[1]}${content}`;
  }
};
