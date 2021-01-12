export const Preset = class {
  constructor() {
    this.id = 'test';
    this.name = 'Test preset';
  }

  get postTypes() {
    return [{
      type: 'note',
      name: 'Test note',
      post: {
        path: '_notes/{​yyyy}-{MM}-{dd}-{slug}.md',
        url: 'notes/{​yyyy}-{MM}-{dd}/{slug}'
      }
    }];
  }
};
