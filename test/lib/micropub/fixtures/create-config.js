const templateDir = process.env.PWD + '/test/lib/micropub/fixtures';

module.exports = {
  'post-types': [{
    type: 'article',
    name: 'Article',
    path: {
      template: `${templateDir}/template-article.njk`,
      post: '_posts/{{ published | date(\'yyyy-MM-dd\') }}-{{ slug }}.md',
      url: '{{ published | date(\'yyyy/MM/dd\') }}/{{ slug }}'
    }
  }, {
    type: 'note',
    name: 'Note',
    path: {
      template: `${templateDir}/template-note.njk`,
      post: '_notes/{{ published | date(\'yyyy-MM-dd\') }}-{{ slug }}.md',
      url: 'notes/{{ published | date(\'yyyy/MM/dd\') }}/{{ slug }}'
    }
  }, {
    type: 'photo',
    name: 'Photo',
    path: {
      template: `${templateDir}/template-photo.njk`,
      post: '_photos/{{ published | date(\'yyyy-MM-dd\') }}-{{ slug }}.md',
      file: 'images/photos/{{ published | date(\'yyyy/MM/dd\') }}/{{ slug }}/{{ filename }}',
      url: 'photos/{{ published | date(\'yyyy/MM/dd\') }}/{{ slug }}'
    }
  }],
  'slug-separator': '-',
  'syndicate-to': []
};
