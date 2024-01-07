import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import { mockRequest } from "mock-req-res";
import { getEndpoints } from "../../lib/endpoints.js";

const application = {
  _mediaEndpointPath: "/media",
  _tokenEndpointPath: "/token",
};

describe("indiekit/lib/endpoints", () => {
  it("Gets endpoints from server derived values", () => {
    const result = getEndpoints(
      application,
      mockRequest({
        headers: { host: "server.example" },
        protocol: "https",
      }),
    );

    assert.equal(result.mediaEndpoint, "https://server.example/media");
    assert.equal(result.tokenEndpoint, "https://server.example/token");
  });

  it("Gets endpoints from publication configuration", () => {
    application.mediaEndpoint = "https://website.example/media";
    const result = getEndpoints(
      application,
      mockRequest({
        headers: { host: "server.example" },
        protocol: "https",
      }),
    );

    assert.equal(result.mediaEndpoint, "https://website.example/media");
    assert.equal(result.tokenEndpoint, "https://server.example/token");
  });
});
