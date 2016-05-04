'use strict';
module.exports = {
    sass: {
        mainSrc: 'assets/scss/main.scss',
        origin: 'assets/scss',
        destSass: '.tmp/styles',
        srcToWacth: [
            'assets/scss/*',
            'assets/scss/**/*',
        ]
    },
    scripts: {
        src:  [
            'app/app.module.js',
            'app/components/**/*.js',
            'app/shared/directives/**/*.js',
            'app/shared/**/*.js'
        ]
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
    }
};