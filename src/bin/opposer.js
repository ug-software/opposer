#!/usr/bin/env node
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import * as generateJwtKey from "./commands/generate/jwt-key.js";
import * as generateApiKey from "./commands/generate/api-key.js";
import * as generateAppMap from "./commands/generate/aplication-map.js";

yargs(hideBin(process.argv))
  .scriptName("opposer")
  .usage("$0 <cmd> [args]")
  .command(generateJwtKey)
  .command(generateApiKey)
  .command(generateAppMap)
  .demandCommand(
    1,
    "É necessário informar um comando. Use --help para listar todos."
  )
  .strict()
  .help()
  .alias("h", "help")
  .alias("v", "version")
  .wrap(null)
  .parse();
