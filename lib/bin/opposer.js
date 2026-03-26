#!/usr/bin/env node
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import * as generateJwtKey from "./commands/generate/jwt-key.js";
import * as generateApiKey from "./commands/generate/api-key.js";
import * as init from "./commands/init.js";
import * as build from "./commands/build.js";

yargs(hideBin(process.argv))
  .scriptName("opposer")
  .usage("$0 <cmd> [args]")
  .command(init)
  .command(build)
  .command(generateJwtKey)
  .command(generateApiKey)
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
