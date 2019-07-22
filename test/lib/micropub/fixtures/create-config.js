const templateDir = process.env.PWD + '/test/lib/micropub/fixtures';

module.exports = {
  'post-types': {
    article: {
      name: 'Article',
      template: `${templateDir}/template-article.njk`,
      post: {
        path: '_posts/{{ published | date(\'yyyy-MM-dd\') }}-{{ slug }}.md',
        url: '{{ published | date(\'yyyy/MM/dd\') }}/{{ slug }}'
      }
    },
    note: {
      name: 'Note',
      template: `${templateDir}/template-note.njk`,
      post: {
        path: '_notes/{{ published | date(\'yyyy-MM-dd\') }}-{{ slug }}.md',
        url: 'notes/{{ published | date(\'yyyy/MM/dd\') }}/{{ slug }}'
      }
    },
    photo: {
      name: 'Photo',
      template: `${templateDir}/template-photo.njk`,
      post: {
        path: '_photos/{{ published | date(\'yyyy-MM-dd\') }}-{{ slug }}.md',
        url: 'photos/{{ published | date(\'yyyy/MM/dd\') }}/{{ slug }}'
      },
      media: {
        path: 'images/photos/{{ published | date(\'yyyy/MM/dd\') }}/{{ slug }}/{{ filename }}'
      }
    }
  },
  'slug-separator': '-',
  'syndicate-to': []
};
