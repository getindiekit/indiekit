import test from "ava";
import { getEndpoints } from "../../lib/endpoints.js";

test.beforeEach((t) => {
  t.context = {
    _mediaEndpointPath: "/media",
    _tokenEndpointPath: "/token",
  };
});

test("Gets endpoints from server derived values", (t) => {
  const result = getEndpoints(t.context, {
    headers: { host: "server.example" },
    protocol: "https",
  });

  t.is(result.mediaEndpoint, "https://server.example/media");
  t.is(result.tokenEndpoint, "https://server.example/token");
});

test("Gets endpoints from publication configuration", (t) => {
  t.context.mediaEndpoint = "https://website.example/media";
  const result = getEndpoints(t.context, {
    headers: { host: "server.example" },
    protocol: "https",
  });

  t.is(result.mediaEndpoint, "https://website.example/media");
  t.is(result.tokenEndpoint, "https://server.example/token");
});
