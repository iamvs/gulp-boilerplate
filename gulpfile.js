var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin');
var sass = require('gulp-sass');
var minifyCSS = require('gulp-csso');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var del = require('del');
var jsmin = require('gulp-jsmin');
var rename = require("gulp-rename");
var browserSync = require('browser-sync').create();

function clean() {
    return del([ 'dist' ]);
}

function compileHTML() {
  return gulp.src('src/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('dest'))
};

function compileCSS() {
  return gulp.src('src/scss/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
    }))    
    .pipe(minifyCSS())
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('dest/css'))
};

function compileJS() {
  return gulp.src([
        'node_modules/jquery/dist/jquery.js',
        //'node_modules/bootstrap/js/dist/util.js',
        //'node_modules/bootstrap/js/dist/modal.js',
        'src/js/*.js'
    ])
    .pipe(sourcemaps.init())
    .pipe(concat('script.min.js'))
    .pipe(sourcemaps.write())
    .pipe(jsmin())
    .pipe(gulp.dest('dest/js'))
};

gulp.task('watch', function() {      
    gulp.watch('src/*.html', gulp.series(compileHTML));
    gulp.watch('src/scss/*.scss', gulp.series(compileCSS));
    gulp.watch('src/js/*.js', gulp.series(compileJS));   
});

var build = gulp.series(clean, gulp.parallel(compileHTML, compileCSS, compileJS));

gulp.task('default', build);
