import * as system from "../../../esm/system/index.js";
import * as crypto from "../../helpers/crypto.js";
import {
  PostgresDriver,
  SQLiteDriver,
  MySQLDriver,
} from "../../../esm/orm/index.js";

export const command = "generate api-key";
export const desc = "Generates a random Api key.";

export const builder = {
  expires: {
    alias: "e",
    type: "string",
    default: new Date(
      new Date().getFullYear() + 1,
      new Date().getMonth(),
      new Date().getDate()
    ).toString(),
    describe: "Key expiration date (e.g. 2026/12/31)",
  },
};

export const handler = async ({ expires }) => {
  const settings = system.getSettingsFile();

  if (!settings.database) {
    throw new Error(
      "You need to configure the database connection in opposer-settings.json"
    );
  }

  let driver;
  const type = settings.database.type;

  switch (type) {
    case "postgres":
      driver = new PostgresDriver(settings.database);
      break;
    case "sqlite":
      driver = new SQLiteDriver(settings.database);
      break;
    case "mysql":
      driver = new MySQLDriver(settings.database);
      break;
    default:
      throw new Error(`[database] Unsupported database type: ${type}`);
  }

  try {
    await driver.connect();

    // Create table using raw query if not exists
    // (We could use driver.createTable but it needs EntityMetadata and FieldMetadata objects)
    const quote = (id) => driver.quoteIdentifier(id);

    if (type === "sqlite") {
      await driver.query(`
          CREATE TABLE IF NOT EXISTS ${quote("ke")} (
              ${quote("id")} INTEGER PRIMARY KEY AUTOINCREMENT,
              ${quote("hs")} TEXT NOT NULL,
              ${quote("ct")} DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
              ${quote("ex")} DATETIME NOT NULL
          );
        `);
    } else if (type === "mysql") {
      await driver.query(`
          CREATE TABLE IF NOT EXISTS ${quote("ke")} (
              ${quote("id")} INT AUTO_INCREMENT PRIMARY KEY,
              ${quote("hs")} VARCHAR(255) NOT NULL,
              ${quote("ct")} DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
              ${quote("ex")} DATETIME NOT NULL
          );
        `);
    } else {
      // Postgres
      await driver.query(`
          CREATE TABLE IF NOT EXISTS ${quote("ke")} (
              ${quote("id")} SERIAL PRIMARY KEY,
              ${quote("hs")} VARCHAR(255) NOT NULL,
              ${quote("ct")} TIMESTAMP NOT NULL DEFAULT NOW(),
              ${quote("ex")} TIMESTAMP NOT NULL DEFAULT (NOW() + INTERVAL '1 year')
          );
        `);
    }

    if (expires) {
      expires = new Date(expires);
    }

    var hash = crypto.hash(32);
    let result;

    if (type === "postgres") {
      result = await driver.query(
        `
          INSERT INTO ${quote("ke")} (${quote("hs")}, ${quote("ex")}, ${quote(
          "ct"
        )})
              VALUES($1, $2, NOW())
              RETURNING ${quote("hs")}, ${quote("ex")}
        `,
        [hash, expires]
      );
    } else {
      // SQLite / MySQL
      await driver.query(
        `
          INSERT INTO ${quote("ke")} (${quote("hs")}, ${quote("ex")})
              VALUES(?, ?)
        `,
        [hash, expires]
      );

      result = await driver.query(
        `SELECT ${quote("hs")}, ${quote("ex")} FROM ${quote(
          "ke"
        )} WHERE ${quote("hs")} = ?`,
        [hash]
      );
    }

    console.log("Api Key created successfully:");
    console.log(result[0]);
  } catch (error) {
    throw new Error(error);
  } finally {
    if (driver) await driver.disconnect();
  }
};
