var mkdirp = require('mkdirp');
var generators = require('yeoman-generator');

module.exports = generators.Base.extend({

    constructor: function() {

        // Call the parent constructor
        generators.Base.apply(this, arguments);

        // Any custom code here.

    },

    pathFrontEnd: 'frontend/',

    pathSass: 'frontend/sass/',

    pathJs: 'frontend/js/',

    pathSvg: 'frontend/svg/',

    askQuestions: function() {

        var complete = this.async(),

            prompts = [
                {
                    type: 'input',
                    name: 'webRoot',
                    message: 'What is the path to your web root folder?',
                    default: 'public',
                    store: true
                },
                {
                    type: 'input',
                    name: 'siteName',
                    message: 'What do you want to call your site?',
                    default: 'website'
                },
                {
                    type: 'input',
                    name: 'baseAssetPath',
                    message: 'What is the base path for your assets folder?',
                    default: 'assets',
                    store: true
                },
                {
                    type: 'input',
                    name: 'analyticsId',
                    message: 'Do you know what the Google Analytics ID is?',
                    default: ''
                }
            ];


        this.prompt(prompts, function(answers) {

            this.webRoot = this._checkTrailingSlash(answers.webRoot);
            this.baseAssetPath = this._checkTrailingSlash(answers.baseAssetPath);

            this.siteName = answers.siteName;
            this.analyticsId = answers.analyticsId;

            complete();

        }.bind(this));

    },

    _checkTrailingSlash: function(path) {

        if(path !== '' && path.substr(-1) !== '/') {
            return path + "/";
        }

        return path;

    },

    copyFiles: function() {

        this.fs.copyTpl(
            this.templatePath('index.html'),
            this.destinationPath(this.webRoot + 'index.html'),
            {
                siteName: this.siteName,
                analyticsId: this.analyticsId
            }
        );

        this.fs.copyTpl(
            this.templatePath('_package.json'),
            this.destinationPath('package.json'),
            {
                siteName: this.siteName.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
            }
        );

        this.fs.copyTpl(
            this.templatePath('_gulpfile.js'),
            this.destinationPath('gulpfile.js'),
            {
                baseAssetPath: this.baseAssetPath,
                sassPath: this.pathSass,
                jsPath: this.pathJs
            }
        );

        this.fs.copyTpl(
            this.templatePath('site.scss'),
            this.destinationPath(this.pathSass + 'site.scss')
        );

        this.fs.copyTpl(
            this.templatePath('site.js'),
            this.destinationPath(this.pathJs + 'site.js')
        );

        this.fs.copyTpl(
            this.templatePath('_.gitignore'),
            this.destinationPath('.gitignore'),
            {
                baseAssetPath: this.baseAssetPath
            }
        );

        this.fs.copyTpl(
            this.templatePath('_Gruntfile.js'),
            this.destinationPath('Gruntfile.js'),
            {
                svgPath: this.pathSvg,
                baseAssetPath: this.baseAssetPath
            }
        );

        this.fs.copyTpl(
            this.templatePath('_README.md'),
            this.destinationPath('README.md')
        );

    },

    makeDirectories: function() {

        mkdirp(this.destinationPath(this.pathFrontEnd));
        mkdirp(this.destinationPath(this.pathSass + 'modules/'));
        mkdirp(this.destinationPath(this.pathJs));
        mkdirp(this.destinationPath(this.pathJs + 'lib'));
        mkdirp(this.destinationPath(this.pathSvg));
        mkdirp(this.destinationPath(this.baseAssetPath + 'css/'));
        mkdirp(this.destinationPath(this.baseAssetPath + 'images/'));
        mkdirp(this.destinationPath(this.baseAssetPath + 'js/'));

    },

    installDependencies: function() {
        this.npmInstall([
            'gulp',
            'gulp-grunt',
            'gulp-autoprefixer',
            'gulp-minify-css',
            'gulp-rename',
            'gulp-ruby-sass',
            'normalize.css',
            'gulp-livereload',
            'browserify',
            'underscore',
            'glob',
            'path',
            'vinyl-source-stream',
            'grunt-grunticon-pigment'
        ], {
            'saveDev': true
        });
    }


});

