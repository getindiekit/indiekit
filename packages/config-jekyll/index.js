import {templatesPath} from '@indiekit/templates-yaml';

export const JekyllConfig = class {
  constructor(options = {}) {
    this.id = 'jekyll';
    this.name = 'Jekyll';
    this.templatesPath = options.templatesPath || templatesPath;
  }

  get config() {
    return {
      categories: [],
      'post-types': [{
        type: 'article',
        name: 'Article',
        icon: ':page_facing_up:',
        template: `${templatesPath}/article.njk`,
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
        icon: ':notebook_with_decorative_cover:',
        template: `${templatesPath}/note.njk`,
        post: {
          path: '_notes/{yyyy}-{MM}-{dd}-{slug}.md',
          url: 'notes/{yyyy}/{MM}/{dd}/{slug}'
        }
      }, {
        type: 'photo',
        name: 'Photo',
        icon: ':camera:',
        template: `${templatesPath}/photo.njk`,
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
        icon: ':video_camera:',
        template: `${templatesPath}/video.njk`,
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
        icon: ':microphone:',
        template: `${templatesPath}/audio.njk`,
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
        icon: ':bookmark:',
        template: `${templatesPath}/bookmark.njk`,
        post: {
          path: '_bookmarks/{yyyy}-{MM}-{dd}-{slug}.md',
          url: 'bookmarks/{yyyy}/{MM}/{dd}/{slug}'
        }
      }, {
        type: 'checkin',
        name: 'Checkin',
        icon: ':triangular_flag_on_post:',
        template: `${templatesPath}/checkin.njk`,
        post: {
          path: '_checkins/{yyyy}-{MM}-{dd}-{slug}.md',
          url: 'checkins/{yyyy}/{MM}/{dd}/{slug}'
        }
      }, {
        type: 'event',
        name: 'Event',
        icon: ':calendar:',
        template: `${templatesPath}/event.njk`,
        post: {
          path: '_events/{yyyy}-{MM}-{dd}-{slug}.md',
          url: 'events/{yyyy}/{MM}/{dd}/{slug}'
        }
      }, {
        type: 'rsvp',
        name: 'Reply with RSVP',
        icon: ':speech_balloon:',
        template: `${templatesPath}/reply.njk`,
        post: {
          path: '_replies/{yyyy}-{MM}-{dd}-{slug}.md',
          url: 'replies/{yyyy}/{MM}/{dd}/{slug}'
        }
      }, {
        type: 'reply',
        name: 'Reply',
        icon: ':speech_balloon:',
        template: `${templatesPath}/reply.njk`,
        post: {
          path: '_replies/{yyyy}-{MM}-{dd}-{slug}.md',
          url: 'replies/{yyyy}/{MM}/{dd}/{slug}'
        }
      }, {
        type: 'repost',
        name: 'Repost',
        icon: ':recycle:',
        template: `${templatesPath}/repost.njk`,
        post: {
          path: '_reposts/{yyyy}-{MM}-{dd}-{slug}.md',
          url: 'reposts/{yyyy}/{MM}/{dd}/{slug}'
        }
      }, {
        type: 'like',
        name: 'Like',
        icon: ':thumbsup:',
        template: `${templatesPath}/like.njk`,
        post: {
          path: '_likes/{yyyy}-{MM}-{dd}-{slug}.md',
          url: 'likes/{yyyy}/{MM}/{dd}/{slug}'
        }
      }],
      'slug-separator': '-',
      'syndicate-to': []
    };
  }
};
