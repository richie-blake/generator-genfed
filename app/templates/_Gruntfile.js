'use strict';

module.exports = function(grunt) {

    var pkg = grunt.file.readJSON('package.json');

    grunt.initConfig({

        pkg: pkg,

        clean: {
            pngicons: "<%= baseAssetPath %>css/png",
            build: "build"
        },

        grunticon_pigment: {
            app: {
                files: [{
                    cwd: '<%= svgPath %>',
                    dest: '<%= baseAssetPath %>css'
                }],
                options: {
                    svgFolder: "./",
                    svgColorFolder: "colourise",
                    defaultWidth: "32px",
                    defaultHeight: "32px",
                    tmpDir: "build",
                    previewTemplate: "<%= svgPath %>template/preview.html",
                    svgColors: [
                    ],
                    customselectors: {
                    }
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
        "clean:pngicons",
        "grunticon_pigment:app",
        "clean:build"
    ]);

};