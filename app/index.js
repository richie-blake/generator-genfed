var mkdirp = require('mkdirp');
var generators = require('yeoman-generator');
var slug = require('slug');

module.exports = generators.Base.extend({

    constructor: function() {

        // Call the parent constructor
        generators.Base.apply(this, arguments);

        // Any custom code here.
        this.option('silverstripe');

        this.isSilverStripe = (this.options.silverstripe ? true : false);

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
                },
                {
                    type: 'input',
                    name: 'developmentUrl',
                    message: 'What is your development url? e.g. mysite.dev',
                    default: ''
                }
            ];


        this.prompt(prompts, function(answers) {

            this.webRoot = this._checkTrailingSlash(answers.webRoot);
            this.baseAssetPath = this.webRoot + this._checkTrailingSlash(answers.baseAssetPath);

            this.siteName = answers.siteName;
            this.analyticsId = answers.analyticsId;
            this.developmentUrl = answers.developmentUrl;

            this.slug = slug(this.siteName.toLowerCase());

            this.silverStripeThemePath = this.webRoot + 'themes/' + this.slug + '/';


            complete();

        }.bind(this));

    },

    checkSilverStripe : function() {

        var self = this;

        if (this.isSilverStripe) {
            var composer = this.spawnCommand('composer', ['create-project', 'silverstripe/installer', './' + this.webRoot]);
            composer.on('close', function(code) {
                self._runCopyOperations();
            });
        } else {
            self._runCopyOperations();
        }

    },

    _checkTrailingSlash: function(path) {

        if(path !== '' && path.substr(-1) !== '/') {
            return path + "/";
        }

        return path;

    },

    _runCopyOperations: function() {

        this._copyFiles();
        this._makeDirectories();
        this._cleanup();
        this._installDependencies();

    },

    _copyFiles: function() {

        var baseTemplatePath = this.webRoot + 'index.html';

        if (this.isSilverStripe) {

            this.fs.copyTpl(
                this.templatePath('silverstripe-config.yml'),
                this.destinationPath(this.webRoot + 'mysite/_config/config.yml'),
                {
                    siteName: this.slug
                }
            );

            baseTemplatePath = this.silverStripeThemePath + 'templates/Page.ss';

        }

        this.fs.copyTpl(
            this.templatePath('index.html'),
            this.destinationPath(baseTemplatePath),
            {
                analyticsId: this.analyticsId,
                isSilverStripe: this.isSilverStripe,
                siteName: this.siteName
            }
        );

        this.fs.copyTpl(
            this.templatePath('_package.json'),
            this.destinationPath('package.json'),
            {
                siteName: this.slug
            }
        );

        this.fs.copyTpl(
            this.templatePath('_gulpfile.js'),
            this.destinationPath('gulpfile.js'),
            {
                baseAssetPath: this.baseAssetPath,
                sassPath: this.pathSass,
                jsPath: this.pathJs,
                developmentUrl: this.developmentUrl,
                webRootPath: this.webRoot
            }
        );

        this.fs.copyTpl(
            this.templatePath('site.scss'),
            this.destinationPath(this.pathSass + 'site.scss')
        );

        this.fs.copyTpl(
            this.templatePath('_mixins.scss'),
            this.destinationPath(this.pathSass + '_mixins.scss')
        );

        this.fs.copyTpl(
            this.templatePath('_functions.scss'),
            this.destinationPath(this.pathSass + '_functions.scss')
        );

        this.fs.copyTpl(
            this.templatePath('_breakpoints.scss'),
            this.destinationPath(this.pathSass + '_breakpoints.scss')
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
            this.destinationPath('README.md'),
            {
                siteName: this.siteName
            }
        );

    },

    _makeDirectories: function() {

        mkdirp(this.destinationPath(this.pathFrontEnd));
        mkdirp(this.destinationPath(this.pathSass + 'lib/'));
        mkdirp(this.destinationPath(this.pathSass + 'modules/'));
        mkdirp(this.destinationPath(this.pathJs));
        mkdirp(this.destinationPath(this.pathJs + 'lib'));
        mkdirp(this.destinationPath(this.pathSvg));
        mkdirp(this.destinationPath(this.baseAssetPath + 'css/'));
        mkdirp(this.destinationPath(this.baseAssetPath + 'images/'));
        mkdirp(this.destinationPath(this.baseAssetPath + 'js/'));

        if (this.isSilverStripe) {
            mkdirp(this.destinationPath(this.silverStripeThemePath + 'templates/Layout/'));
            mkdirp(this.destinationPath(this.silverStripeThemePath + 'templates/Includes/'));
            mkdirp(this.destinationPath(this.silverStripeThemePath + 'css/'));
        }

    },

    _cleanup: function() {


        if (this.isSilverStripe) {

            this.fs.delete(this.webRoot + 'web.config');
            this.fs.delete(this.webRoot + 'install-frameworkmissing.html');
            this.fs.delete(this.webRoot + 'framework/web.config');

        }

    },

    _installDependencies: function() {
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
            'grunt-grunticon-pigment',
            'browser-sync'
        ], {
            'saveDev': true
        });
    }

});

