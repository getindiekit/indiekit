/**
 * Redirect HTTP requests to HTTPS
 *
 * @param {object} request HTTP request
 * @param {object} response HTTP response
 * @param {Function} next Callback
 * @returns {object} HTTP response
 */
export function forceHttps(req, res, next) {
  let protocol = req.headers['x-forwarded-proto']

  if (protocol !== 'https') {
    console.info('Redirecting request to https')
    // 302 temporary. This is a feature that can be disabled
    return res.redirect(302, 'https://' + req.get("Host") + req.originalUrl)
  }

  // Mark proxy as secure (allows secure cookies)
  req.connection.proxySecure = true
  next()
}
