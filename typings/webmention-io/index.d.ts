/**
 * Webmention.io mention, from its JF2 API
 * @see {@link https://github.com/aaronpk/webmention.io#api}
 */
interface WebmentionIoEntry {
  type: "entry";
  /** Webmention.io ID */
  "wm-id": number;
  /** Property linking source to target, for example `in-reply-to` */
  "wm-property": string;
  /** Date received by Webmention.io */
  "wm-received": string;
  /** Source URL */
  "wm-source": string;
  /** Target URL */
  "wm-target": string;
  /** Private mention */
  "wm-private"?: boolean;
  url?: string;
  name?: string;
  published?: string;
  content?: { html?: string; text?: string };
  author?: { name?: string; photo?: string; url?: string };
}

/** Webmention.io feed of mentions, from its JF2 API */
interface WebmentionIoFeed {
  type: "feed";
  name?: string;
  children?: WebmentionIoEntry[];
}
