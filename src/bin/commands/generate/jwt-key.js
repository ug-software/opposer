import * as crypto from "../../helpers/crypto.js";
import system from "../../../esm/system/index.js";

export const command = "generate:jwt-key";
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

  if (!length && !phrase) {
    length = 32;
  }

  if (length) {
    const hash = crypto.hash(length);
    console.log(`--> Generated JWT Key (${length} chars): ${hash}`);
  }

  if (phrase) {
    const hash = crypto.deterministic(phrase, salt);
    console.log(`--> Generated JWT Key from phrase: ${hash}`);
  }
};
