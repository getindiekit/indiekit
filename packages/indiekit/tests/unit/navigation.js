import test from "ava";
import { getNavigation } from "../../lib/navigation.js";

test.beforeEach((t) => {
  t.context.application = {
    locale: "en",
    navigationItems: [],
  };
});

test("Returns logged out navigation", (t) => {
  const result = getNavigation(
    t.context.application,
    {
      session: {
        token: false,
      },
    },
    {
      __: (string) => string,
    }
  );

  t.is(result[0].href, "/session/login");
});

test("Returns logged in navigation", (t) => {
  const result = getNavigation(
    t.context.application,
    {
      session: {
        token: true,
      },
    },
    {
      __: (string) => string,
    }
  );

  t.is(result[0].href, "/session/logout");
});
