/**
 * SQLite-backed collection, spike for #821.
 *
 * Implements the subset of the MongoDB collection interface that Indiekit
 * actually uses, so that code written against `addCollection` — `getCursor`
 * included — runs unchanged. Documents are stored as JSON; `_id` is an
 * autoincrement integer, which is monotonic in insertion order and so
 * preserves the ordering `getCursor` relies on.
 *
 * Not a migration. The question this answers is whether the collection
 * interface is a workable seam, not whether this is the right schema.
 */

/* eslint-disable unicorn/no-unsafe-sqlite-interpolation --
   Only the table name is interpolated, and it is validated below. SQL
   identifiers cannot be bound as parameters; every value still is. */
import { DatabaseSync } from "node:sqlite";

/**
 * Operators seen in Indiekit's queries, mapped to SQL comparisons.
 */
const OPERATORS = {
  $lt: "<",
  $gt: ">",
  $lte: "<=",
  $gte: ">=",
  $ne: "!=",
};

/**
 * Translate one query field into a SQL fragment and its parameters.
 * @param {string} field - Field name, dotted for nested properties
 * @param {object|string|number|boolean} condition - Value or operator object
 * @returns {{sql: string, parameters: Array}} Fragment and parameters
 */
const clause = (field, condition) => {
  const column = field === "_id" ? "_id" : `json_extract(doc, '$.${field}')`;

  if (condition === null || typeof condition !== "object") {
    return { sql: `${column} = ?`, parameters: [condition] };
  }

  const parts = [];
  const parameters = [];

  for (const [operator, value] of Object.entries(condition)) {
    if (operator === "$exists") {
      parts.push(`${column} IS ${value ? "NOT NULL" : "NULL"}`);
      continue;
    }

    if (operator === "$in") {
      parts.push(`${column} IN (${value.map(() => "?").join(", ")})`);
      parameters.push(...value);
      continue;
    }

    const sql = OPERATORS[operator];
    if (!sql) throw new Error(`Unsupported operator: ${operator}`);
    parts.push(`${column} ${sql} ?`);
    parameters.push(value);
  }

  return { sql: parts.join(" AND "), parameters };
};

/**
 * Build a WHERE clause from a Mongo-style query object.
 * @param {object} query - Query
 * @returns {{where: string, parameters: Array}} SQL and parameters
 */
const buildWhere = (query = {}) => {
  const parts = [];
  const parameters = [];

  for (const [field, condition] of Object.entries(query)) {
    const { sql, parameters: values } = clause(field, condition);
    parts.push(sql);
    parameters.push(...values);
  }

  return {
    where: parts.length > 0 ? `WHERE ${parts.join(" AND ")}` : "",
    parameters,
  };
};

/**
 * Turn a stored row back into a document.
 * @param {object} row - Row with `_id` and JSON `doc`
 * @returns {object} Document
 */
const hydrate = (row) => ({ _id: row._id, ...JSON.parse(row.doc) });

/**
 * Open a SQLite-backed collection.
 * @param {string} [filename] - Database file, or ":memory:"
 * @param {string} [name] - Collection name
 * @returns {object} Collection
 */
export const sqliteCollection = (filename = ":memory:", name = "items") => {
  if (!/^\w+$/.test(name)) {
    throw new Error(`Unsafe collection name: ${name}`);
  }

  const database = new DatabaseSync(filename);
  database.exec(
    `CREATE TABLE IF NOT EXISTS ${name} (_id INTEGER PRIMARY KEY AUTOINCREMENT, doc TEXT NOT NULL)`,
  );

  const collection = {
    // Ids reach `getCursor` as strings from the query string; here they are
    // integers. This is the one place the storage layer's id type leaks out.
    castId: Number,

    async insertOne(document) {
      const rest = { ...document };
      delete rest._id;
      const { lastInsertRowid } = database
        .prepare(`INSERT INTO ${name} (doc) VALUES (?)`)
        .run(JSON.stringify(rest));
      return { acknowledged: true, insertedId: Number(lastInsertRowid) };
    },

    find(query, options = {}) {
      const { where, parameters } = buildWhere(query);
      const direction = options.sort?._id === -1 ? "DESC" : "ASC";
      const limit = options.limit ? `LIMIT ${Math.trunc(options.limit)}` : "";
      const rows = database
        .prepare(
          `SELECT * FROM ${name} ${where} ORDER BY _id ${direction} ${limit}`,
        )
        .all(...parameters);

      return {
        async toArray() {
          return rows.map((row) => hydrate(row));
        },
      };
    },

    async findOne(query) {
      const { where, parameters } = buildWhere(query);
      const row = database
        .prepare(`SELECT * FROM ${name} ${where} LIMIT 1`)
        .get(...parameters);
      // eslint-disable-next-line unicorn/no-null -- matches the driver
      return row ? hydrate(row) : null;
    },

    async countDocuments(query) {
      const { where, parameters } = buildWhere(query);
      const { count } = database
        .prepare(`SELECT COUNT(*) AS count FROM ${name} ${where}`)
        .get(...parameters);
      return count;
    },

    /**
     * Replace the first matching document, or insert it when none matches
     * and `upsert` is set. Indiekit writes posts this way rather than with
     * update operators, so this is the only write path besides `insertOne`.
     * @param {object} query - Query
     * @param {object} document - Replacement document
     * @param {object} [options] - Options
     * @param {boolean} [options.upsert] - Insert when nothing matched
     * @returns {Promise<object>} Result
     */
    async replaceOne(query, document, options = {}) {
      const existing = await collection.findOne(query);
      const rest = { ...document };
      delete rest._id;

      if (existing) {
        database
          .prepare(`UPDATE ${name} SET doc = ? WHERE _id = ?`)
          .run(JSON.stringify(rest), existing._id);
        return { matchedCount: 1, modifiedCount: 1, upsertedCount: 0 };
      }

      if (!options.upsert) {
        return { matchedCount: 0, modifiedCount: 0, upsertedCount: 0 };
      }

      const { insertedId } = await collection.insertOne(rest);
      return {
        matchedCount: 0,
        modifiedCount: 0,
        upsertedCount: 1,
        upsertedId: insertedId,
      };
    },

    async deleteOne(query) {
      const existing = await collection.findOne(query);
      if (!existing) return { deletedCount: 0 };
      database.prepare(`DELETE FROM ${name} WHERE _id = ?`).run(existing._id);
      return { deletedCount: 1 };
    },
  };

  return collection;
};
