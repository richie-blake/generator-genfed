var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    browserify = require('browserify'),
    glob = require('glob'),
    _ = require('underscore'),
    path = require('path'),
    source = require('vinyl-source-stream'),
    browserSync = require('browser-sync').create();

require('gulp-grunt')(gulp);

gulp.task('css', function() {
    return sass('<%= sassPath %>', {style: 'expanded'})
        .pipe(autoprefixer('last 2 version', 'ie 8', 'ie 9'))
        .pipe(gulp.dest('<%= baseAssetPath %>css'))
        .pipe(browserSync.stream())
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest('<%= baseAssetPath %>css'))
        .pipe(browserSync.stream());
});


gulp.task('icon', function() {
    gulp.run('grunt-icon');
});

gulp.task('browser-sync', function() {
    browserSync.init({
        proxy: "<%= developmentUrl %>"
    });
});

gulp.task('browserify', function(done) {

    function bundleJavaScript(srcs) {

        _.each(srcs, function(src) {

            var localName = path.relative('<%= jsPath %>', src),
                bundle = browserify([ './' + src]).bundle();

            bundle.pipe(source(localName))
                    .pipe(gulp.dest(path.join('<%= baseAssetPath %>', "js")))
                    .on('end', function() {
                        done();
                    });
        });
    }

    var srcs = glob.sync(path.join('<%= jsPath %>', '**', '*.js'));

    if (srcs) {
        bundleJavaScript(srcs);
    }

});


gulp.task('js', ['browserify'], function() {});

gulp.task('watch', ['browser-sync'], function() {
    gulp.watch('<%= sassPath %>*.scss', ['css']);
    gulp.watch('<%= jsPath %>*.js', ['js']);
    gulp.watch("<%= webRootPath %>*.html").on('change', browserSync.reload);

});

gulp.task('build', ['js', 'css', 'icon'], function(done) {
    done();
});

gulp.task('default', ['build'], function() {});