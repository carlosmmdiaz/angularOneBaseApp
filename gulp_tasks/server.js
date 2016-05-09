'use strict';

var gulp   = require('gulp'),
    serverHtml = require('./express_mocks/http.js');

gulp.task('express', function ( ) {
    serverHtml();
});