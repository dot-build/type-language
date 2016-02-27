/* jshint node: true */
'use strict';

module.exports = function(config) {
    config.set({
        autoWatch: true,

        browsers: ['PhantomJS'],
        frameworks: ['jasmine'],
        reporters: ['dots', 'coverage'],

        files: [
            require.resolve('babel-polyfill/browser.js'),
            require.resolve('jsbn'),
            'dist/type-language.js',
            'test/**/*.spec.js'
        ],

        preprocessors: {
            'dist/type-language.js': ['coverage'],
            'test/**/*.js': ['babel']
        },

        coverageReporter: {
            dir: 'coverage/',
            reporters: [
                { type: 'html' },
                // { type: 'text-summary' }
            ]
        },
    });
};
