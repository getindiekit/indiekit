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

/**
 * Item for the checkboxes component
 * @see {@link ../../packages/frontend/components/checkboxes/template.njk}
 */
interface CheckboxesItem {
  /** ID of the checkbox, else one derived from the component’s ID prefix */
  id?: string;
  /** Name of the checkbox, else the component’s `name` */
  name?: string;
  /** Text of the label */
  label?: string;
  /** Hint shown below the label */
  hint?: string;
  /** Value sent when the checkbox is checked */
  value?: string;
  /** Check the box, else check it if its value is in the component’s `values` */
  checked?: boolean;
  /** Disable the checkbox */
  disabled?: boolean;
  /** HTML shown when the checkbox is checked */
  conditional?: string;
  /** Behaviour to add to the checkbox, as a `data-behaviour` attribute */
  behaviour?: string;
  /** Text of a divider, shown instead of a checkbox */
  divider?: string;
}
