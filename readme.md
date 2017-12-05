# Start Template
**Шаблон проекта для быстрого старта**


## Старт проекта

### Склонируй репозиторий и перейди в папку проекта
```
git clone git@github.com:asevirinov/start-template.git new-project && cd new-project
```

### Установи модули
```
npm i
```

## Команды gulp

### Запуск с отслеживанием изменений
```
gulp
```

### Сборка в папку `dist`
```
gulp build
```

### Удаление папки `dist`
```
gulp removedist
```

### Очистка кеша
```
gulp clearcache
```


## Структура папок и файлов
```
├── app/                        # Исходники
│   ├── fonts/                  # Шрифты
│   ├── img/                    # Изображения
│   ├── js/                     # Скрипты
│   │   └── app.js              # Для вашего кода (ES6)
│   ├── libs/                   # Плагины (Уже содержит jQuery v.3.2.1 и исходники bootstrap 4)
│   ├── scss/                   # Стили
│   │   ├──_mixins/             # Миксины
│   │   │   └── _font-face.scss # Миксин font-face
│   │   ├── _libs.scss          # Подключение стилей плагинов
│   │   ├── _media.scss         # Стили медиа запросов (First mobile)
│   │   ├── _vars.scss          # Переменные
│   │   ├── fonts.scss          # Подключение шрифтов
│   │   └── style.scss          # Основной файл стилей проекта
│   ├── ht.access               # Переименовать в .htaccess перед сборкой проекта для публикаци
│   └── index.html              # Основной файл разметки
├── .bowerrc                    # Конфигурация bower (указывает куда устанавливать плагины)
├── .gitignore                  # Список исключённых файлов из Git
├── gulpfile.js                 # Конфигурация настроек Gulp
├── package.json                # Список npm модулей
└── readme.md                   # Документация шаблона
```

## [Внеси свой вклад в развитие проекта!](https://github.com/xprocessorx/start-template/blob/master/contributing.md)
