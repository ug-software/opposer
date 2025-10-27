import * as crypto from "../../helpers/crypto.js";
import * as system from "../../../system/index.js";

export const command = "generate jwt-key";
export const desc = "Generate a random JWT key.";

export const builder = {
  length: {
    alias: "l",
    type: "number",
    default: null,
    describe: "Size of the key to be generated",
  },
  phrase: {
    alias: "p",
    type: "string",
    default: null,
    describe: "Phrase to be used to generate deterministic hash.",
  },
  salt: {
    alias: "s",
    type: "number",
    default: 30,
    describe: "Number of rounds when generating deterministic hash.",
  },
};

export const handler = ({ length, phrase, salt }) => {
  if (length && phrase) {
    throw new Error("Pass only one argument, either length or phrase.");
  }

  if (!length) {
    length = 32;
  }

  if (length) {
    const hash = crypto.hash(length);
    const settings = system.getSettingsFile();

    settings.jwt = hash;
    system.saveSettingsFile(settings);

    console.log(`JWT Key (${length} chars):`);
  }

  if (phrase) {
    const hash = crypto.deterministic(phrase, salt);
    const settings = system.getSettingsFile();

    settings.jwt = hash;
    system.saveSettingsFile(settings);

    console.log(`JWT deterministic phase generated (${phrase}):`);
  }
};
