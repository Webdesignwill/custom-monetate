"use strict";

var gulp = require('gulp'),
  uglify = require('gulp-uglify'),
  jshint = require('gulp-jshint'),
  webserver = require('gulp-webserver'),
  cssmin = require('gulp-cssmin');

gulp.task('jsmin', function() {
  gulp.src('public/js/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

gulp.task('cssmin', function () {
  gulp.src('public/css/main.css').pipe(cssmin()).pipe(gulp.dest('dist/css'));
});

// gulp.task('move-libs', function () {
//   return gulp.src('src/js/libs/*.js')
//     .pipe(gulp.dest('dist/js'));
// });

gulp.task('webserver', function() {
  gulp.src('public').pipe(webserver({
    port: 8080,
    livereload: false,
    directoryListing: {
      enable: false,
      path: 'public'
    },
    open: false
  }));
});

gulp.task('build', ['jsmin', 'cssmin']);
gulp.task('default', ['webserver']);