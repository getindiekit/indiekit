import test from "ava";
import { IndiekitError } from "../index.js";

const indiekitError = () => {
  throw new IndiekitError("Message", {
    cause: new Error("This was the cause"),
  });
};

test("Gets error", (t) => {
  const error = new IndiekitError();
  const result = error.getError("bad_request");

  t.deepEqual(result, {
    code: "bad_request",
    name: "BadRequestError",
    status: 400,
  });
});

test("Throws custom error", (t) => {
  const result = t.throws(
    () => {
      indiekitError();
    },
    {
      instanceOf: IndiekitError,
      code: "indiekit",
      message: "Message",
      name: "IndiekitError",
    }
  );

  t.is(result.status, 500);
  t.is(result.cause.message, "This was the cause");
});

test("Throws custom error as a string", (t) => {
  const error = t.throws(
    () => {
      indiekitError();
    },
    {
      instanceOf: IndiekitError,
      code: "indiekit",
      message: "Message",
      name: "IndiekitError",
    }
  );
  const result = error.toString();

  t.is(result, "IndiekitError: Message");
});

test("Throws custom error as JSON", (t) => {
  const error = t.throws(
    () => {
      indiekitError();
    },
    {
      instanceOf: IndiekitError,
      code: "indiekit",
      message: "Message",
      name: "IndiekitError",
    }
  );
  const result = error.toJSON();

  t.is(result.error, "indiekit");
  t.is(result.error_description, "Message");
});

test("Throws 400 bad request error", (t) => {
  const result = t.throws(
    () => {
      throw IndiekitError.badRequest("Message");
    },
    {
      instanceOf: IndiekitError,
      code: "bad_request",
      message: "Message",
      name: "BadRequestError",
    }
  );

  t.is(result.status, 400);
});

test("Throws 401 unauthorized error", (t) => {
  const result = t.throws(
    () => {
      throw IndiekitError.unauthorized("Message");
    },
    {
      instanceOf: IndiekitError,
      code: "unauthorized",
      message: "Message",
      name: "UnauthorizedError",
    }
  );

  t.is(result.status, 401);
});

test("Throws 403 forbidden error", (t) => {
  const result = t.throws(
    () => {
      throw IndiekitError.forbidden("Message");
    },
    {
      instanceOf: IndiekitError,
      code: "forbidden",
      message: "Message",
      name: "ForbiddenError",
    }
  );

  t.is(result.status, 403);
});

test("Throws 404 not found error", (t) => {
  const result = t.throws(
    () => {
      throw IndiekitError.notFound("Message");
    },
    {
      instanceOf: IndiekitError,
      code: "not_found",
      message: "Message",
      name: "NotFoundError",
    }
  );

  t.is(result.status, 404);
});

test("Throws 415 unsupported media type error", (t) => {
  const result = t.throws(
    () => {
      throw IndiekitError.unsupportedMediaType("Message");
    },
    {
      instanceOf: IndiekitError,
      code: "unsupported_media_type",
      message: "Message",
      name: "UnsupportedMediaTypeError",
    }
  );

  t.is(result.status, 415);
});

test("Throws 501 not implemented error", (t) => {
  const result = t.throws(
    () => {
      throw IndiekitError.notImplemented("Message");
    },
    {
      instanceOf: IndiekitError,
      code: "not_implemented",
      message: "Message",
      name: "NotImplementedError",
    }
  );

  t.is(result.status, 501);
});
