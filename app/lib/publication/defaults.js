const templateDir = process.env.PWD + '/app/templates';

module.exports = {
  'post-types': [{
    type: 'article',
    name: 'Article',
    icon: ':page_facing_up:',
    path: {
      template: `${templateDir}/article.njk`,
      post: '_posts/{{ published | date(\'yyyy-MM-dd\') }}-{{ slug }}.md',
      file: 'images/{{ filedate | date(\'yyyy/MM/dd\') }}/{{ filename }}',
      url: '{{ published | date(\'yyyy/MM/dd\') }}/{{ slug }}'
    }
  }, {
    type: 'note',
    name: 'Note',
    icon: ':notebook_with_decorative_cover:',
    path: {
      template: `${templateDir}/note.njk`,
      post: '_notes/{{ published | date(\'yyyy-MM-dd\') }}-{{ slug }}.md',
      file: 'images/notes/{{ filedate | date(\'yyyy/MM/dd\') }}/{{ filename }}',
      url: 'notes/{{ published | date(\'yyyy/MM/dd\') }}/{{ slug }}'
    }
  }, {
    type: 'photo',
    name: 'Photo',
    icon: ':camera:',
    path: {
      template: `${templateDir}/photo.njk`,
      post: '_photos/{{ published | date(\'yyyy-MM-dd\') }}-{{ slug }}.md',
      file: 'images/photos/{{ filedate | date(\'yyyy/MM/dd\') }}/{{ filename }}',
      url: 'photos/{{ published | date(\'yyyy/MM/dd\') }}/{{ slug }}'
    }
  }],
  'slug-separator': '-',
  'syndicate-to': []
};
