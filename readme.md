# Start Template
**Шаблон проекта для быстрого старта**


## Старт проекта

### Склонируй репозиторий и перейди в папку проекта
```
git clone git@github.com:xprocessorx/start-template.git new-project && cd new-project
```

### Установи модули
```
npm i
```

### Запусти шаблон
```
gulp
```


## Команды для запуска

### Запуск с отслеживанием изменений
```
gulp
```

### Сборка в папку `dist`
```
gulp build
```

### Очистка папки `dist`
```
gulp removedist
```

### Очистка кеша gulp
```
gulp clearcache
```


## Структура папок и файлов
```
├── app/                        # Исходники
│   ├── fonts/                  # Шрифты
│   ├── img/                    # Изображения
│   ├── js/                     # Скрипты
│   │   ├── libs.min.js         # В этом файле объединяются все плагины из папки libs
│   │   └── common.js           # Главный скрипт, где Вы будете писать свой код
│   ├── libs/                   # Плагины (Уже содержит jQuery v.3.2.1)
│   ├── scss/                   # Стили
│   │   ├──_blocks/             # Стили блоков
│   │   │   ├── _header.scss    # Стиль шапки
│   │   │   └── _example.scss   # По аналогии создай другие блоки
│   │   ├──_mixins/             # Миксины
│   │   │   └── _font-face.scss # Миксин font-face
│   │   ├── _libs.scss          # Подключение стилей плагинов
│   │   ├── _media.scss         # Стили медиа запросов (First mobile или First Desktop)
│   │   ├── _vars.scss          # Файл переменных
│   │   ├── fonts.scss          # Подключение шрифтов
│   │   └── style.scss          # Основной файл стилей проекта
│   ├── ht.access               # Переименовать в .htaccess перед сборкой проекта для публикаци
│   └── index.html              # Основной файл разметки
├── .bowerrc                    # Конфигурация bower (указывает куда устанавливать плагины)
├── .gitignore                  # Список исключённых файлов из Git
├── gulpfile.js                 # Конфигурация настроек Gulp
├── .gitignore                  # Список исключённых файлов из Git
├── package.json                # Список модулей и прочей информации
└── readme.md                   # Документация шаблона
```

## [Внеси свой вклад в развитие проекта!](https://github.com/xprocessorx/start-template/blob/master/contributing.md)
