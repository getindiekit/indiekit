import process from "node:process";
import "dotenv/config.js"; // eslint-disable-line import/no-unassigned-import
import test from "ava";
import nock from "nock";
import sinon from "sinon";
import mockReqRes from "mock-req-res";
import { getFixture } from "@indiekit-test/get-fixture";
import { IndieAuth } from "../../lib/indieauth.js";

const { mockRequest, mockResponse } = mockReqRes;
const indieauth = new IndieAuth({
  me: process.env.TEST_PUBLICATION_URL,
  tokenEndpoint: "https://tokens.indieauth.com/token",
});

test.beforeEach((t) => {
  t.context = {
    accessToken: {
      me: process.env.TEST_PUBLICATION_URL,
      scope: "create update delete media",
    },
    bearerToken: process.env.TEST_TOKEN,
    me: process.env.TEST_PUBLICATION_URL,
  };
});

test("Validates state", (t) => {
  const state = indieauth.generateState();
  const result = indieauth.validateState(state);

  t.is(String(result.date).slice(0, 10), String(Date.now()).slice(0, 10));
});

test("Invalidates state", (t) => {
  const result = indieauth.validateState("state");

  t.false(result);
});

test("Throws error getting authentication URL", async (t) => {
  await t.throwsAsync(
    indieauth.getAuthUrl("https://indieauth.com/auth", null, "state"),
    {
      message: "You need to provide some scopes",
    }
  );
});

test("Exchanges authorization code for access token", async (t) => {
  nock("https://tokens.indieauth.com").post("/token").query(true).reply(200, {
    access_token: process.env.TEST_TOKEN,
    scope: "create",
  });

  const result = await indieauth.authorizationCodeGrant(
    "https://tokens.indieauth.com/token",
    "code"
  );

  t.is(result, process.env.TEST_TOKEN);
});

test.serial(
  "Throws error exchanging authorization code for invalid access token",
  async (t) => {
    nock("https://tokens.indieauth.com").post("/token").query(true).reply(200);

    await t.throwsAsync(
      indieauth.authorizationCodeGrant(
        "https://tokens.indieauth.com/token",
        "code"
      ),
      {
        message: "The token endpoint did not return the expected parameters",
      }
    );
  }
);

test("Throws error exchanging invalid code for access token", async (t) => {
  nock("https://tokens.indieauth.com").post("/token").query(true).reply(404, {
    error: "invalid_request",
    error_description: "The code provided was not valid",
  });

  await t.throwsAsync(
    indieauth.authorizationCodeGrant(
      "https://tokens.indieauth.com/token",
      "code"
    ),
    {
      message: "The code provided was not valid",
    }
  );
});

test("Throws error exchanging authorization code during request", async (t) => {
  nock("https://tokens.indieauth.com")
    .post("/token")
    .query(true)
    .replyWithError("Not found");

  await t.throwsAsync(
    indieauth.authorizationCodeGrant(
      "https://tokens.indieauth.com/token",
      "code"
    ),
    {
      message: "Not found",
    }
  );
});

test("Checks if user is authorized", async (t) => {
  nock("https://tokens.indieauth.com")
    .get("/token")
    .reply(200, t.context.accessToken);
  const request = mockRequest({
    app: {
      locals: {
        application: {},
        publication: {
          tokenEndpoint: "https://tokens.indieauth.com/token",
        },
      },
    },
    headers: { authorization: `Bearer ${t.context.bearerToken}` },
    session: {},
  });
  const response = mockResponse();
  const next = sinon.spy();

  await indieauth.authorise()(request, response, next);

  t.is(request.session.scope, t.context.accessToken.scope);
  t.is(request.session.token, t.context.bearerToken);
  t.true(next.calledOnce);
});

test("Throws error checking if user is authorized", async (t) => {
  const request = mockRequest({
    app: { locals: { publication: {} } },
    method: "post",
    session: {},
  });
  const response = mockResponse();
  const next = sinon.spy();

  await indieauth.authorise()(request, response, next);

  t.true(next.calledOnce);
  t.true(next.firstCall.args[0] instanceof Error);
});

test("Throws error redirecting user to IndieAuth login", async (t) => {
  nock(process.env.TEST_PUBLICATION_URL)
    .get("/token")
    .reply(200, getFixture("html/home.html"));
  const request = mockRequest({
    query: { redirect: "/status" },
  });
  const response = mockResponse({
    __: () => ({ session: {} }),
    locals: { application: { url: "http://localhost" } },
  });

  await indieauth.login()(request, response);

  t.true(response.status.calledWith(401));
  t.true(response.render.calledWith("session/login"));
});

test("Throws error checking credentials returned by IndieAuth", async (t) => {
  const request = mockRequest({
    app: { locals: { publication: {} } },
    query: { code: "", state: "" },
  });
  const response = mockResponse();
  const next = sinon.spy();

  await indieauth.authenticate()(request, response, next);

  t.true(next.calledOnce);
  t.true(next.firstCall.args[0] instanceof Error);
});
