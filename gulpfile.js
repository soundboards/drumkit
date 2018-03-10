const browserSync = require('browser-sync').create();
const del = require('del');
const path = require('path');
const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const webpackStream = require('webpack-stream');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');
const sourcePath = './src/';

function clean() {
  return del([sourcePath + 'bundle.main.js']);
}

gulp.task('clean', clean);

gulp.task('js', function () {
  return gulp.src(sourcePath + 'main.js')
    .pipe(sourcemaps.init())
    .pipe(webpackStream(webpackConfig))
    .pipe(sourcemaps.write(sourcePath))
    .pipe(gulp.dest(sourcePath))
    .pipe(browserSync.stream());
});

gulp.task('browser-sync', () => {
  browserSync.init({
    port: 3000,
    server: {
      baseDir: "src",
      serveStaticOptions: {
        extensions: ["css", "html", "js"]
      }
    }
  });

  gulp.watch(sourcePath + '**/*.*').on('change', browserSync.reload);
});

gulp.task('watch', () => {
    gulp.watch(sourcePath + 'components/*.js', ['js']);
});

gulp.task('default', ['js', 'watch', 'browser-sync']);
