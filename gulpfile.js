var gulp = require('gulp'),
    babel = require('gulp-babel'),
    scss = require('gulp-sass'),
    browserSync = require('browser-sync'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    cleanCSS = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache'),
    autoprefixer = require('gulp-autoprefixer'),
    notify = require('gulp-notify');

// Пользовательские скрипты проекта

gulp.task('app-js', function() {
  return gulp.src([
    'app/js/app.js',
  ]).
      pipe(babel({
        presets: ['env']
      })).
      pipe(concat('app.min.js')).
      // pipe(uglify()).
      pipe(gulp.dest('app/js'));
});

gulp.task('bootstrap-js', function() {
  return gulp.src([
    'app/libs/popper.js/dist/umd/popper.js',
    'app/libs/bootstrap/js/dist/util.js',
    'app/libs/bootstrap/js/dist/alert.js',
    'app/libs/bootstrap/js/dist/button.js',
    'app/libs/bootstrap/js/dist/carousel.js',
    'app/libs/bootstrap/js/dist/collapse.js',
    'app/libs/bootstrap/js/dist/dropdown.js',
    'app/libs/bootstrap/js/dist/modal.js',
    'app/libs/bootstrap/js/dist/scrollspy.js',
    'app/libs/bootstrap/js/dist/tab.js',
    'app/libs/bootstrap/js/dist/tooltip.js',
    'app/libs/bootstrap/js/dist/popover.js'
  ]).
      pipe(concat('bootstrap.min.js')).
      pipe(gulp.dest('app/js'));
});

gulp.task('js', ['app-js', 'bootstrap-js'], function() {
  return gulp.src([
    // 'app/libs/jquery/dist/jquery.js',
    'app/libs/jquery/dist/jquery.slim.js',
    'app/js/bootstrap.min.js'
  ]).
      pipe(concat('vendor.min.js')).
      // pipe(uglify()).
      pipe(gulp.dest('app/js')).
      pipe(browserSync.reload({stream: true}));
});

gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: 'app'
    },
    notify: false,
    // tunnel: true,
    // tunnel: "projectmane", //Demonstration page: http://projectmane.localtunnel.me
  });
});

gulp.task('scss', function() {
  return gulp.src('app/scss/**/*.scss').
      pipe(scss({outputStyle: 'expand'}).on('error', notify.onError())).
      pipe(rename({suffix: '.min', prefix: ''})).
      pipe(autoprefixer(['last 15 versions'])).
      // pipe(cleanCSS()).
      pipe(gulp.dest('app/css')).
      pipe(browserSync.reload({stream: true}));
});

gulp.task('watch', ['scss', 'js', 'browser-sync'], function() {
  gulp.watch('app/scss/**/*.scss', ['scss']);
  gulp.watch(['libs/**/*.js', 'app/js/app.js'], ['js']);
  gulp.watch('app/*.html', browserSync.reload);
});

gulp.task('imagemin', function() {
  return gulp.src('app/img/**/*').
      // pipe(cache(imagemin())).
      pipe(imagemin()).
      pipe(gulp.dest('dist/img'));
});

gulp.task('build', ['removedist', 'imagemin', 'scss', 'js'], function() {

  var buildFiles = gulp.src([
    'app/*.html',
    'app/.htaccess',
  ]).pipe(gulp.dest('dist'));

  var buildCss = gulp.src([
    'app/css/style.min.css',
  ]).pipe(gulp.dest('dist/css'));

  var buildJs = gulp.src([
    'app/js/app.min.js',
    'app/js/vendor.min.js'
  ]).pipe(gulp.dest('dist/js'));

  var buildFonts = gulp.src([
    'app/fonts/**/*',
  ]).pipe(gulp.dest('dist/fonts'));

});

gulp.task('removedist', function() {
  return del.sync('dist');
});
gulp.task('clearcache', function() {
  return cache.clearAll();
});

gulp.task('default', ['watch']);
