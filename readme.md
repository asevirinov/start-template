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

### Отправить содержимое папки `dist` на FTP сервер
```
gulp deploy
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
├── app/                       # Исходники
│   ├── fonts/                 # Шрифты
│   ├── img/                   # Изображения
│   ├── js/                    # Скрипты
│   │   ├── libs.min.js        # В этом файле объединяются все плагины из папки libs
│   │   └── common.js          # Главный скрипт, где Вы будете писать свой код
│   ├── libs/                  # Плагины (Уже содержит jQuery v.3.1.1)
│   ├── sass/                  # Стили
│   │   ├──grid/              # Разметки сетки
│   │   │   ├── _fixed.scss    # Фиксированная bootstrap сетка (1200px)
│   │   │   ├── _responsive.scss # Адаптивная bootstrap сетка (v.3.3.7)
│   │   ├── _base.scss         # Глобальные стили проекта
│   │   ├── _libs.scss         # Подключение стилей плагинов
│   │   ├── _media.scss        # Стили медиа запросов (First mobile или First Desktop)
│   │   ├── _vars.scss         # Файл переменных
│   │   ├── fonts.scss         # Подключение шрифтов
│   │   └── main.scss          # Основной файл стилей проекта
│   ├── grid.scss              # Подключение требуемой разметки
│   ├── header.scss            # Стили первой секции, которую увидит пользователь
│   ├── ht.access              # Переименовать в .htaccess перед сборкой проекта для публикаци
│   ├── humans.txt             # Список авторов проекта
│   └── index.html             # Основной файл разметки
├── .bowerrc                   # Конфигурация bower (указывает куда устанавливать плагины)
├── .gitignore                 # Список исключённых файлов из Git
├── gulpfile.js                # Конфигурация настроек Gulp
├── .gitignore                 # Список исключённых файлов из Git
├── package.json               # Список модулей и прочей информации
└── readme.md                  # Документация шаблона
```

#### Обычные спрайты

Для подключения иконки используется примесь `sprite` со значением `$icon`, где `icon` это название PNG иконки, например:
```css
.joy
    sprite $joy
```

В собранном виде в CSS добавится только обычный спрайт и это будет выглядеть так:
```css
.joy {
    background-image: url("../images/sprites/emoji.png");
    background-position: 32px 0px;
    width: 24px;
    height: 24px;
}
```

## [Внеси свой вклад в развитие проекта!](https://github.com/CSSSR/csssr-project-template/blob/master/contributing.md)
