declare module "@accessible-components/tag-input" {
  export interface TagInputOptions {
    ariaTag?: string | null;
    ariaEditTag?: string | null;
    ariaDeleteTag?: string | null;
    ariaTagAdded?: string | null;
    ariaTagDeleted?: string | null;
    ariaTagUpdated?: string | null;
    ariaTagSelected?: string | null;
    ariaNoTagsSelected?: string | null;
    ariaInputLabel?: string | null;
    disabled?: boolean;
    label?: string;
    name?: string | null;
    placeholder?: string | null;
    tags?: string[];
  }

  export default class TagInput {
    constructor(element: HTMLElement, options?: TagInputOptions);
    addTag(value: string, flag?: boolean): void;
  }
}
