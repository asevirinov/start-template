var gulp = require('gulp'),
    gutil = require('gulp-util'),
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
    notify = require('gulp-notify'),
    ftp = require('vinyl-ftp'),
    gulpif = require('gulp-if'),
    sourcemaps = require('gulp-sourcemaps');

var production = false; // если true, JS и CSS будут сжаты

// Сборка app JS
gulp.task('app-js', function() {
  return gulp.src([
    'app/js/app.js', // за каким файлом следить
  ]).
      pipe(sourcemaps.init()).// инициализация sourcemap
      pipe(babel({
        presets: ['env'] // компиляция в ES5
      })).
      pipe(concat('app.min.js')).// название выходного файла
      pipe(gulpif(production, uglify())).// сжатие по условию
      pipe(sourcemaps.write('/')).// создание sourcemap
      pipe(gulp.dest('app/js')); // куда положить файл
});

// Сборка bootstrap JS
gulp.task('bootstrap-js', function() {
  return gulp.src([ // закомментировать что не нужно
    'app/libs/popper.js/dist/umd/popper.js', // всегда вверху! (обязателен для tooltip.js и popover.js)
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
      pipe(concat('bootstrap.min.js')).// имя выходного файла
      pipe(gulp.dest('app/libs/bootstrap/js')); // куда положить файл
});

// Сборка vendor JS
gulp.task('js', ['app-js', 'bootstrap-js'], function() {
  return gulp.src([
    'app/libs/jquery/dist/jquery.js', // полная версия jQuery
    // 'app/libs/jquery/dist/jquery.slim.js', // легкая версия jQuery (без ajax)
    'app/libs/bootstrap/js/bootstrap.min.js'
  ]).
      pipe(sourcemaps.init()).// инициализация sourcemap
      pipe(concat('vendor.min.js')).// название выходного файла
      pipe(gulpif(production, uglify())).// сжатие по условию
      pipe(sourcemaps.write('/')).// создание sourcemap
      pipe(gulp.dest('app/js')).// куда положить файл
      pipe(browserSync.reload({stream: true})); // перезагрузить браузер после изменения содержимого файлов
});

// автообновление браузера
gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: 'app' // каталог отслеживания
    },
    notify: false, // отключить уведомления
    // tunnel: true,
    // tunnel: "projectmane", //Demonstration page: http://projectmane.localtunnel.me
  });
});

// Сборка CSS
gulp.task('scss', function() {
  return gulp.src('app/scss/**/*.scss').
      // за какими файлами сделить?
      pipe(scss({outputStyle: 'expand'}).on('error', notify.onError())).
      // сообщать в терминале об ошибках
      pipe(sourcemaps.init()).
      // инициализация sourcemap
      pipe(rename({suffix: '.min', prefix: ''})).
      // переименовывание файла
      pipe(autoprefixer(['last 15 versions'])).
      // версия автопрефиксов
      pipe(gulpif(production, cleanCSS())).
      // сжатие по условию
      pipe(sourcemaps.write('/')).
      // создание sourcemap
      pipe(gulp.dest('app/css')).
      // куда положить файл
      pipe(browserSync.reload({stream: true})); // перезагрузить страницу браузера
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

      var buildFiles = gulp.src([
        'app/*.html',
        'app/.htaccess',
      ]).pipe(gulp.dest('dist'));

      var buildCss = gulp.src([
        'app/css/*.min.*',
      ]).pipe(gulp.dest('dist/css'));

      var buildJs = gulp.src([
        'app/js/*.min.*'
      ]).pipe(gulp.dest('dist/js'));

      var buildFonts = gulp.src([
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
  var conn = ftp.create({
    host: '', // хост
    user: '', // логин
    password: '', // пароль
    parallel: 10, // кол-во одновременных закачек
    log: gutil.log // название файла логов
  });
  // массив файлов для закачки
  var globs = [
    'dist/**',
    'dist/.htaccess',
  ];
  return gulp.src(globs, {buffer: false}).
      pipe(conn.dest('/www/')); // путь на сервере, куда загрудать файлы
});

gulp.task('default', ['watch']);