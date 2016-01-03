//Production Packages
var gulp = require('gulp'),	
    browserSync = require('browser-sync').create();

//Build Packages
var uglify = require('gulp-uglify'),
    nano = require('gulp-cssnano'),
    htmlmin = require('gulp-htmlmin'),
    less = require('gulp-less');
    concat = require('gulp-concat'),
    htmlreplace = require('gulp-html-replace'),

// ==========================
// BROWSER SYNC SERVER
// ==========================
gulp.task('browser-sync', function () {
    var files = [
        'src/*.html',
        'src/css/*.less',
        'src/js/*.js'
    ];

    browserSync.init(files, {
        server: {
            baseDir: './build'
        }
    });
});

// ==========================
// BUILD
// ==========================
gulp.task('build-js', function() {
    gulp.src('./src/js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('./build/js'));
});

gulp.task('build-css', function() {
    gulp.src('./src/css/*.less')
        .pipe(less())
        .pipe(nano())
        .pipe(concat('app.css'))
        .pipe(gulp.dest('./build/css/'));
});

gulp.task('build-html', function() {
    gulp.src("./src/*.html")
        .pipe(htmlreplace({css: 'css/app.css'}))
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest("./build/"));
});

gulp.task('build', ['build-js', 'build-css', 'build-html']);