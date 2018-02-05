const browserSync = require('browser-sync'),
    cssSort = require('css-declaration-sorter'),
    del = require('del'),
    gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    babel = require('gulp-babel'),
    cache = require('gulp-cache'),
    cleanCSS = require('gulp-clean-css'),
    concat = require('gulp-concat'),
    gulpif = require('gulp-if'),
    imagemin = require('gulp-imagemin'),
    notify = require('gulp-notify'),
    postCss = require('gulp-postcss'),
    rename = require('gulp-rename'),
    scss = require('gulp-sass'),
    uglify = require('gulp-uglify'),
    gutil = require('gulp-util'),
    ftp = require('vinyl-ftp');

const devMode = true;

gulp.task('app-js', () => {
  return gulp.src(['app/js/app.js']).
      pipe(babel({
        presets: ['env']
      })).
      pipe(concat('app.min.js')).
      pipe(gulpif(!devMode, uglify())).
      pipe(gulp.dest('app/js'));
});

gulp.task('bootstrap-js', () => {
  return gulp.src([
    // popper.js only top!
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
      pipe(concat('bootstrap.js')).
      pipe(gulp.dest('app/libs/bootstrap/js'));
});

gulp.task('inputmask-js', () => {
  return gulp.src([
    'app/libs/inputmask/dist/inputmask/inputmask.js',
    'app/libs/inputmask/dist/inputmask/inputmask.extensions.js',
    'app/libs/inputmask/dist/inputmask/inputmask.numeric.extensions.js',
    'app/libs/inputmask/dist/inputmask/inputmask.date.extensions.js',
    'app/libs/inputmask/dist/inputmask/inputmask.phone.extensions.js',
    'app/libs/inputmask/dist/inputmask/jquery.inputmask.js',
    'app/libs/inputmask/dist/inputmask/phone-codes/phone.js',
    'app/libs/inputmask/dist/inputmask/phone-codes/phone-be.js',
    'app/libs/inputmask/dist/inputmask/phone-codes/phone-nl.js',
    'app/libs/inputmask/dist/inputmask/phone-codes/phone-uk.js',
    'app/libs/inputmask/dist/inputmask/phone-codes/phone-ru.js'
  ]).
      pipe(concat('inputmask.js')).
      pipe(gulp.dest('app/libs/inputmask/dist'));
});

gulp.task('js', ['app-js', 'bootstrap-js', 'inputmask-js'], () => {
  return gulp.src([
    'app/libs/jquery/dist/jquery.js',
    // 'app/libs/jquery/dist/jquery.slim.js',
    'app/libs/bootstrap/js/bootstrap.js',
    'app/libs/inputmask/dist/inputmask.js'
  ]).
      pipe(concat('vendor.min.js')).
      pipe(gulpif(!devMode, uglify())).
      pipe(gulp.dest('app/js')).
      pipe(browserSync.reload({stream: true}));
});

gulp.task('browser-sync', () => {
  browserSync({
    server: {
      baseDir: 'app'
    },
    notify: false
  });
});

gulp.task('scss', () => {
  return gulp.src('app/scss/**/*.scss').
      pipe(scss({outputStyle: 'expand'}).on('error', notify.onError())).
      pipe(rename({suffix: '.min', prefix: ''})).
      pipe(autoprefixer(['last 15 versions'])).
      pipe(postCss([cssSort({order: 'smacss'})])).
      pipe(gulpif(!devMode, cleanCSS())).
      pipe(gulp.dest('app/css')).
      pipe(browserSync.reload({stream: true}));
});

gulp.task('watch', ['scss', 'js', 'browser-sync'], () => {
  gulp.watch([
    'app/scss/**/*.scss',
    'app/libs/bootstrap/scss/**/*.scss'
  ], ['scss']);
  gulp.watch(['libs/**/*.js', 'app/js/app.js'], ['js']);
  gulp.watch('app/*.html', browserSync.reload);
});

gulp.task('imagemin', () => {
  return gulp.src('app/img/**/*').
      pipe(imagemin()).
      pipe(gulp.dest('dist/img'));
});

gulp.task('rename-htaccess', () => {
  return gulp.src('app/htaccess.txt').
      pipe(
          rename({suffix: '', prefix: '.', basename: 'htaccess', extname: ''})).
      pipe(gulp.dest('dist'));
});

gulp.task('build', ['rename-htaccess', 'removedist', 'imagemin', 'scss', 'js'],
    () => {
      let buildFiles = gulp.src([
        'app/*.html',
        'app/.htaccess'
      ]).pipe(gulp.dest('dist'));

      let buildCss = gulp.src([
        'app/css/*.*'
      ]).pipe(gulp.dest('dist/css'));

      let buildJs = gulp.src([
        'app/js/*.*'
      ]).pipe(gulp.dest('dist/js'));

      let buildFonts = gulp.src([
        'app/fonts/**/*'
      ]).pipe(gulp.dest('dist/fonts'));
    });

gulp.task('removedist', () => {
  return del.sync('dist');
});

gulp.task('clearcache', () => {
  return cache.clearAll();
});

gulp.task('deploy', () => {
  let conn = ftp.create({
    host: '',
    user: '',
    password: '',
    parallel: 10,
    log: gutil.log
  });

  let globs = [
    'dist/**',
    'dist/.htaccess'
  ];
  return gulp.src(globs, {buffer: false}).
      pipe(conn.dest('/www/'));
});

gulp.task('default', ['watch']);