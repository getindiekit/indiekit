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
          path: '_posts/{{ published | date(\'yyyy-MM-dd\') }}-{{ slug }}.md',
          url: '{{ published | date(\'yyyy/MM/dd\') }}/{{ slug }}'
        },
        media: {
          path: 'media/{{ uploaded | date(\'yyyy/MM/dd\') }}/{{ filename }}'
        }
      }, {
        type: 'note',
        name: 'Note',
        icon: ':notebook_with_decorative_cover:',
        template: `${templatesPath}/note.njk`,
        post: {
          path: '_notes/{{ published | date(\'yyyy-MM-dd\') }}-{{ slug }}.md',
          url: 'notes/{{ published | date(\'yyyy/MM/dd\') }}/{{ slug }}'
        }
      }, {
        type: 'photo',
        name: 'Photo',
        icon: ':camera:',
        template: `${templatesPath}/photo.njk`,
        post: {
          path: '_photos/{{ published | date(\'yyyy-MM-dd\') }}-{{ slug }}.md',
          url: 'photos/{{ published | date(\'yyyy/MM/dd\') }}/{{ slug }}'
        },
        media: {
          path: 'media/photos/{{ uploaded | date(\'yyyy/MM/dd\') }}/{{ filename }}'
        }
      }, {
        type: 'video',
        name: 'Video',
        icon: ':video_camera:',
        template: `${templatesPath}/video.njk`,
        post: {
          path: '_videos/{{ published | date(\'yyyy-MM-dd\') }}-{{ slug }}.md',
          url: 'videos/{{ published | date(\'yyyy/MM/dd\') }}/{{ slug }}'
        },
        media: {
          path: 'media/videos/{{ uploaded | date(\'yyyy/MM/dd\') }}/{{ filename }}'
        }
      }, {
        type: 'audio',
        name: 'Audio',
        icon: ':microphone:',
        template: `${templatesPath}/audio.njk`,
        post: {
          path: '_audio/{{ published | date(\'yyyy-MM-dd\') }}-{{ slug }}.md',
          url: 'audio/{{ published | date(\'yyyy/MM/dd\') }}/{{ slug }}'
        },
        media: {
          path: 'media/audio/{{ uploaded | date(\'yyyy/MM/dd\') }}/{{ filename }}'
        }
      }, {
        type: 'bookmark',
        name: 'Bookmark',
        icon: ':bookmark:',
        template: `${templatesPath}/bookmark.njk`,
        post: {
          path: '_bookmarks/{{ published | date(\'yyyy-MM-dd\') }}-{{ slug }}.md',
          url: 'bookmarks/{{ published | date(\'yyyy/MM/dd\') }}/{{ slug }}'
        }
      }, {
        type: 'checkin',
        name: 'Checkin',
        icon: ':triangular_flag_on_post:',
        template: `${templatesPath}/checkin.njk`,
        post: {
          path: '_checkins/{{ published | date(\'yyyy-MM-dd\') }}-{{ slug }}.md',
          url: 'checkins/{{ published | date(\'yyyy/MM/dd\') }}/{{ slug }}'
        }
      }, {
        type: 'event',
        name: 'Event',
        icon: ':calendar:',
        template: `${templatesPath}/event.njk`,
        post: {
          path: '_events/{{ published | date(\'yyyy-MM-dd\') }}-{{ slug }}.md',
          url: 'events/{{ published | date(\'yyyy/MM/dd\') }}/{{ slug }}'
        }
      }, {
        type: 'rsvp',
        name: 'Reply with RSVP',
        icon: ':speech_balloon:',
        template: `${templatesPath}/reply.njk`,
        post: {
          path: '_replies/{{ published | date(\'yyyy-MM-dd\') }}-{{ slug }}.md',
          url: 'replies/{{ published | date(\'yyyy/MM/dd\') }}/{{ slug }}'
        }
      }, {
        type: 'reply',
        name: 'Reply',
        icon: ':speech_balloon:',
        template: `${templatesPath}/reply.njk`,
        post: {
          path: '_replies/{{ published | date(\'yyyy-MM-dd\') }}-{{ slug }}.md',
          url: 'replies/{{ published | date(\'yyyy/MM/dd\') }}/{{ slug }}'
        }
      }, {
        type: 'repost',
        name: 'Repost',
        icon: ':recycle:',
        template: `${templatesPath}/repost.njk`,
        post: {
          path: '_reposts/{{ published | date(\'yyyy-MM-dd\') }}-{{ slug }}.md',
          url: 'reposts/{{ published | date(\'yyyy/MM/dd\') }}/{{ slug }}'
        }
      }, {
        type: 'like',
        name: 'Like',
        icon: ':thumbsup:',
        template: `${templatesPath}/like.njk`,
        post: {
          path: '_likes/{{ published | date(\'yyyy-MM-dd\') }}-{{ slug }}.md',
          url: 'likes/{{ published | date(\'yyyy/MM/dd\') }}/{{ slug }}'
        }
      }],
      'slug-separator': '-',
      'syndicate-to': []
    };
  }
};
