import gulp from "gulp";
import ts from "gulp-typescript";
import { deleteAsync } from "del";

const paths = {
  src: "src/**/*.ts",
  cli: "src/bin/**/*",
  dist: "lib",
};

const tsCjs = ts.createProject("tsconfig.cjs.json");
const tsEsm = ts.createProject("tsconfig.esm.json");

export const clean = () => deleteAsync(["lib"]);;

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

export default build;
