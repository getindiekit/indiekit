const templateDir = process.env.PWD + '/app/templates';

module.exports = {
  'post-types': [{
    type: 'article',
    name: 'Article',
    path: {
      template: `${templateDir}/article.njk`,
      post: '_posts/{{ published | date(\'yyyy-MM-dd\') }}-{{ slug }}.md',
      file: 'images/{{ published | date(\'yyyy/MM/dd\') }}/{{ slug }}/{{ filename }}',
      url: '{{ published | date(\'yyyy/MM/dd\') }}/{{ slug }}'
    }
  }, {
    type: 'note',
    name: 'Note',
    path: {
      template: `${templateDir}/note.njk`,
      post: '_notes/{{ published | date(\'yyyy-MM-dd\') }}-{{ slug }}.md',
      file: 'images/notes/{{ published | date(\'yyyy/MM/dd\') }}/{{ slug }}/{{ filename }}',
      url: 'notes/{{ published | date(\'yyyy/MM/dd\') }}/{{ slug }}'
    }
  }, {
    type: 'photo',
    name: 'Photo',
    path: {
      template: `${templateDir}/photo.njk`,
      post: '_photos/{{ published | date(\'yyyy-MM-dd\') }}-{{ slug }}.md',
      file: 'images/photos/{{ published | date(\'yyyy/MM/dd\') }}/{{ slug }}/{{ filename }}',
      url: 'photos/{{ published | date(\'yyyy/MM/dd\') }}/{{ slug }}'
    }
  }],
  'slug-separator': '-',
  'syndicate-to': []
};
