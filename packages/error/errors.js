export const errors = {
  indiekit: {
    status: 500,
    name: "IndiekitError",
  },
  bad_request: {
    status: 400,
    name: "BadRequestError",
  },
  forbidden: {
    status: 403,
    name: "ForbiddenError",
  },
  insufficient_scope: {
    status: 403,
    name: "InsufficientScopeError",
  },
  invalid_request: {
    status: 400,
    name: "InvalidRequestError",
  },
  invalid_token: {
    status: 401,
    name: "InvalidTokenError",
  },
  not_found: {
    status: 404,
    name: "NotFoundError",
  },
  not_implemented: {
    status: 501,
    name: "NotImplementedError",
  },
  unauthorized: {
    status: 401,
    name: "UnauthorizedError",
  },
  unsupported_media_type: {
    status: 415,
    name: "UnsupportedMediaTypeError",
  },
};
