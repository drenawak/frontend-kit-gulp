var gulp        = require('gulp'),
    plumber     = require('gulp-plumber'),
    gutil       = require('gulp-util'),
    rename      = require('gulp-rename'),
    path        = require('path'),
    livereload  = require('gulp-livereload'),

    // STYLES

    less        = require('gulp-less'),
    csslint     = require('gulp-csslint'),
    cssmin      = require('gulp-cssmin'),

    // JS
    jshint      = require('gulp-jshint'),
    concat      = require('gulp-concat'),
    sourcemaps  = require('gulp-sourcemaps');


var scriptPaths = './web/assets/js/**/*.js' ;
var projectSettings = {
    jshint: {
        input: ['./web/assets/js']
    },
    cssMin: {
        input: ['./web/assets/css/**/*.css', '!./web/assets/css/**/*.min.css'],
        output: './web/assets/css'
    },
    less: {
        input: ['./bin/less/compiler/app.less'],
        output: './web/assets/css'
    },
    concatjs:{
        custom: {
            input: ['./web/assets/js/*.js'],
            output: './web/assets/js'
        }

    },
    cssLint:{
        input: ['./web/assets/css/**/*.css']
    }
};

/*************************************************
 * LESS task
 *************************************************/
gulp.task('styles', function () {
    return gulp.src(projectSettings.less.input)
        .pipe(sourcemaps.init())
        .pipe(less({compress:true}))
        .pipe(sourcemaps.write('../../srcmaps'))
        .pipe(gulp.dest(projectSettings.less.output));
});


/*************************************************
 * CSSLint task
 *************************************************/
var customReporter = function(file) {
    gutil.log(gutil.colors.cyan(file.csslint.errorCount)+' errors in '+gutil.colors.magenta(file.path));

    file.csslint.results.forEach(function(result) {
        gutil.log(result.error.message+' on line '+result.error.line);
    });
};
gulp.task('cssLint',function(){
    return gulp.src(projectSettings.cssLint.input)
        .pipe(plumber())
        .pipe(csslint())
        .pipe(csslint.reporter(customReporter));
});

/*************************************************
 * MINIFIY CSS task
 *************************************************/
gulp.task('cssmin', function () {
    return gulp.src(projectSettings.cssMin.input)
        .pipe(plumber())
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(projectSettings.cssMin.output));
});


/*************************************************
 * JSHINT task : Correction syntaxique javascript
 *************************************************/

gulp.task('jshint', function() {
    return gulp.src(projectSettings.jshint.input)
        .pipe(plumber())
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});


/*************************************************
 * CONCAT JS task
 *************************************************/
gulp.task('jsconcat', function() {
    return gulp.src(projectSettings.concatjs.custom.input)
        .pipe(sourcemaps.init())
        .pipe(concat('../js/app.js'))
        .pipe(sourcemaps.write('../../srcmaps'))
        .pipe(gulp.dest(projectSettings.concatjs.custom.output));
});

/*************************************************
 * WATCH tasks
 *************************************************/

gulp.task('watch',  function () {
    var onChange = function (event) {
        console.log('File '+event.path+' has been '+event.type);
        livereload.changed();
    };

    livereload.listen();

    gulp.watch('./bin/less/**/*.less', ['styles'])
        .on('change', onChange);
    gulp.watch(scriptPaths, ['jshint'])
        .on('change', onChange);
});
