/**
 * Created by Simon Marcoux on 2016-10-20.
 */
// Look into node_modules
var gulp = require('gulp');
// Require gulp-sass plugin
var sass = require('gulp-sass');
// Require browsersync
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
// var babel  = require('gulp-babel');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');
var autoprefixer = require('run-sequence');



// Basic gulp task syntax
// gulp.task('task-name', function () {
//     // stuff here
// });
// gulp.task('task-name', function () {
//     return gulp.src('source-files') // Get source files with gulp.src
//         .pipe(aGulpPlugin()) // Sends it through a gulp plugin
//         .pipe(gulp.dest('destination')) // Outputs the file in the destination folder
// })

gulp.task('hello', function () {
    console.log('hello dear!');
});

gulp.task('sass', function () {
    // return gulp.src('app/scss/**/*.scss') // Gets all files ending with .scss in app/scss
    return gulp.src('app/scss/styles.scss') // Gets all files ending with .scss in app/scss
        .pipe(sass()) // using gulp-sass
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('watch', ['browserSync', 'sass'], function () {
    gulp.watch('app/scss/**/*.scss', ['sass']);
    // gulp.watch('app/scss/styles.scss', ['sass']);
    // Reloads the browser whenever HTML or JS files change
    gulp.watch('app/*.html', browserSync.reload());
    gulp.watch('app/js/**/*.js', browserSync.reload());
});

gulp.task('browserSync', function () {
    browserSync.init({
        server: {
            baseDir: 'app'
        },
    });
});

// build files
gulp.task('useref', function () {
    return gulp.src('app/*.html')
        .pipe(useref())
        // .pipe(babel({presets: ['es2015']}))
        // Minifies only if it's a JavaScript file
        // .pipe(gulpIf('*.js', uglify().on('error', function(e){
        //     console.log(e);
        // })))
        // Minifies only if it's a CSS file
        .pipe(gulpIf('*.css', cssnano()))
        .pipe(gulp.dest('dist'));
});

gulp.task('images', function () {
    return gulp.src('app/images/**/*.+(png|jpg|gif|svg)')
        // Caching images that ran through imagemin
        .pipe(cache(imagemin({
            interlaced: true
        })))
        .pipe(gulp.dest('dist/images'))
})

// Transfer fonts to dist folder
gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'))
})

// Delete dist folder with gulp clean:dist except cached images
gulp.task('clean:dist', function() {
    return del.sync('dist');
});
// Delete cached images
gulp.task('cache:clear', function (callback) {
    return cache.clearAll(callback);
});

gulp.task('prod', function(callback) {
    runSequence('clean:dist', ['sass', 'useref', 'images', 'fonts'], callback)
});

gulp.task('default', function (callback) {
  runSequence(['sass','browserSync', 'watch'],
    callback
  )
});

gulp.task('autoprefixer', function() {
    gulp.src('app/css/styles.css')
        .pipe(autoprefixer({
            browsers: ['IE10'],
            cascade: false
        }))
        .pipe(gulp.dest('app/css'))
});
