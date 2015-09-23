var gulp       = require("gulp"),
    sourcemaps = require("gulp-sourcemaps"),
    babel      = require("gulp-babel"),
    concat     = require("gulp-concat"),
    mocha      = require('gulp-mocha'),
    eslint     = require('gulp-eslint');

gulp.task('lint', function () {
    return gulp.src(['src/**/*.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
});

gulp.task("transpile-es6", ['lint'], function () {
    return gulp.src(["src/**/*.js"])
      .pipe(sourcemaps.init())
      .pipe(babel())
      .pipe(sourcemaps.write("."))
      .pipe(gulp.dest("dist"));
});

gulp.task("watch", function() {
  gulp.watch("src/**/*.js",["transpile-es6"]);
});

gulp.task("default", ["transpile-es6", "watch"]);
