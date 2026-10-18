declare module "mock-session" {
  /**
   * Create a signed session cookie, as `cookie-session` would
   * @param name - Cookie name
   * @param keys - Key used to sign the cookie
   * @param data - Session data
   * @returns Cookie header value
   */
  export default function mockSession(
    name: string,
    keys: string,
    data: object,
  ): string;
}
