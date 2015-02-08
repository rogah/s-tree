var gulp = require('gulp'),
  jshint = require('gulp-jshint'),
  beautify = require('gulp-jsbeautifier');

gulp.task('default', ['lint', 'beautify:lib', 'beautify:test']);

// lint all js source files
gulp.task('lint', function () {
  return gulp.src('./lib/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

// beautify all js files
gulp.task('beautify:lib', ['lint'], function () {
  return gulp.src('./lib/**/*.js')
    .pipe(beautify({
      config: '.jsbeautifyrc',
      mode: 'VERIFY_AND_WRITE'
    }))
    .pipe(gulp.dest('./lib/'));
});

gulp.task('beautify:test', ['lint'], function () {
  return gulp.src('./test/**/*.js')
    .pipe(beautify({
      config: '.jsbeautifyrc',
      mode: 'VERIFY_AND_WRITE'
    }))
    .pipe(gulp.dest('./test/'));
});
