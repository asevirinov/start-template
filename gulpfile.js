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
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    gutil = require('gulp-util'),
    ftp = require('vinyl-ftp');

// если false, JS и CSS будут сжаты
const devMode = true;

// Сборка app JS
gulp.task('app-js', function() {
  // за каким файлом следить
  return gulp.src(['app/js/app.js']).
      // инициализация sourcemap
      pipe(sourcemaps.init()).
      // компиляция в ES5
      pipe(babel({
        presets: ['env']
      })).
      // название выходного файла
      pipe(concat('app.min.js')).
      // сжатие по условию
      pipe(gulpif(!devMode, uglify())).
      // создание sourcemap
      pipe(sourcemaps.write('/')).
      // куда положить файл
      pipe(gulp.dest('app/js'));
});

// Сборка bootstrap JS
gulp.task('bootstrap-js', function() {
  // закомментировать что не нужно
  return gulp.src([
    // popper.js всегда вверху! (обязателен для tooltip.js и popover.js)
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
      // имя выходного файла
      pipe(concat('bootstrap.min.js')).
      // куда положить файл
      pipe(gulp.dest('app/libs/bootstrap/js'));
});

// Сборка vendor JS
gulp.task('js', ['app-js', 'bootstrap-js'], function() {
  return gulp.src([
    'app/libs/jquery/dist/jquery.js', // полная версия jQuery
    // 'app/libs/jquery/dist/jquery.slim.js', // легкая версия jQuery (без ajax)
    'app/libs/bootstrap/js/bootstrap.min.js'
  ]).
      // инициализация sourcemap
      pipe(sourcemaps.init()).
      // название выходного файла
      pipe(concat('vendor.min.js')).
      // сжатие по условию
      pipe(gulpif(!devMode, uglify())).
      // создание sourcemap
      pipe(sourcemaps.write('/')).
      // куда положить файл
      pipe(gulp.dest('app/js')).
      // перезагрузить браузер после изменения содержимого файлов
      pipe(browserSync.reload({stream: true}));
});

// автообновление браузера
gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: 'app' // каталог отслеживания
    },
    notify: false // отключить уведомления
  });
});

// Сборка CSS
gulp.task('scss', function() {
  // за какими файлами сделить?
  return gulp.src('app/scss/**/*.scss').
      // сообщать в терминале об ошибках
      pipe(scss({outputStyle: 'expand'}).on('error', notify.onError())).
      // инициализация sourcemap
      pipe(sourcemaps.init()).
      // переименовывание файла
      pipe(rename({suffix: '.min', prefix: ''})).
      // версия автопрефиксов
      pipe(autoprefixer(['last 15 versions'])).
      pipe(postCss([cssSort({order: 'smacss'})])).
      // сжатие по условию
      pipe(gulpif(!devMode, cleanCSS())).
      // создание sourcemap
      pipe(sourcemaps.write('/')).
      // куда положить файл
      pipe(gulp.dest('app/css')).
      // перезагрузить страницу браузера
      pipe(browserSync.reload({stream: true}));
});

// метод сдележения за файлами
gulp.task('watch', ['scss', 'js', 'browser-sync'], function() {
  gulp.watch([
    'app/scss/**/*.scss',
    'app/libs/bootstrap/scss/**/*.scss'
  ], ['scss']);
  gulp.watch(['libs/**/*.js', 'app/js/app.js'], ['js']);
  gulp.watch('app/*.html', browserSync.reload);
});

// сжатие изображений
gulp.task('imagemin', function() {
  return gulp.src('app/img/**/*').
      pipe(cache(imagemin())).
      pipe(imagemin()).
      pipe(gulp.dest('dist/img'));
});

// переименовывание htaccess
gulp.task('rename-htaccess', function() {
  return gulp.src('app/htaccess.txt').
      pipe(
          rename({suffix: '', prefix: '.', basename: 'htaccess', extname: ''})).
      pipe(gulp.dest('dist'));
});

// сборка проекта
gulp.task('build', ['rename-htaccess', 'removedist', 'imagemin', 'scss', 'js'],
    function() {

      let buildFiles = gulp.src([
        'app/*.html',
        'app/.htaccess',
      ]).pipe(gulp.dest('dist'));

      let buildCss = gulp.src([
        'app/css/*.min.*',
      ]).pipe(gulp.dest('dist/css'));

      let buildJs = gulp.src([
        'app/js/*.min.*'
      ]).pipe(gulp.dest('dist/js'));

      let buildFonts = gulp.src([
        'app/fonts/**/*',
      ]).pipe(gulp.dest('dist/fonts'));

    });

// удаление папки dist
gulp.task('removedist', function() {
  return del.sync('dist');
});

// очистка кеша
gulp.task('clearcache', function() {
  return cache.clearAll();
});

// отправка файлов по FTP
gulp.task('deploy', function() {
  let conn = ftp.create({
    host: '', // хост
    user: '', // логин
    password: '', // пароль
    parallel: 10, // кол-во одновременных закачек
    log: gutil.log // название файла логов
  });
  // массив файлов для закачки
  let globs = [
    'dist/**',
    'dist/.htaccess',
  ];
  return gulp.src(globs, {buffer: false}).
      pipe(conn.dest('/www/')); // путь на сервере, куда загрудать файлы
});

gulp.task('default', ['watch']);