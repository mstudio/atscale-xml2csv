/**
 * @Scale XML -> CSV converter
 * 
 */
const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const jshint = require('gulp-jshint');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const order = require('gulp-order');
const autoprefixer = require('gulp-autoprefixer');
const sass = require('gulp-sass');
const fs = require("fs");
const imagemin = require('gulp-imagemin');
var browserSync = require('browser-sync').create();
var rimraf = require('gulp-rimraf');
var notify = require("gulp-notify");
var rollup = require('rollup');
var rollupBabel = require('rollup-plugin-babel');
var htmlmin = require('gulp-htmlmin');


/**
 * Copy html to dist
 */
gulp.task('process:html', () => {
  return gulp.src("./src/**/*.html")
    .pipe(gulp.dest("./"))
    .pipe(browserSync.reload({ stream:true }));
});

/**
 * Copy html to dist and minify
 */
gulp.task('dist:process:html', () => {
  return gulp.src("./src/**/*.html")
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest("./"))
    .pipe(browserSync.reload({ stream:true }));
});



/**
 * Transpile and Bundle JS
 * rollup-plugin-babel
 */
gulp.task('process:js', () => {
  return rollup.rollup({
    entry: "./src/js/main.js",
    plugins: [
      rollupBabel(),
      //rollupUglify() // use for minifiying file
    ],
  })
    .then(function (bundle) {
      bundle.write({
        format: "umd",
        moduleName: "main",
        dest: "./js/main.js",
        sourceMap: true
      });
      browserSync.reload();
    }, function(error){
      gulp.src("./js/main.js")
        .pipe(notify("Error: " + error.message));
    });
});

/**
 * Transpile and Bundle JS
 * rollup-plugin-babel
 */
gulp.task('dist:process:js', () => {
  return rollup.rollup({
    entry: "./src/js/main.js",
    plugins: [
      rollupBabel(),
      //rollupUglify() // use for minifiying file
    ],
  })
    .then(function (bundle) {
      bundle.write({
        format: "umd",
        moduleName: "main",
        dest: "./js/main.js",
        sourceMap: true
      });
      browserSync.reload();
    }, function(error){
      gulp.src("./js/main.js")
        .pipe(notify("Error: " + error.message));
    });
});

/**
 * Concat all vendor JS into single file
 */
gulp.task('process:vendor:js', () => {
    return gulp.src("./src/vendor/js/*")
        .pipe(order([
            "three.min.js",
            "*.js"
          ]))
        .pipe(concat("vendor.js"))
        .pipe(gulp.dest("./js"));
});



/**
 * Compile SCSS
 * Autoprefix properties
 * Display Errors in OS
 * Stream to browsersync
 */
gulp.task('process:scss', function() {
    return gulp.src('src/scss/*.scss')
        .pipe(sass()).on('error', notify.onError(function (error) {
            return 'SCSS Error.\n' + error;
        }))
        .pipe(autoprefixer({
          browsers: ['last 2 versions', 'ie 9']
        }))
        .pipe(gulp.dest('css/'))
        .pipe(browserSync.reload({ stream: true }));
});

/**
 * Same as above but with compressed CSS for production
 */
gulp.task('dist:process:scss', function() {
    return gulp.src('src/scss/*.scss')
        .pipe(sass({outputStyle: 'compressed'})).on('error', notify.onError(function (error) {
            return 'SCSS Error.\n' + error;
        }))
        .pipe(autoprefixer({
          browsers: ['last 2 versions', 'ie 9']
        }))
        .pipe(gulp.dest('css/'))
        .pipe(browserSync.reload({ stream:true }));
});

/**
 * Watch Files For Changes
 */
gulp.task('serve', function() {

    browserSync.init({
      server: {
        baseDir: "./"
      }
    });

    gulp.watch('./src/scss/**/*.scss', ['process:scss']);
    gulp.watch('./src/js/**/*.js', ['process:js']);
    gulp.watch('./src/vendor/js/*.js', ['process:vendor:js']);
    gulp.watch("./src/**/*.html", ['process:html']);
});

/**
 * Default task: process and serve
 */
gulp.task('default', [
    'process:html',
    'process:scss',
    'process:vendor:js',
    'process:js',
    'serve'
]);

/**
 * Production task: process, minify/optimize
 */
gulp.task('dist', [
    'dist:process:html',
    'dist:process:scss',
    'process:vendor:js',
    'dist:process:js',
    'serve'
]);