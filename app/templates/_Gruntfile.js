'use strict';

module.exports = function(grunt) {

    var pkg = grunt.file.readJSON('package.json');

    grunt.initConfig({

        pkg: pkg,

        grunticon: {
            app: {
                files: [{
                    expand: true,
                    cwd: '<%= svgPath %>',
                    dest: '<%= baseAssetPath %>icons/',
                    src: ['*.svg', '*.png']
                }],
                options: {
                }
            }
        }

    });


    /**
     * The cool way to load your grunt tasks
     * --------------------------------------------------------------------
     */
    Object.keys( pkg.devDependencies ).forEach( function( dep ){
        if( dep.substring( 0, 6 ) === 'grunt-' ) grunt.loadNpmTasks( dep );
    });


    grunt.registerTask("icon", [
        "grunticon:app",
    ]);

};