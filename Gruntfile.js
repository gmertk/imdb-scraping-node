module.exports = function(grunt) {
    grunt.initConfig({
        nodeunit: {
            all: ['test/*_test.js']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-nodeunit');
};