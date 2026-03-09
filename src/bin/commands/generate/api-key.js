import * as crypto from "../../helpers/crypto.js";
import system from "../../../esm/system/index.js";

export const command = "generate:api-key";
export const desc = "Generate a new API key.";

export const builder = {
  expires: {
    alias: "e",
    type: "string",
    default: null,
    describe: "Expiration date for the API key",
  },
};

export const handler = async ({ expires }) => {
  const key = crypto.hash(32);
  const settings = system.getSettingsFile();

  console.log('--> Generating API Key...');
  console.log(`--> Key: ${key}`);
  
  if (expires) {
    console.log(`--> Expires: ${expires}`);
  }

  console.log('--> Note: You should store this key securely.');
};
