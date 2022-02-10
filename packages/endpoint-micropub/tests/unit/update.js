import test from "ava";
import {
  addProperties,
  deleteEntries,
  deleteProperties,
  replaceEntries,
} from "../../lib/update.js";

test.beforeEach((t) => {
  t.context.properties = {
    content: "hello world",
    published: "2019-08-17T23:56:38.977+01:00",
    category: "foo",
    "mp-slug": "baz",
  };
});

test("Add properties to object", (t) => {
  const additions = { syndication: ["http://website.example"] };

  const result = addProperties(t.context.properties, additions);

  t.deepEqual(result.syndication, ["http://website.example"]);
});

test("Add properties to existing value", (t) => {
  const additions = { category: ["bar"] };

  const result = addProperties(t.context.properties, additions);

  t.deepEqual(result.category, ["foo", "bar"]);
});

test("Add properties to existing array", (t) => {
  const additions = { category: ["baz"] };

  const result = addProperties(
    {
      category: ["foo", "bar"],
    },
    additions
  );

  t.deepEqual(result.category, ["foo", "bar", "baz"]);
});

test("Deletes individual entries for properties of an object", (t) => {
  const properties = {
    name: "Lunchtime",
    category: ["foo", "bar"],
  };

  const result = deleteEntries(properties, { category: ["foo"] });

  t.deepEqual(result.category, ["bar"]);
});

test("Deletes individual entries for properties of an object (removing property if last entry removed)", (t) => {
  const properties = {
    name: "Lunchtime",
    category: ["foo", "bar"],
  };

  const result = deleteEntries(properties, { category: ["foo", "bar"] });

  t.falsy(result.category);
});

test("Deletes individual entries for properties of an object (ignores properties that don’t exist)", (t) => {
  const properties = {
    name: "Lunchtime",
    category: ["foo", "bar"],
  };

  const result = deleteEntries(properties, { tags: ["foo", "bar"] });

  t.falsy(result.tags);
});

test("Throws error if requested deletion is not an array", (t) => {
  const properties = { name: "Lunchtime" };

  t.throws(
    () => {
      deleteEntries(properties, { category: "foo" });
    },
    {
      message: "category should be an array",
    }
  );
});

test("Deletes property", (t) => {
  const properties = {
    name: "Lunchtime",
    category: ["foo", "bar"],
  };

  const result = deleteProperties(properties, ["category"]);

  t.falsy(result.category);
});

test("Replaces property value", (t) => {
  const properties = { name: "Lunchtime" };

  const result = replaceEntries(properties, { name: ["Dinnertime"] });

  t.is(result.name, "Dinnertime");
});

test("Replaces property value (adding property if doesn’t exist)", (t) => {
  const properties = { name: "Lunchtime" };

  const result = replaceEntries(properties, {
    content: ["I ate a cheese sandwich"],
  });

  t.is(result.content, "I ate a cheese sandwich");
});

test("Throws error if requested replacement is not an array", (t) => {
  const properties = { name: "Lunchtime" };

  t.throws(
    () => {
      replaceEntries(properties, { name: "Dinnertime" });
    },
    {
      message: "Replacement value should be an array",
    }
  );
});
