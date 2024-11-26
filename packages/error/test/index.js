import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { IndiekitError } from "../index.js";

const indiekitError = () => {
  throw new IndiekitError("Message", {
    cause: new Error("This was the cause"),
  });
};

describe("error", () => {
  it("Gets error", () => {
    const error = new IndiekitError();
    const result = error.getError("bad_request");

    assert.deepEqual(result, {
      code: "bad_request",
      name: "BadRequestError",
      status: 400,
    });
  });

  it("Throws custom error", () => {
    assert.throws(
      () => {
        indiekitError();
      },
      (error) => {
        assert.equal(error instanceof IndiekitError, true);
        assert.equal(error.code, "indiekit");
        assert.equal(error.message, "Message");
        assert.equal(error.name, "IndiekitError");
        assert.equal(error.status, 500);
        assert.equal(error.cause.message, "This was the cause");
        return true;
      },
    );
  });

  it("Throws custom error as a string", () => {
    assert.throws(
      () => {
        indiekitError();
      },
      (error) => {
        assert.equal(error.toString(), "IndiekitError: Message");
        return true;
      },
    );
  });

  it("Throws 400 bad request error", () => {
    assert.throws(
      () => {
        throw IndiekitError.badRequest("Message");
      },
      {
        code: "bad_request",
        name: "BadRequestError",
        status: 400,
      },
    );
  });

  it("Throws 401 unauthorized error", () => {
    assert.throws(
      () => {
        throw IndiekitError.unauthorized("Message");
      },
      {
        code: "unauthorized",
        name: "UnauthorizedError",
        status: 401,
      },
    );
  });

  it("Throws 403 unauthorized error", () => {
    assert.throws(
      () => {
        throw IndiekitError.forbidden("Message");
      },
      {
        code: "forbidden",
        name: "ForbiddenError",
        status: 403,
      },
    );
  });

  it("Throws 404 not found error", () => {
    assert.throws(
      () => {
        throw IndiekitError.notFound("Message");
      },
      {
        code: "not_found",
        name: "NotFoundError",
        status: 404,
      },
    );
  });

  it("Throws 415 unsupported media type error", () => {
    assert.throws(
      () => {
        throw IndiekitError.unsupportedMediaType("Message");
      },
      {
        code: "unsupported_media_type",
        name: "UnsupportedMediaTypeError",
        status: 415,
      },
    );
  });

  it("Throws 501 not implemented error", () => {
    assert.throws(
      () => {
        throw IndiekitError.notImplemented("Message", {
          uri: "https://help.example/501",
        });
      },
      {
        code: "not_implemented",
        name: "NotImplementedError",
        status: 501,
        uri: "https://help.example/501",
      },
    );
  });
});
