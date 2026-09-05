import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { getUserId } from "../../../lib/utils/auth.js";

describe("endpoint-microsub/lib/utils/auth", () => {
  describe("getUserId", () => {
    it("Returns userId from session if available", () => {
      const request = {
        session: { userId: "user-123" },
        app: { locals: { application: {} } },
      };

      assert.equal(getUserId(request), "user-123");
    });

    it("Returns me from session if userId not set", () => {
      const request = {
        session: { me: "https://example.com" },
        app: { locals: { application: {} } },
      };

      assert.equal(getUserId(request), "https://example.com");
    });

    it("Falls back to publication me URL", () => {
      const request = {
        session: {},
        app: {
          locals: {
            application: {
              publication: { me: "https://mysite.com" },
            },
          },
        },
      };

      assert.equal(getUserId(request), "https://mysite.com");
    });

    it("Returns 'default' as final fallback", () => {
      const request = {
        session: {},
        app: { locals: { application: {} } },
      };

      assert.equal(getUserId(request), "default");
    });

    it("Handles undefined session gracefully", () => {
      const request = {
        app: { locals: { application: {} } },
      };

      assert.equal(getUserId(request), "default");
    });
  });
});
