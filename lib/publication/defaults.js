const templateDir = process.env.PWD + '/lib/templates';

/**
 * Default publication configuration
 *
 * @memberof publication
 * @module default
 *
 * Note: Values for all configuration properties – empty or not – are
 * required to ensure user configured values overwrite these defaults.
 */
module.exports = {
  categories: [],
  'post-types': {
    article: {
      name: 'Article',
      icon: ':page_facing_up:',
      template: `${templateDir}/article.njk`,
      post: {
        path: '_posts/{{ published | date(\'yyyy-MM-dd\') }}-{{ slug }}.md',
        url: '{{ published | date(\'yyyy/MM/dd\') }}/{{ slug }}'
      },
      media: {
        path: 'media/{{ filedate | date(\'yyyy/MM/dd\') }}/{{ filename }}'
      }
    },
    note: {
      type: 'note',
      name: 'Note',
      icon: ':notebook_with_decorative_cover:',
      template: `${templateDir}/note.njk`,
      post: {
        path: '_notes/{{ published | date(\'yyyy-MM-dd\') }}-{{ slug }}.md',
        url: 'notes/{{ published | date(\'yyyy/MM/dd\') }}/{{ slug }}'
      }
    },
    photo: {
      name: 'Photo',
      icon: ':camera:',
      template: `${templateDir}/photo.njk`,
      post: {
        path: '_photos/{{ published | date(\'yyyy-MM-dd\') }}-{{ slug }}.md',
        url: 'photos/{{ published | date(\'yyyy/MM/dd\') }}/{{ slug }}'
      },
      media: {
        path: 'media/photos/{{ filedate | date(\'yyyy/MM/dd\') }}/{{ filename }}'
      }
    },
    video: {
      name: 'Video',
      icon: ':video_camera:',
      template: `${templateDir}/video.njk`,
      post: {
        path: '_videos/{{ published | date(\'yyyy-MM-dd\') }}-{{ slug }}.md',
        url: 'videos/{{ published | date(\'yyyy/MM/dd\') }}/{{ slug }}'
      },
      media: {
        path: 'media/videos/{{ filedate | date(\'yyyy/MM/dd\') }}/{{ filename }}'
      }
    },
    audio: {
      name: 'Audio',
      icon: ':microphone:',
      template: `${templateDir}/audio.njk`,
      post: {
        path: '_audio/{{ published | date(\'yyyy-MM-dd\') }}-{{ slug }}.md',
        url: 'audio/{{ published | date(\'yyyy/MM/dd\') }}/{{ slug }}'
      },
      media: {
        path: 'media/audio/{{ filedate | date(\'yyyy/MM/dd\') }}/{{ filename }}'
      }
    },
    reply: {
      name: 'Reply',
      icon: ':speech_balloon:',
      template: `${templateDir}/reply.njk`,
      post: {
        path: '_replies/{{ published | date(\'yyyy-MM-dd\') }}-{{ slug }}.md',
        url: 'replies/{{ published | date(\'yyyy/MM/dd\') }}/{{ slug }}'
      }
    },
    rsvp: {
      name: 'Reply with RSVP',
      icon: ':speech_balloon:',
      template: `${templateDir}/reply.njk`,
      post: {
        path: '_replies/{{ published | date(\'yyyy-MM-dd\') }}-{{ slug }}.md',
        url: 'replies/{{ published | date(\'yyyy/MM/dd\') }}/{{ slug }}'
      }
    },
    like: {
      name: 'Like',
      icon: ':thumbsup:',
      template: `${templateDir}/like.njk`,
      post: {
        path: '_likes/{{ published | date(\'yyyy-MM-dd\') }}-{{ slug }}.md',
        url: 'likes/{{ published | date(\'yyyy/MM/dd\') }}/{{ slug }}'
      }
    },
    repost: {
      name: 'Repost',
      icon: ':recycle:',
      template: `${templateDir}/repost.njk`,
      post: {
        path: '_reposts/{{ published | date(\'yyyy-MM-dd\') }}-{{ slug }}.md',
        url: 'reposts/{{ published | date(\'yyyy/MM/dd\') }}/{{ slug }}'
      }
    },
    bookmark: {
      name: 'Bookmark',
      icon: ':bookmark:',
      template: `${templateDir}/bookmark.njk`,
      post: {
        path: '_bookmarks/{{ published | date(\'yyyy-MM-dd\') }}-{{ slug }}.md',
        url: 'bookmarks/{{ published | date(\'yyyy/MM/dd\') }}/{{ slug }}'
      }
    },
    checkin: {
      name: 'Checkin',
      icon: ':triangular_flag_on_post:',
      template: `${templateDir}/checkin.njk`,
      post: {
        path: '_checkins/{{ published | date(\'yyyy-MM-dd\') }}-{{ slug }}.md',
        url: 'checkins/{{ published | date(\'yyyy/MM/dd\') }}/{{ slug }}'
      }
    },
    event: {
      name: 'Event',
      icon: ':calendar:',
      template: `${templateDir}/event.njk`,
      post: {
        path: '_events/{{ published | date(\'yyyy-MM-dd\') }}-{{ slug }}.md',
        url: 'events/{{ published | date(\'yyyy/MM/dd\') }}/{{ slug }}'
      }
    }
  },
  'slug-separator': '-',
  'syndicate-to': []
};
