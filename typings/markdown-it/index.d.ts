// Plug-ins without their own types, declared against markdown-it’s types

declare module "markdown-it-abbr" {
  import type { MarkdownIt } from "markdown-it";

  export default function abbr(md: MarkdownIt): void;
}

declare module "markdown-it-deflist" {
  import type { MarkdownIt } from "markdown-it";

  export default function deflist(md: MarkdownIt): void;
}

declare module "markdown-it-footnote" {
  import type { MarkdownIt } from "markdown-it";

  export default function footnote(md: MarkdownIt): void;
}

declare module "markdown-it-image-figures" {
  import type { MarkdownIt } from "markdown-it";

  export interface ImageFiguresOptions {
    /** Add `decoding="async"` to images */
    async?: boolean;
    /** Classes to add to images */
    classes?: string;
    /** Use `data-src` for the image source, for lazy loading scripts */
    dataType?: boolean;
    /** Add a caption, from the image’s alt text or title */
    figcaption?: boolean | "alt" | "title";
    /** Add `loading="lazy"` to images */
    lazy?: boolean;
    /** Wrap images in a link to the image */
    link?: boolean;
    /** Remove the `src` attribute when `dataType` is set */
    removeSrc?: boolean;
    /** Add `tabindex="0"` to figures */
    tabindex?: boolean;
  }

  export default function imageFigures(
    md: MarkdownIt,
    options?: ImageFiguresOptions,
  ): void;
}
