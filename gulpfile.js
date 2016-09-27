var gulp = require('gulp'),
    gutil = require('gulp-util'),
    notify = require('gulp-notify'),
    gulpif = require('gulp-if'),
    browserify = require('browserify'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    deporder = require('gulp-deporder'),
    source = require('vinyl-source-stream'),
    sourcemaps = require('gulp-sourcemaps'),
    browserSync = require('browser-sync'),
    minifyCss = require('gulp-minify-css'),
    rename = require('gulp-rename');


var sass = require('gulp-sass'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    lost    = require('lost'),
    minifyCss = require('gulp-minify-css');


function errorAlert(error){
    notify.onError({
        title: "Error",
        message: "Check your terminal",
        sound: "Sosumi"})(error);
    console.log(error.toString());
    this.emit("end");
};


var devBuild = ((process.env.NODE_ENV || 'dev').trim().toLowerCase() !== 'prod');

var src = 'src/';
var dest = 'build/';
var phpTemplates = 'inc/critical-css/';


gulp.task('sass', function() {
    return gulp.src(src + "scss/main.scss")
        .pipe(gulpif(devBuild, sourcemaps.init()))
        .pipe(sass({outputStyle: 'nested'}))
        .on('error', errorAlert)
        .pipe(postcss([
              lost(),
              autoprefixer({
                browsers: ['last 2 versions']
            })
        ]))
        .pipe(gulpif(devBuild, sourcemaps.write()))
        .pipe(gulpif(!devBuild, minifyCss()))
        .pipe(gulp.dest(dest + "css"))
        .pipe(browserSync.stream());
});


gulp.task('minify-css', function() {
    if (!devBuild) {
        return gulp.src( dest + 'css/*.css' )
            .pipe(minifyCss({compatibility: 'ie8'}))
            .pipe(gulp.dest(dest + 'css'));
    }
});

/* ABOVE THE FOLD STYLES */
gulp.task('critical-global', function() {
    return gulp.src(src + "scss/above-the-fold/critical-global.scss")
        .pipe(sass({outputStyle: 'nested'}))
        .pipe(postcss([
              autoprefixer({
                browsers: ['last 2 versions']
            })
        ]))
        .pipe(minifyCss())
        .pipe(gulp.dest(dest + "css/above-the-fold/"))
});

gulp.task('inject-critical-global', ['critical-global'], function() {
    gulp.src(dest + "css/above-the-fold/critical-global.css")
        .pipe(rename(phpTemplates + "critical-global.php"))
        .pipe(gulp.dest("./"));
});


gulp.task('scripts', function() {
    return gulp.src([
        '!' + src + 'js/scripts/rigsConservationList.js',
        '!' + src + 'js/scripts/metaList.js',
        // '!' + src + 'js/scripts/eventemitter2.js',
        src + 'js/scripts/*.js'
        ])
        .pipe(gulpif(devBuild, sourcemaps.init()))
        .pipe(deporder())
        .pipe(concat('scripts.js'))
        .pipe(gulpif(devBuild, sourcemaps.write()))
        .pipe(gulpif(!devBuild, uglify()))
        .pipe(gulp.dest(dest + 'js/'));
});


// gulp.task('browserify', function () {
//     return browserify(src + 'js/app/entry', { debug: true})
//         .bundle()
//         .on('error', errorAlert)
//         .pipe(source('bundle.js'))
//         .pipe(gulp.dest(dest + 'js/'));
// });


// gulp.task('combine', ['scripts', 'browserify'], function() {
//     return gulp.src([
//         dest + 'js/scripts.js',
//         dest + 'js/bundle.js'
//     ])
//     .pipe(concat('all.min.js'))
//     .pipe(gulpif(!devBuild, uglify()))
//     .pipe(gulp.dest(dest + 'js/'));
// });



gulp.task('lintjs', function() {
    return gulp.src(src + 'js/app/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});




gulp.task('browser-sync', function() {
    browserSync({
         proxy: "localhost/devon_atlas"
        // server: {
        //     baseDir: "./build"
        // }
    });
});

gulp.task('reload-js', ['lintjs', 'scripts' ], function() {
    browserSync.reload();
});

gulp.task('reload-css', ['sass', 'critical-global'], function() {
    browserSync.reload();
});


gulp.task('watch', ['sass', 'inject-critical-global', 'lintjs', 'scripts', 'browser-sync'], function() {
    gulp.watch(src + 'js/**/*.js', ['reload-js']);
    gulp.watch(src + 'scss/**/*.scss', ['reload-css']);
});


gulp.task('default', ['watch']);

