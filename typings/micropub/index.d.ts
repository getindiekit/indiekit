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
