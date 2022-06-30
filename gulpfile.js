const gulp = require('gulp');
const clean = require('gulp-clean');
const rename = require('gulp-rename');
const webpack = require('webpack-stream');
const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync').create();
const {
  exec
} = require('child_process');

const webpackConfig = require('./webpack.config.js');

// Removes previous dist
gulp.task('start', () => {
  return gulp.src('./dist', {
      allowEmpty: true
    })
    .pipe(clean());
});

// Creates js bundle from several js files
gulp.task('build', () => {
  return webpack(webpackConfig)
    .pipe(gulp.dest('./dist'))
});

// Converts scss to css
gulp.task('scss', () => {
  return gulp.src('./src/css/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./dist/css/'));
});

// Transfers index
gulp.task('index', () => {
  return gulp.src(['./src/index.html', './src/favicon.ico'])
    .pipe(gulp.dest('./dist'));
});

// Transfers index
gulp.task('img', () => {
  return gulp.src(['./src/img/**/*'])
    .pipe(gulp.dest('./dist/img'));
});

// Browser Sync
gulp.task('browser-sync', () => {
  browserSync.init({
    browser: 'default',
    port: 4000,
    server: {
      baseDir: './dist'
    }
  });
});

// Browser Sync live reload
gulp.task('browser-sync-watch', () => {
  gulp.watch('./dist/css/*.css').on('change', browserSync.reload);
  gulp.watch('./dist/app.js').on('change', browserSync.reload);
  gulp.watch('./dist/*.html').on('change', browserSync.reload);
});

// Watch scss files
gulp.task('watch-scss', () => {
  return gulp.watch('./src/css/**/*.scss', gulp.series('scss'));
});

// Watch html files
gulp.task('watch-html', () => {
  return gulp.watch('./src/*.html', gulp.series('index'));
});

// Watch html files
gulp.task('watch-img', () => {
  return gulp.watch('./src/img/**/*', gulp.series('img'));
});

// Watch tsc files
gulp.task('watch-tsc', () => {
  return gulp.watch('./dist/js/**/*.js', gulp.series('build'));
});

// Initial ts compile
gulp.task('tsc', cb => {
  exec('tsc', (err, msg) => {
    cb();
  });
});

// Watch ts files and recompile
gulp.task('tsc-w', () => {
  exec('tsc -w');
});

// Run all together
gulp.task('default', gulp.series(
  'start',
  'scss',
  'index',
  'img',
  'tsc',
  'build',
  gulp.parallel(
    'browser-sync',
    'browser-sync-watch',
    'watch-scss',
    'watch-html',
    'watch-img',
    'watch-tsc',
    'tsc-w',
  ),
));