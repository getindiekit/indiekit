import test from "ava";
import {
  createRequestUri,
  getRequestUriData,
} from "../../lib/pushed-authorization-request.js";

test("Creates a PAR URI", (t) => {
  const request = {
    app: { locals: {} },
    query: { foo: "bar" },
  };
  const result = createRequestUri(request);

  t.regex(result, /^urn:ietf:params:oauth:request_uri:[\w-]{16}$/);
});

test("Gets data from PAR URI", (t) => {
  const request = {
    app: {
      locals: {
        qGaan5uh5l9yp2AM: { foo: "bar" },
      },
    },
    query: {
      request_uri: "urn:ietf:params:oauth:request_uri:qGaan5uh5l9yp2AM",
    },
  };
  const result = getRequestUriData(request);

  t.is(result.foo, "bar");
});
