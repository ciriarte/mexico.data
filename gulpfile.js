var gulp       = require("gulp"),
    sourcemaps = require("gulp-sourcemaps"),
    babel      = require("gulp-babel"),
    concat     = require("gulp-concat"),
    mocha      = require('gulp-mocha');

gulp.task("transpile-es6", function () {
    return gulp.src("src/**/*.js")
      .pipe(sourcemaps.init())
      .pipe(concat("all.js"))
      .pipe(babel())
      .pipe(sourcemaps.write("."))
      .pipe(gulp.dest("dist"));
});

gulp.task("mocha", function() {
  return gulp.src('test.js', {read: false})
             .pipe(mocha({reporter: 'nyan'})
});

gulp.task("watch", function() {
  gulp.watch("src/**/*.js",["transpile-es6", "mocha"]);
});

gulp.task("default", ["transpile-es6", "watch"]);
