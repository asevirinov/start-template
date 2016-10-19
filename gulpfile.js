var gulp				= require('gulp'), // Gulp
	gutil          		= require('gulp-util' ), // Для управления плагинами
	sass           		= require('gulp-sass'), // Для SASS, SCSS файлов
	browserSync    		= require('browser-sync'), // Синхронно обновляет браузер при сохрании файла проекта
	concat         		= require('gulp-concat'), // Для соединения нескольких файлов в один
	uglify         		= require('gulp-uglify'), // Для сжатия JS файлов
	cleanCSS       		= require('gulp-clean-css'), // Для сжатия CSS файлов
	rename         		= require('gulp-rename'), // Позволяет переименовывать файлы
	del            		= require('del'), // Для удаления файлов и каталогов
	htmlmin 			= require('gulp-htmlmin'), // Для сжатия HTML кода
	imagemin       		= require('gulp-imagemin'), // Для сжатия изображений JPG
	pngquant       		= require('imagemin-pngquant'), // Для сжатия изображений PNG
	cache          		= require('gulp-cache'), // Для очистки кеша Gulp
	autoprefixer   		= require('gulp-autoprefixer'), // Для добавления кроссбраузерных префиксов в CSS файлах
	fileinclude    		= require('gulp-file-include'), // Для подключения файлов через @@
	gulpRemoveHtml 		= require('gulp-remove-html'), // Для удаления кода перед продакшеном <!--<Deject>-->КОД<!--</Deject>--> из HTML
	removeHtmlComments 	= require('gulp-remove-html-comments'), // Для удаления комментариев из HTML
	bourbon        		= require('node-bourbon'), // Плагин Bourbon
	ftp            		= require('vinyl-ftp'), // Для деплоя на FTP хостинг скомпилированного сайта
	notify         		= require("gulp-notify"); // Для уведомлений в случае неполадок

// Синхронизация изменений с браузером
gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'app' // Диретория для отслеживания
		},
		notify: false // Отключить уведомления об изменении
	});
});

// Компиляция SASS/SCSS кода в CSS
gulp.task('sass', ['headersass'], function() {
	return gulp.src('app/sass/**/*.scss') // Директория с файлами для компиляции
		.pipe(sass({
			includePaths: bourbon.includePaths // Подключаем Bourbon
		}).on("error", notify.onError())) // Отображаем уведомления в случае ошибок
		.pipe(rename({suffix: '.min', prefix : ''})) // Переименовываем файл
		.pipe(autoprefixer(['last 15 versions'])) // Добавляем префиксы
		.pipe(cleanCSS()) // Сжимаем CSS
		.pipe(gulp.dest('app/css')) // Отправляем в указанную директорию
		.pipe(browserSync.reload({stream: true})) // Говорим браузеру что код изменился
});

// Компиляция SASS/SCSS кода в CSS
gulp.task('headersass', function() {
	return gulp.src('app/header.scss') // Файл для компиляции
		.pipe(sass({
			includePaths: bourbon.includePaths // Подключаем Bourbon
		}).on("error", notify.onError())) // Отображаем уведомления в случае ошибок
		.pipe(rename({suffix: '.min', prefix : ''})) // Переименовываем файл
		.pipe(autoprefixer(['last 15 versions'])) // Добавляем префиксы
		.pipe(cleanCSS()) // Сжимаем CSS
		.pipe(gulp.dest('app')) // Отправляем в указанную директорию
		.pipe(browserSync.reload({stream: true})) // Говорим браузеру что код изменился
});

// Объединение и сжатие JS плагинов
gulp.task('libs', function() {
	return gulp.src([ // Указываем точный путь к файлам через запятую
		'app/libs/jquery/dist/jquery.min.js',
		// 'app/libs/magnific-popup/magnific-popup.min.js'
		])
		.pipe(concat('libs.min.js')) // Объединяем в один файл с указанным названием
		.pipe(uglify()) // Сжимаем весь код
		.pipe(gulp.dest('app/js')); // Отправляем в указанную папку
});

// Комплексная команда для отслеживания изменений
gulp.task('watch', ['sass', 'libs', 'browser-sync'], function() {
	gulp.watch('app/header.scss', ['headersass']); // Отслеживаем файл header.scss
	gulp.watch('app/sass/**/*.scss', ['sass']); // Отслеживаем все файлы в папке sass
	gulp.watch('app/*.html', browserSync.reload); // Отслеживаем html файл
	gulp.watch('app/js/**/*.js', browserSync.reload); // Отслеживаем скрипты
});

// Сжатие изображений
gulp.task('imagemin', function() {
	return gulp.src('app/img/**/*') // Директория с файлами для сжатия
		.pipe(cache(imagemin({ // Сжимаем изображения с заданными параметрами
			interlaced: true,
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()] // Используем плагин для PNG изображений
		})))
		.pipe(gulp.dest('dist/img')); // Отправляем все обработанные файлы в указанную директорию
});

// Компиляция HTML файлов
gulp.task('buildhtml', function() {
  gulp.src(['app/*.html']) // Директоря с HTML файлами
    .pipe(fileinclude({ // Подключаем указанные файлы с помощью плагина
      prefix: '@@'
    }))
    .pipe(gulpRemoveHtml()) // Удаляем код со специальными комментариями
	.pipe(removeHtmlComments()) // Удаляем все комментарии
	.pipe(htmlmin({collapseWhitespace: true})) // Сжимаем весь код
    .pipe(gulp.dest('dist/')); // Отправляем в указанную папку
});

// $ gulp removedist - Команда для удаления директории Dist
gulp.task('removedist', function() { return del.sync('dist'); });

// $ gulp build - Сборка проекта (компиляция, билдинг)
gulp.task('build', ['removedist', 'buildhtml', 'imagemin', 'sass', 'libs'], function() {
	// Указываем CSS файлы для сборки
	var buildCss = gulp.src([
		'app/css/fonts.min.css',
		'app/css/main.min.css'
		]).pipe(gulp.dest('dist/css'));
	// Забираем файл .htaccess если он есть
	var buildFiles = gulp.src([
		'app/.htaccess',
		'app/humans.txt'
	]).pipe(gulp.dest('dist'));
	// Забираем шрифты
	var buildFonts = gulp.src('app/fonts/**/*').pipe(gulp.dest('dist/fonts'));
	// Забираем скрипты
	var buildJs = gulp.src('app/js/**/*').pipe(gulp.dest('dist/js'));
});

// $ gulp deploy - Отправка файлов на FTP сервер (деплой)
gulp.task('deploy', function() {
	// Указываем параметры подключения
	var conn = ftp.create({
		host:      'hostname.com', // Хост
		user:      'username', // Логин
		password:  'userpassword', // Пароль
		parallel:  10, // Количество одновременных запросов
		log: gutil.log // Название лог файла
	});
	// Указываем папки/файлы для отправки
	var globs = [
	'dist/**', // Все файлы из папки dist
	'dist/.htaccess', // Скрытые файлы с точкой нужно указывать явно
	];
	return gulp.src(globs, {buffer: false}) // Запрещаем смотреть в кеш
	.pipe(conn.dest('/path/to/folder/on/server')); // Указываем удаленную директорию, куда положить файлы

});

// $ gulp clearcache - Команда для очистки кеша Gulp
gulp.task('clearcache', function () { return cache.clearAll(); });

// $ gulp - Команда для разработки (откроется страница index.html в браузере)
gulp.task('default', ['watch']);
