import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import { gzipSync } from "node:zlib";

import {
  MockAgent,
  bundledVersion,
  getGlobalDispatcher,
  packageName,
  setGlobalDispatcher,
} from "../index.js";

describe("@indiekit-test/undici", () => {
  it("Uses same major version as Undici bundled with Node.js", async () => {
    const { default: package_ } = await import(`${packageName}/package.json`, {
      with: { type: "json" },
    });

    assert.equal(
      package_.version.split(".", 1)[0],
      bundledVersion.split(".", 1)[0],
    );
  });

  it("Intercepts built-in fetch, keeping headers and decoding body", async () => {
    const previousDispatcher = getGlobalDispatcher();
    const agent = new MockAgent();
    agent.disableNetConnect();
    setGlobalDispatcher(agent);

    try {
      agent
        .get("https://website.example")
        .intercept({ path: "/data" })
        .reply(200, gzipSync(JSON.stringify({ ok: true })), {
          headers: {
            "content-encoding": "gzip",
            "content-type": "application/json",
          },
        });

      // Global fetch, i.e. the Undici bundled with Node.js
      const response = await fetch("https://website.example/data");

      assert.equal(response.headers.get("content-type"), "application/json");
      assert.deepEqual(await response.json(), { ok: true });
    } finally {
      await agent.close();
      setGlobalDispatcher(previousDispatcher);
    }
  });
});
