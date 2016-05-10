'use strict';

var gulp = require('gulp'),
	concat = require('gulp-concat'),
	ngAnnotate = require('gulp-ng-annotate'),
	js = require('./config').js;

gulp.task('concat', function() {
  return gulp.src(js.srcToWacth)
    .pipe(concat('main.js'))
    .pipe(ngAnnotate())
    .pipe(gulp.dest(js.destJs));
});