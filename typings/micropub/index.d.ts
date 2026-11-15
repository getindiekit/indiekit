/**
 * Micropub response body
 *
 * The Micropub specification only defines error responses; the success
 * properties follow the conventions used by Indiekit’s Micropub endpoint.
 * @see {@link https://micropub.spec.indieweb.org/#error-response}
 */
interface MicropubResponseBody {
  /** Action that succeeded, for example `create` or `update` */
  success?: string;
  /** Human-readable description of what succeeded */
  success_description?: string;
  /** Error code, for example `invalid_request` */
  error?: string;
  /** Human-readable description of the error */
  error_description?: string;
}

/**
 * Response to a Micropub configuration query (`q=config`)
 *
 * The Micropub specification defines `media-endpoint` and `syndicate-to`, and
 * says to return those that apply to the server. The other properties are
 * Micropub extensions.
 * @see {@link https://micropub.spec.indieweb.org/#configuration}
 * @see {@link https://indieweb.org/Micropub-extensions}
 */
interface MicropubConfigResponse {
  /** URL of the media endpoint, if the server has one */
  "media-endpoint"?: string;
  /** Syndication targets the server can syndicate posts to */
  "syndicate-to"?: IndiekitSyndicationTargetInfo[];
  /** Queries the server supports (extension) */
  q?: string[];
  /** Categories used by posts (extension) */
  categories?: string[];
  /** Channels posts can be published to (extension) */
  channels?: Array<{ uid: string; name: string }>;
  /** Post types the server supports (extension) */
  "post-types"?: Array<
    Pick<
      IndiekitPostType,
      "type" | "name" | "h" | "properties" | "required-properties"
    >
  >;
}

/**
 * Operations of a Micropub update request
 *
 * The values of each property are arrays, even if there is only one value.
 * @see {@link https://micropub.spec.indieweb.org/#update}
 */
interface MicropubUpdateOperation {
  /** Add values to properties, keeping any existing values */
  add?: Record<string, unknown[]>;
  /** Replace all values of properties, creating any that don’t exist */
  replace?: Record<string, unknown[]>;
  /** Remove whole properties, or just the given values of properties */
  delete?: string[] | Record<string, unknown[]>;
}

/**
 * Result of handling a Micropub or media endpoint action
 *
 * Controllers send this as the HTTP response. The specification requires a
 * `Location` header when a post or file is created, and when an update or
 * undelete changes the URL of a post.
 * @see {@link https://micropub.spec.indieweb.org/#response}
 * @see {@link https://micropub.spec.indieweb.org/#response-1}
 * @see {@link https://micropub.spec.indieweb.org/#response-3}
 */
interface MicropubActionResponse {
  /** URL of the post or file, sent in the `Location` header */
  location?: string;
  /** HTTP status code */
  status: number;
  /** Response body */
  json: MicropubResponseBody;
}

/**
 * Paging cursors for a list of results (extension)
 * @see {@link https://indieweb.org/Micropub-extensions}
 */
interface MicropubPaging {
  /** Cursor to retrieve items after (older than) those returned */
  after?: string;
  /** Cursor to retrieve items before (newer than) those returned */
  before?: string;
}

/**
 * Response to a query for a list of posts (`q=source`, without a `url`)
 *
 * The Micropub specification only defines querying the source of a single
 * post. Listing posts is a Micropub extension.
 * @see {@link https://micropub.spec.indieweb.org/#source-content}
 * @see {@link https://indieweb.org/Micropub-extensions}
 */
interface MicropubSourceListResponse {
  /** Posts, as microformats2 */
  items: MicroformatRoot[];
  /** Cursors to retrieve more posts */
  paging: MicropubPaging;
  /** Number of posts matching the query, not just those returned */
  _count?: number;
}

/**
 * Response to a media endpoint query for a list of files (`q=source`)
 *
 * The Micropub specification doesn’t define querying the media endpoint.
 * @see {@link https://micropub.spec.indieweb.org/#media-endpoint}
 * @see {@link https://indieweb.org/Micropub-extensions}
 */
interface MicropubMediaSourceListResponse {
  /** Properties of each file */
  items: Jf2Properties[];
  /** Cursors to retrieve more files */
  paging: MicropubPaging;
}
