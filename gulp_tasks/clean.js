'use strict';
require('./config.js');

var gulp   = require('gulp'),
    del = require('del'),
    clean = require('./config').clean;

gulp.task('clean', function () {
	return del([clean.dest]);
});