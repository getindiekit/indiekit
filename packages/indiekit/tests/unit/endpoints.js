import test from "ava";
import { testConfig } from "@indiekit-test/config";
import { Indiekit } from "../../index.js";
import { getEndpoints } from "../../lib/endpoints.js";

test.beforeEach(async (t) => {
  const config = await testConfig();
  const indiekit = new Indiekit({ config });
  const { publication } = await indiekit.bootstrap();

  t.context = {
    application: {
      mediaEndpoint: "/media",
      tokenEndpoint: "/token",
    },
    publication,
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
  t.context.publication.mediaEndpoint = "https://website.example/media";
  const result = getEndpoints(t.context, {
    headers: { host: "server.example" },
    protocol: "https",
  });

  t.is(result.mediaEndpoint, "https://website.example/media");
  t.is(result.tokenEndpoint, "https://server.example/token");
});
