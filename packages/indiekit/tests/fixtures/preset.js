export const Preset = class {
  constructor() {
    this.id = 'foo';
    this.name = 'Foo';
  }

  get postTypes() {
    return [{
      type: 'note',
      name: 'Foo note',
      post: {
        path: '_notes/{{ published | date(\'yyyy-MM-dd\') }}-{{ slug }}.md',
        url: 'notes/{{ published | date(\'yyyy/MM/dd\') }}/{{ slug }}'
      }
    }];
  }
};
