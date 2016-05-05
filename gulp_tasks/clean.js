'use strict';
require('./config.js');

var gulp   = require('gulp'),
    del = require('del'),
    main = require('./config').main;

gulp.task('clean', function () {
	return del([main.dest]);
});