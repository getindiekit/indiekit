export const Preset = class {
  constructor(options = {}) {
    this.id = 'foo';
    this.name = 'Foo';
    this.templatesPath = options.templatesPath;
  }

  get config() {
    return {
      categories: [],
      'post-types': [{
        type: 'note',
        name: 'Foo note',
        post: {
          path: '_notes/{{ published | date(\'yyyy-MM-dd\') }}-{{ slug }}.md',
          url: 'notes/{{ published | date(\'yyyy/MM/dd\') }}/{{ slug }}'
        }
      }],
      'syndicate-to': []
    };
  }
};
