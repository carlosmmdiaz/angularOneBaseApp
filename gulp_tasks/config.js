'use strict';
module.exports = {
    clean: {
        dest: '.tmp'
    },
    sass: {
        mainSrc: 'assets/scss/main.scss',
        origin: 'assets/scss',        
        srcToWacth: [
            'assets/scss/*',
            'assets/scss/**/*',
        ],
        destSass: '.tmp/css',
    },
    jade: {
        src:  [
            'app/index.jade',
            'app/components/**/*.jade',
            'app/shared/directives/**/*.jade'
        ],
        srcToWacth: [
            'app/index.jade',
            'app/jade/*.jade',
            'app/components/**/*.jade',
            'app/shared/directives/**/*.jade'
        ],
        destJade: '.tmp/'
    },
    js: {
        srcToWacth:  [
            'app/app.module.js',
            'app/components/**/*.js',
            'app/shared/directives/**/*.js',
            'app/shared/**/*.js'
        ],
        destJs: '.tmp/js'
    },
    bower: {
        src: [
            'app/bower_components/angular/angular.min.js'
        ],
        destBower: '.tmp/js'
    }
};