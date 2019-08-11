const templateDir = process.env.PWD + '/test/lib/post/fixtures';

module.exports = {
  'post-types': {
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
