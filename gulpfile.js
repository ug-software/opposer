import gulp, { series } from "gulp";
import ts from "gulp-typescript";
import { deleteAsync } from "del";
import chilp from "child_process";
import path from "path";
import merge from "merge-stream";
import fs from "fs";

const paths = {
  src: "src/**/*.ts",
  cli: "src/bin/**/*",
  dist: "lib",
};

/*------ build playground --------*/

const buildPlaygroundFront = (cb) => {
  var cwd = path.join(process.cwd(), "src", "playground");

  console.log("-> Installing playground dependencies...");
  try {
    chilp.execSync("npm install", {
      stdio: "inherit",
      cwd,
    });

    console.log("-> Building playground frontend...");
    chilp.execSync("npm run build", {
      stdio: "inherit",
      cwd,
    });
    cb();
  } catch (err) {
    cb(err);
  }
};

const movePlaygroundFiles = () => {
  const cwd = path.join(process.cwd(), "src", "playground", "build");

  console.log("-> Moving playground files to lib...");
  // Check if build exists
  if (!fs.existsSync(cwd)) {
    throw new Error(`Playground build not found at ${cwd}. Did the build step fail?`);
  }

  const cjs = gulp
    .src(`${cwd}/**/*`, { base: cwd })
    .pipe(gulp.dest(`${paths.dist}/cjs/playground/build`));

  const esm = gulp
    .src(`${cwd}/**/*`, { base: cwd })
    .pipe(gulp.dest(`${paths.dist}/esm/playground/build`));

  return merge(cjs, esm);
};

export const playground = series([buildPlaygroundFront, movePlaygroundFiles]);

/*------ build playground --------*/

/*------ build --------*/

const tsCjs = ts.createProject("tsconfig.cjs.json");
const tsEsm = ts.createProject("tsconfig.esm.json");

export const clean = () => {
  console.log("-> Cleaning lib folder...");
  return deleteAsync(["lib"]);
};

export const buildCjs = () => {
  console.log("-> Compiling CJS...");
  return tsCjs
    .src()
    .pipe(tsCjs())
    .pipe(gulp.dest(`${paths.dist}/cjs`));
};

export const buildEsm = () => {
  console.log("-> Compiling ESM...");
  return tsEsm
    .src()
    .pipe(tsEsm())
    .pipe(gulp.dest(`${paths.dist}/esm`));
};

export const copyCli = () => {
  console.log("-> Copying CLI files...");
  return gulp.src(paths.cli).pipe(gulp.dest(`${paths.dist}/bin`));
};

// Ensure CJS directory is treated as CommonJS by Node.js
export const fixCjs = (cb) => {
  console.log("-> Configuring lib/cjs as CommonJS...");
  const cjsPackagePath = path.join(paths.dist, "cjs", "package.json");
  
  // Ensure directory exists
  if (!fs.existsSync(path.dirname(cjsPackagePath))) {
    fs.mkdirSync(path.dirname(cjsPackagePath), { recursive: true });
  }
  
  fs.writeFileSync(cjsPackagePath, JSON.stringify({ type: "commonjs" }, null, 2));
  cb();
};

export const build = gulp.series(
  clean,
  gulp.parallel(buildCjs, buildEsm),
  fixCjs,
  copyCli,
  playground
);

/*------ build --------*/

/*------ release --------*/
const runTests = (cb) => {
  console.log("-> Running tests before release...");
  try {
    chilp.execSync("npm test", { stdio: "inherit" });
    cb();
  } catch (err) {
    cb(err);
  }
};

const changeBranch = (cb) => {
  var release_version = process.env.RELEASE;

  if (!release_version) {
    throw new Error("Necessario informar a release. Ex: RELEASE=1.0.4 DESC='...' npm run release");
  }

  console.log(`-> Creating release branch: release/${release_version}`);
  chilp.execSync(`git checkout -b release/${release_version}`);
  cb();
};

const cleanPackageJson = (cb) => {
  console.log("-> Cleaning package.json for release...");
  const packagePath = path.resolve(process.cwd(), "package.json");
  const pkg = JSON.parse(fs.readFileSync(packagePath, "utf8"));

  delete pkg.scripts;
  delete pkg.devDependencies;

  fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2));
  cb();
};

const removeFilesNotNecessaries = () => {
  console.log("-> Removing development files from release branch...");
  return deleteAsync([
    ".vscode",
    "src",
    "test",
    "node_modules",
    ".gitignore",
    "gulpfile.js",
    "package-lock.json",
    "tsconfig.cjs.json",
    "tsconfig.esm.json",
    "tsconfig.json",
    "opposer-settings.json",
  ]);
};

const createTag = (cb) => {
  var release_version = process.env.RELEASE;
  console.log(`-> Creating tag: v${release_version}`);
  chilp.execSync(`git tag v${release_version}`);
  cb();
};

const commitReleaseAndPublishe = (cb) => {
  var release = process.env.RELEASE;
  var description = process.env.DESC || `Release v${release}`;

  console.log(`-> Updating package version to ${release}...`);
  chilp.execSync(`npm version ${release} --no-git-tag-version`, {
    stdio: "inherit",
  });

  console.log("-> Committing build to release branch...");
  chilp.execSync("git add --all", { stdio: "inherit" });
  chilp.execSync(`git commit -m "${description}"`, { stdio: "inherit" });
  
  console.log("-> Pushing release branch and tag...");
  chilp.execSync(`git push origin release/${release}`, { stdio: "inherit" });
  chilp.execSync(`git push origin v${release}`, { stdio: "inherit" });
  cb();
};

const changeBranchForDevelopAndStashRelease = (cb) => {
  console.log("-> Returning to develop branch...");
  try {
    chilp.execSync(`git checkout develop`, { stdio: "inherit" });
  } catch (e) {
    console.warn("!! Warning: Could not return to 'develop' branch. Please check current branch manually.");
  }
  cb();
};

export const release = gulp.series(
  runTests,
  build,
  cleanPackageJson,
  changeBranch,
  removeFilesNotNecessaries,
  createTag,
  commitReleaseAndPublishe,
  changeBranchForDevelopAndStashRelease
);

/*------ release --------*/
