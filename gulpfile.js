import gulp from "gulp";
import ts from "gulp-typescript";
import { deleteAsync } from "del";
import { execSync } from "child_process";

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
  tsCjs.src().pipe(tsCjs()).pipe(gulp.dest(`${paths.dist}/cjs`));

export const buildEsm = () =>
  tsEsm.src().pipe(tsEsm()).pipe(gulp.dest(`${paths.dist}/esm`));

export const copyCli = () =>
  gulp
    .src(paths.cli)
    .pipe(gulp.dest(`${paths.dist}/bin`))

export const build = gulp.series(
  clean,
  buildCjs, 
  buildEsm,
  copyCli
);

/*------ build --------*/


/*------ release --------*/
const changeBranch = (cb) => {
  var release_version = process.env.RELEASE;

  if(!release_version){
    throw new Error("Necessario informar a release.");
    
  }

  execSync(`git checkout -b release/${release_version}`)
  cb();
}

const removeFilesNotNecessaries = () => { 
  return deleteAsync([".vscode", "src", "node_modules", ".gitignore", "gulpfile.js", "package-lock.json", "tsconfig.cjs.json", "tsconfig.esm.json", "tsconfig.json"])  
};

const clear = gulp.series([removeFilesNotNecessaries])

const createTag = (cb) => {
  var release_version = process.env.RELEASE;
  execSync(`git tag v${release_version}`);
  
  cb()
}

const commitReleaseAndPublishe = (cb) => {
  var release = process.env.RELEASE;
  var description = process.env.DESC;

  execSync(`npm version ${release} --no-git-tag-version`, { stdio: "inherit" });
  
  execSync("git add --all", { stdio: "inherit" });
  execSync(`git commit -m "${description}"`, { stdio: "inherit" });
  execSync(`git push origin release/${release}`, { stdio: "inherit" });
  execSync(`git push origin v${release}`, { stdio: "inherit" });
  cb()
}

const changeBranchForDevelopAndStashRelease = (cb) => {
  execSync(`git checkout develop`, { stdio: "inherit" });
  execSync(`git add --all`, { stdio: "inherit" });
  execSync(`git stash`, { stdio: "inherit" });
  cb()
}

export const release = gulp.series(
  build,
  changeBranch,
  clear,
  createTag,
  commitReleaseAndPublishe,
  changeBranchForDevelopAndStashRelease
);

/*------ release --------*/