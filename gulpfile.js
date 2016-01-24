var gulp        = require('gulp'),
    less        = require('gulp-less'),
    csslint     = require('gulp-csslint'),
    //minifyCSS   = require('gulp-minify-css'),
    jshint      = require('gulp-jshint'),
    gutil       = require('gulp-util'),
    path        = require('path');

var scriptPaths = './web/assets/js/**/*.js' ;


var files = {
    scripts: './web/assets/js',
    css: './web/assets/css'
}


/*************************************************
 * LESS task
 *************************************************/
gulp.task('less', function () {
    return gulp.src('./bin/less/compiler/hellomonkees.less')
        .pipe(less())
        //.pipe(minifyCSS('/.plop.css'))
        .pipe(gulp.dest('./web/assets/css'));
});


/*************************************************
 * MINIFIY task
 *************************************************/

/*************************************************
 * CSS task
 *************************************************/

gulp.task('cssLint',function(){
    return gulp.src('./web/assets/css/**/*.css')
        .pipe(csslint())
        .pipe(csslint.reporter());
});

/*************************************************
 * JSHINT task : Correction syntaxique javascript
 *************************************************/

gulp.task('jshint', function() {
    return gulp.src(scriptPaths)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});


/*************************************************
 * WATCH tasks
 *************************************************/gulp.task('watch',  function () {
    gulp.watch('./bin/less/**/*.less', ['less']);
    gulp.watch(scriptPaths, ['jshint']);
});

