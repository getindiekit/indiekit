import { createHash } from "node:crypto";

import { AtUri, ids, jsonToLex, lexicons } from "@atproto/api";
import { TID } from "@atproto/common-web";
import { cidForRawHash } from "@atproto/lex-data";

/**
 * Get a CID for some data
 * @param {string|Uint8Array} data - Data to hash
 * @returns {string} CID
 */
const cidFor = (data) =>
  cidForRawHash(createHash("sha256").update(data).digest()).toString();

/**
 * Get message from a thrown value
 * @param {unknown} error - Thrown value
 * @returns {string} Error message
 */
const messageOf = (error) =>
  error instanceof Error ? error.message : String(error);

/**
 * Normalise request headers from Undici, which may be an object or an array
 * of alternating names and values
 * @param {unknown} headers - Request headers
 * @returns {Headers} Headers
 */
const toHeaders = (headers) => {
  if (Array.isArray(headers)) {
    const result = new Headers();
    for (let index = 0; index < headers.length; index += 2) {
      result.append(String(headers[index]), String(headers[index + 1]));
    }

    return result;
  }

  return new Headers(/** @type {Record<string, string>} */ (headers ?? {}));
};

/**
 * Error returned to the client as an XRPC error response
 */
export class XrpcError extends Error {
  /**
   * @param {number} status - HTTP status code
   * @param {string} error - XRPC error name
   * @param {string} message - Error message
   */
  constructor(status, error, message) {
    super(message);
    this.status = status;
    this.error = error;
  }
}

/**
 * Format a JSON response for Undici MockAgent
 * @param {number} statusCode - HTTP status code
 * @param {object} data - Response body
 * @returns {{ statusCode: number, data: string, responseOptions: object }} Reply
 */
const json = (statusCode, data) => ({
  statusCode,
  data: JSON.stringify(data),
  responseOptions: { headers: { "content-type": "application/json" } },
});

/**
 * Minimal in-memory AT Protocol PDS for tests
 *
 * Implements only the XRPC methods used by the Bluesky syndicator. Requests,
 * responses and records are validated against the lexicons that ship with
 * `@atproto/api`, so malformed data is rejected as a real PDS would.
 */
export class MockPds {
  /**
   * @param {string} [origin] - PDS origin
   */
  constructor(origin = "https://pds.example") {
    this.origin = origin;

    /**
     * Accounts, keyed by handle
     * @type {Map<string, { did: string, password: string }>}
     */
    this.accounts = new Map();

    /**
     * Records, keyed by AT URI
     * @type {Map<string, { cid: string, value: object }>}
     */
    this.records = new Map();
  }

  /**
   * Validate and store a record
   * @param {string} repo - Repository DID
   * @param {string} collection - Collection NSID
   * @param {object} record - Record
   * @returns {{ uri: string, cid: string }} Record reference
   */
  #putRecord(repo, collection, record) {
    lexicons.assertValidRecord(collection, jsonToLex(record));

    const uri = AtUri.make(repo, collection, TID.nextStr()).toString();
    const cid = cidFor(JSON.stringify(record));
    this.records.set(uri, { cid, value: record });

    return { uri, cid };
  }

  /**
   * Create an account
   * @param {string} handle - Handle, for example `alice.test`
   * @param {string} [password] - Password
   * @returns {{ did: string, handle: string, password: string }} Account
   */
  createAccount(handle, password = "password") {
    const name = handle.split(".", 1)[0].replaceAll(/[^a-z\d]/g, "");
    const did = `did:plc:${name.padEnd(24, "x").slice(0, 24)}`;
    this.accounts.set(handle, { did, password });

    return { did, handle, password };
  }

  /**
   * Get an account
   * @param {string} handle - Handle
   * @returns {{ did: string, password: string }} Account
   */
  getAccount(handle) {
    const account = this.accounts.get(handle);
    if (!account) {
      throw new XrpcError(400, "InvalidRequest", "Unable to resolve handle");
    }

    return account;
  }

  /**
   * Create a post record directly, without going through XRPC
   * @param {string} handle - Handle of author
   * @param {string} text - Post text
   * @returns {{ uri: string, cid: string }} Post reference
   */
  createPost(handle, text) {
    const { did } = this.getAccount(handle);
    const value = {
      $type: ids.AppBskyFeedPost,
      text,
      createdAt: new Date().toISOString(),
    };

    return this.#putRecord(did, ids.AppBskyFeedPost, value);
  }

  /**
   * Add XRPC intercepts to a MockAgent
   * @param {InstanceType<typeof MockAgent>} agent - Undici MockAgent
   */
  intercept(agent) {
    const pool = agent.get(this.origin);

    /**
     * Intercept an XRPC method, validating input and output against lexicons
     * @param {string} nsid - Method NSID
     * @param {"GET"|"POST"} method - HTTP method
     * @param {XrpcHandler} handler - Method handler
     */
    const xrpc = (nsid, method, handler) => {
      pool
        .intercept({
          path: (path) => path.split("?", 1)[0] === `/xrpc/${nsid}`,
          method,
        })
        .reply(({ path, body, headers }) => {
          const parameters = Object.fromEntries(
            new URL(path, this.origin).searchParams,
          );
          const requestHeaders = toHeaders(headers);
          const contentType = requestHeaders.get("content-type") || "";
          const isJson = method === "POST" && contentType.includes("json");

          try {
            let input = {};

            if (method === "GET") {
              try {
                lexicons.assertValidXrpcParams(nsid, parameters);
              } catch (error) {
                throw new XrpcError(
                  400,
                  "InvalidRequest",
                  `Invalid ${nsid} params: ${messageOf(error)}`,
                );
              }
            }

            if (isJson) {
              input = JSON.parse(
                typeof body === "string"
                  ? body
                  : Buffer.from(/** @type {Uint8Array} */ (body)).toString(),
              );
              lexicons.assertValidXrpcInput(nsid, jsonToLex(input));
            }

            const output = handler(input, parameters, requestHeaders);
            lexicons.assertValidXrpcOutput(nsid, jsonToLex(output));

            return json(200, output);
          } catch (error) {
            return error instanceof XrpcError
              ? json(error.status, {
                  error: error.error,
                  message: error.message,
                })
              : json(400, {
                  error: "InvalidRequest",
                  message: messageOf(error),
                });
          }
        })
        .persist();
    };

    xrpc(ids.ComAtprotoServerCreateSession, "POST", (input) => {
      const { identifier, password } =
        /** @type {{ identifier: string, password: string }} */ (input);
      const account = this.accounts.get(identifier);

      if (account?.password !== password) {
        throw new XrpcError(
          401,
          "AuthenticationRequired",
          "Invalid identifier or password",
        );
      }

      return {
        did: account.did,
        handle: identifier,
        accessJwt: "access",
        refreshJwt: "refresh",
        active: true,
      };
    });

    xrpc(ids.ComAtprotoIdentityResolveHandle, "GET", (_input, { handle }) => ({
      did: this.getAccount(handle).did,
    }));

    xrpc(ids.ComAtprotoRepoCreateRecord, "POST", (input) => {
      const { repo, collection, record } =
        /** @type {{ repo: string, collection: string, record: object }} */ (
          input
        );

      try {
        return this.#putRecord(repo, collection, record);
      } catch (error) {
        throw new XrpcError(
          400,
          "InvalidRequest",
          `Invalid ${collection} record: ${messageOf(error)}`,
        );
      }
    });

    xrpc(
      ids.ComAtprotoRepoGetRecord,
      "GET",
      (_input, { repo, collection, rkey }) => {
        const uri = AtUri.make(repo, collection, rkey).toString();
        const record = this.records.get(uri);

        if (!record) {
          throw new XrpcError(
            400,
            "RecordNotFound",
            `Could not locate record: ${uri}`,
          );
        }

        return { uri, ...record };
      },
    );

    // MockAgent replies are synchronous, so a Blob body can’t be read;
    // derive a stable CID from the request headers instead
    xrpc(
      ids.ComAtprotoRepoUploadBlob,
      "POST",
      (_input, _parameters, headers) => {
        const mimeType =
          headers.get("content-type") || "application/octet-stream";
        const size = Number(headers.get("content-length") || 0);

        return {
          blob: {
            $type: "blob",
            ref: { $link: cidFor(`${mimeType}:${size}`) },
            mimeType,
            size,
          },
        };
      },
    );
  }
}

/**
 * @callback XrpcHandler
 * @param {object} input - Request body
 * @param {Record<string, string>} parameters - Query parameters
 * @param {Headers} headers - Request headers
 * @returns {object} Method output
 * @throws {XrpcError} Error to return as an XRPC error response
 */

/**
 * @import { MockAgent } from "@indiekit-test/undici"
 */
