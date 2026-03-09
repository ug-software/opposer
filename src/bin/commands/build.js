import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import system from '../../../esm/system/index.js';

export const command = "build";
export const desc = "Bundle the project into a single minified file.";

export const builder = {
  entry: {
    alias: "e",
    type: "string",
    default: "src/index.ts",
    describe: "Entry point of the application",
  },
  output: {
    alias: "o",
    type: "string",
    default: "dist/index.js",
    describe: "Output file path",
  },
};

export const handler = async (argv) => {
  const root = process.cwd();
  const entryPath = path.resolve(root, argv.entry);
  const outputPath = path.resolve(root, argv.output);

  console.log('--> Starting Opposer Build...');

  try {
    // 1. Discover all entities
    console.log('--> Scanning for controllers, models and schedules...');
    
    // We don't actually need to await these here if we are just calling esbuild,
    // but it's a good check to see if the project is valid.
    await system.getAllControllers();
    await system.getAllModels();
    await system.getAllSchedules();

    console.log('--> Invoking build engine...');

    const esbuildArgs = [
      'esbuild',
      argv.entry,
      '--bundle',
      '--minify',
      '--platform=node',
      '--format=esm',
      `--outfile=${argv.output}`,
      '--external:bcrypt',
      '--external:sqlite3',
      '--external:mysql2',
      '--external:pg'
    ];

    const child = spawn('npx', esbuildArgs, { 
      stdio: 'inherit',
      shell: true 
    });

    child.on('close', (code) => {
      if (code === 0) {
        console.log(`\n--> Build completed successfully: ${argv.output}`);
        console.log('--> You can now run your app with: node ' + argv.output);
      } else {
        console.error(`\n--> Build failed with code ${code}`);
        console.log('--> Ensure you have "esbuild" installed or accessible via npx.');
      }
    });

  } catch (error) {
    console.error('--> Build error:', error.message);
  }
};
