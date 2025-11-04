import gulp, { series } from "gulp";
import ts from "gulp-typescript";
import { deleteAsync } from "del";
import chilp from "child_process";
import path from "path";

/*------ build --------*/
const paths = {
  src: "src/**/*.ts",
  cli: "src/bin/**/*",
  dist: "lib",
};

const tsCjs = ts.createProject("tsconfig.cjs.json");
const tsEsm = ts.createProject("tsconfig.esm.json");

export const clean = () => deleteAsync(["lib"]);

export const buildCjs = () =>
  tsCjs
    .src()
    .pipe(tsCjs())
    .pipe(gulp.dest(`${paths.dist}/cjs`));

export const buildEsm = () =>
  tsEsm
    .src()
    .pipe(tsEsm())
    .pipe(gulp.dest(`${paths.dist}/esm`));

export const copyCli = () =>
  gulp.src(paths.cli).pipe(gulp.dest(`${paths.dist}/bin`));

export const build = gulp.series(clean, buildCjs, buildEsm, copyCli);

/*------ build --------*/

/*------ build playground --------*/

const buildPlaygroundFront = (cb) => {
  var cwd = path.join(process.cwd(), "src", "playground");

  chilp.execSync("npm run build", {
    stdio: "inherit",
    cwd,
  });
  cb();
};

const buildPlaygroundServer = (cb) => {
  var file = path.join(process.cwd(), "src", "playground", "index.ts");

  chilp.spawnSync(
    "tsc",
    [file, "-p", "tsconfig.json", "--outDir", "lib/playground"],
    {
      stdio: "inherit",
    }
  );
  cb();
};

const movePlaygroundFiles = () => {
  /*chilp.execSync("npm", ["run", "build"], {
    stdio: "inherit",
    cwd,
  });*/
  cb();
};

export const playground = series(buildPlaygroundServer);

/*------ build playground --------*/

/*------ release --------*/
const changeBranch = (cb) => {
  var release_version = process.env.RELEASE;

  if (!release_version) {
    throw new Error("Necessario informar a release.");
  }

  chilp.execSync(`git checkout -b release/${release_version}`);
  cb();
};

const removeFilesNotNecessaries = () => {
  return deleteAsync([
    ".vscode",
    "src",
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

const clear = gulp.series([removeFilesNotNecessaries]);

const createTag = (cb) => {
  var release_version = process.env.RELEASE;
  chilp.execSync(`git tag v${release_version}`);

  cb();
};

const commitReleaseAndPublishe = (cb) => {
  var release = process.env.RELEASE;
  var description = process.env.DESC;

  chilp.execSync(`npm version ${release} --no-git-tag-version`, {
    stdio: "inherit",
  });

  chilp.execSync("git add --all", { stdio: "inherit" });
  chilp.execSync(`git commit -m "${description}"`, { stdio: "inherit" });
  chilp.execSync(`git push origin release/${release}`, { stdio: "inherit" });
  chilp.execSync(`git push origin v${release}`, { stdio: "inherit" });
  cb();
};

const changeBranchForDevelopAndStashRelease = (cb) => {
  chilp.execSync(`git checkout develop`, { stdio: "inherit" });
  chilp.execSync(`git add --all`, { stdio: "inherit" });
  chilp.execSync(`git stash`, { stdio: "inherit" });
  cb();
};

export const release = gulp.series(
  build,
  changeBranch,
  clear,
  createTag,
  commitReleaseAndPublishe,
  changeBranchForDevelopAndStashRelease
);

/*------ release --------*/
