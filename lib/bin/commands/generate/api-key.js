import { DataSource } from "typeorm";
import * as system from "../../../esm/system/index.js";
import * as crypto from "../../helpers/crypto.js";

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

  var db = new DataSource(settings.database);
  try {
    await db.initialize();

    await db.query(`
          CREATE TABLE IF NOT EXISTS ke (
              id SERIAL PRIMARY KEY,
              hs VARCHAR(255) NOT NULL,
              ct TIMESTAMP NOT NULL DEFAULT NOW(),
              ex TIMESTAMP NOT NULL DEFAULT (NOW() + INTERVAL '1 year')
          );
        `);

    if (expires) {
      expires = new Date(expires);
    }

    var hash = crypto.hash(32);
    var result = await db.query(
      `
          INSERT INTO ke (hs, ex, ct)
              VALUES($1, $2, NOW())
              RETURNING hs, ex
        `,
      [hash, expires]
    );

    console.log("Api Key created successfully:");
    console.log(result[0]);
  } catch (error) {
    throw new Error(error);
  } finally {
    db.destroy();
  }
};
