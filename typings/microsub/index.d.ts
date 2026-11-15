/**
 * Microsub channel
 * @see {@link https://indieweb.org/Microsub-spec#Channels}
 */
interface MicrosubChannel {
  /** User-specific unique ID for the channel */
  uid: string;
  /** Display name for the channel */
  name: string;
  /**
   * Number of unread items, or whether there are any. Must not be returned
   * by servers that don’t track read state
   */
  unread?: number | boolean;
}

/**
 * Paging cursors for a list of results, such as a timeline
 * @see {@link https://indieweb.org/Microsub-spec#Paging}
 */
interface MicrosubPaging {
  /** Cursor to retrieve items before (newer than) those returned */
  before?: string;
  /** Cursor to retrieve items after (older than) those returned */
  after?: string;
}

/**
 * Feed a post came from (proposed)
 * @see {@link https://indieweb.org/Microsub-spec#Indicating_Item_Source_Proposal}
 */
interface MicrosubSource {
  /** Internal ID for the reason this post is in this channel */
  _id?: string;
  /** URL of the feed */
  url?: string;
  /** Display name of the feed */
  name?: string;
  /** Photo or icon representing the feed */
  photo?: string;
}

/**
 * Microsub post, a jf2 post with properties set by the Microsub server
 * @see {@link https://indieweb.org/Microsub-spec#Posts}
 */
type MicrosubPost = Jf2Properties & {
  /** Unique internal ID for this post in the given channel */
  _id: string;
  /** Whether this post has been read */
  _is_read?: boolean;
  /** Feed this post came from */
  _source?: MicrosubSource;
};

/**
 * Response to `GET ?action=channels`
 * @see {@link https://indieweb.org/Microsub-spec#Channels_2}
 */
interface MicrosubChannelsResponse {
  /** Channels, with `notifications` first */
  channels: MicrosubChannel[];
}

/**
 * Response to `GET ?action=timeline`
 * @see {@link https://indieweb.org/Microsub-spec#Retrieve_Entries_in_a_Channel}
 */
interface MicrosubTimelineResponse {
  /** Posts in the channel */
  items: MicrosubPost[];
  /** Paging cursors */
  paging: MicrosubPaging;
}
