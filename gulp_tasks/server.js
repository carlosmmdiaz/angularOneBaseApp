'use strict';

var gulp   = require('gulp'),
    serverHtml = require('../express_mocks/http.js');

gulp.task('serv', function ( ) {
    serverHtml();
});

gulp.task('serv:epd', function ( ) {
    serverHtml('epd');
});