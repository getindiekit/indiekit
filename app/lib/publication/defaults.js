const templateDir = process.env.PWD + '/app/templates';

module.exports = {
  'post-types': [{
    type: 'article',
    name: 'Article',
    icon: ':page_facing_up:',
    path: {
      template: `${templateDir}/article.njk`,
      post: '_posts/{{ published | date(\'yyyy-MM-dd\') }}-{{ slug }}.md',
      file: 'media/{{ filedate | date(\'yyyy/MM/dd\') }}/{{ filename }}',
      url: '{{ published | date(\'yyyy/MM/dd\') }}/{{ slug }}'
    }
  }, {
    type: 'note',
    name: 'Note',
    icon: ':notebook_with_decorative_cover:',
    path: {
      template: `${templateDir}/note.njk`,
      post: '_notes/{{ published | date(\'yyyy-MM-dd\') }}-{{ slug }}.md',
      file: 'media/notes/{{ filedate | date(\'yyyy/MM/dd\') }}/{{ filename }}',
      url: 'notes/{{ published | date(\'yyyy/MM/dd\') }}/{{ slug }}'
    }
  }, {
    type: 'photo',
    name: 'Photo',
    icon: ':camera:',
    path: {
      template: `${templateDir}/photo.njk`,
      post: '_photos/{{ published | date(\'yyyy-MM-dd\') }}-{{ slug }}.md',
      file: 'media/photos/{{ filedate | date(\'yyyy/MM/dd\') }}/{{ filename }}',
      url: 'photos/{{ published | date(\'yyyy/MM/dd\') }}/{{ slug }}'
    }
  }, {
    type: 'video',
    name: 'Video',
    icon: ':video_camera:',
    path: {
      template: `${templateDir}/video.njk`,
      post: '_videos/{{ published | date(\'yyyy-MM-dd\') }}-{{ slug }}.md',
      file: 'media/videos/{{ filedate | date(\'yyyy/MM/dd\') }}/{{ filename }}',
      url: 'videos/{{ published | date(\'yyyy/MM/dd\') }}/{{ slug }}'
    }
  }, {
    type: 'audio',
    name: 'Audio',
    icon: ':microphone:',
    path: {
      template: `${templateDir}/audio.njk`,
      post: '_audio/{{ published | date(\'yyyy-MM-dd\') }}-{{ slug }}.md',
      file: 'media/audio/{{ filedate | date(\'yyyy/MM/dd\') }}/{{ filename }}',
      url: 'audio/{{ published | date(\'yyyy/MM/dd\') }}/{{ slug }}'
    }
  }, {
    type: 'bookmark',
    name: 'Bookmark',
    icon: ':bookmark:',
    path: {
      template: `${templateDir}/bookmark.njk`,
      post: '_bookmarks/{{ published | date(\'yyyy-MM-dd\') }}-{{ slug }}.md',
      file: 'media/bookmarks/{{ filedate | date(\'yyyy/MM/dd\') }}/{{ filename }}',
      url: 'bookmarks/{{ published | date(\'yyyy/MM/dd\') }}/{{ slug }}'
    }
  }],
  'slug-separator': '-',
  'syndicate-to': []
};
