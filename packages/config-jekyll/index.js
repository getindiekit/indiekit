import YAML from 'yaml';

export const JekyllConfig = class {
  constructor() {
    this.id = 'jekyll';
    this.name = 'Jekyll';
  }

  get config() {
    return {
      categories: [],
      'post-types': [{
        type: 'article',
        name: 'Article',
        post: {
          path: '_posts/{yyyy}-{MM}-{dd}-{slug}.md',
          url: '{yyyy}/{MM}/{dd}/{slug}'
        },
        media: {
          path: 'media/{yyyy}/{MM}/{dd}/{filename}'
        }
      }, {
        type: 'note',
        name: 'Note',
        post: {
          path: '_notes/{yyyy}-{MM}-{dd}-{slug}.md',
          url: 'notes/{yyyy}/{MM}/{dd}/{slug}'
        }
      }, {
        type: 'photo',
        name: 'Photo',
        post: {
          path: '_photos/{yyyy}-{MM}-{dd}-{slug}.md',
          url: 'photos/{yyyy}/{MM}/{dd}/{slug}'
        },
        media: {
          path: 'media/photos/{yyyy}/{MM}/{dd}/{filename}'
        }
      }, {
        type: 'video',
        name: 'Video',
        post: {
          path: '_videos/{yyyy}-{MM}-{dd}-{slug}.md',
          url: 'videos/{yyyy}/{MM}/{dd}/{slug}'
        },
        media: {
          path: 'media/videos/{yyyy}/{MM}/{dd}/{filename}'
        }
      }, {
        type: 'audio',
        name: 'Audio',
        post: {
          path: '_audio/{yyyy}-{MM}-{dd}-{slug}.md',
          url: 'audio/{yyyy}/{MM}/{dd}/{slug}'
        },
        media: {
          path: 'media/audio/{yyyy}/{MM}/{dd}/{filename}'
        }
      }, {
        type: 'bookmark',
        name: 'Bookmark',
        post: {
          path: '_bookmarks/{yyyy}-{MM}-{dd}-{slug}.md',
          url: 'bookmarks/{yyyy}/{MM}/{dd}/{slug}'
        }
      }, {
        type: 'checkin',
        name: 'Checkin',
        post: {
          path: '_checkins/{yyyy}-{MM}-{dd}-{slug}.md',
          url: 'checkins/{yyyy}/{MM}/{dd}/{slug}'
        }
      }, {
        type: 'event',
        name: 'Event',
        post: {
          path: '_events/{yyyy}-{MM}-{dd}-{slug}.md',
          url: 'events/{yyyy}/{MM}/{dd}/{slug}'
        }
      }, {
        type: 'rsvp',
        name: 'Reply with RSVP',
        post: {
          path: '_replies/{yyyy}-{MM}-{dd}-{slug}.md',
          url: 'replies/{yyyy}/{MM}/{dd}/{slug}'
        }
      }, {
        type: 'reply',
        name: 'Reply',
        post: {
          path: '_replies/{yyyy}-{MM}-{dd}-{slug}.md',
          url: 'replies/{yyyy}/{MM}/{dd}/{slug}'
        }
      }, {
        type: 'repost',
        name: 'Repost',
        post: {
          path: '_reposts/{yyyy}-{MM}-{dd}-{slug}.md',
          url: 'reposts/{yyyy}/{MM}/{dd}/{slug}'
        }
      }, {
        type: 'like',
        name: 'Like',
        post: {
          path: '_likes/{yyyy}-{MM}-{dd}-{slug}.md',
          url: 'likes/{yyyy}/{MM}/{dd}/{slug}'
        }
      }],
      'slug-separator': '-',
      'syndicate-to': []
    };
  }

  postTemplate(properties) {
    const {content} = properties;
    properties = {
      date: properties.published[0],
      ...(properties.name && {title: properties.name[0]}),
      ...(properties.summary && {excerpt: properties.summary[0]}),
      ...(properties.category && {category: properties.category}),
      ...(properties.start && {start: properties.start[0]}),
      ...(properties.end && {end: properties.end[0]}),
      ...(properties.rsvp && {rsvp: properties.rsvp[0]}),
      ...(properties.location && {location: properties.location[0]}),
      ...(properties.checkin && {checkin: properties.checkin}),
      ...(properties.audio && {audio: properties.audio}),
      ...(properties.photo && {photo: properties.photo}),
      ...(properties.video && {video: properties.video}),
      ...(properties['bookmark-of'] && {'bookmark-of': properties['bookmark-of'][0]}),
      ...(properties['like-of'] && {'bookmark-of': properties['like-of'][0]}),
      ...(properties['repost-of'] && {'repost-of': properties['repost-of'][0]}),
      ...(properties['in-reply-to'] && {'in-reply-to': properties['in-reply-to'][0]}),
      ...(properties['syndicate-to'] && {'syndicate-to': properties['syndicate-to']})
    };
    const frontmatter = YAML.stringify(properties);

    return `${frontmatter}---\n${content}`;
  }
};
