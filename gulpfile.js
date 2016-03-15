"use strict";

var gulp = require('gulp'),
  uglify = require('gulp-uglify'),
  jshint = require('gulp-jshint'),
  webserver = require('gulp-webserver');

gulp.task('build', function() {
  gulp.src('public/js/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

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

gulp.task('default', ['webserver']);