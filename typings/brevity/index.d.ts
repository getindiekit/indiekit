declare module "brevity" {
  /** Plain text, or a link found in text */
  interface Token {
    tag: "text" | "link";
    content: string;
    required: boolean;
  }

  type Format = "note" | "article" | "note+media";

  const brevity: {
    FORMAT_NOTE: "note";
    FORMAT_ARTICLE: "article";
    FORMAT_NOTE_WITH_MEDIA: "note+media";

    /** Split text into plain text and links */
    tokenize(text: string, skipBareCcTlds?: boolean): Token[];

    /** Length of text, counting each link as a shortened link */
    tweetLength(text: string): number;

    /** Wrap links found in text with `<a>` elements */
    autolink(text: string): string;

    /**
     * Shorten text to a target length, adding a permalink if it was shortened
     * @param text - Text to shorten
     * @param permalink - URL of the full text
     * @param permashortlink - Short URL of the full text
     * @param permashortcitation - Short citation for the full text
     * @param targetLength - Maximum length, defaults to 140
     * @param linkLength - Length to count each link as, defaults to 23
     * @param format - Format of the text, defaults to `note`
     * @returns Shortened text
     */
    shorten(
      text: string,
      permalink?: string | false,
      permashortlink?: string | false,
      permashortcitation?: string | false,
      targetLength?: number,
      linkLength?: number,
      format?: Format,
    ): string;
  };

  export default brevity;
}
