"use strict";

var gulp = require('gulp'),
  uglify = require('gulp-uglify'),
  jshint = require('gulp-jshint'),
  webserver = require('gulp-webserver');

gulp.task('jshint', function() {
  gulp.src('public/js/**/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('build', ['jshint'], function() {
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
