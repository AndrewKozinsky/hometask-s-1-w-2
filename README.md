# Запуск Монги в Докере
Запустить образ МонгоДБ в скрытом режиме на порту 27017. Имя контейнера будет test-mongo:
```docker run -d -p 27017:27017 --name blog-mongo mongo```

Команда для захода запущенный в контейнер через коммандную оболочку bash:
```docker exec -it test-mongo bash```

Для работы с запущенной базой данных в графическом интерфейсе в MongoDB Compass нужно перейти на адрес ```mongodb://localhost:27017```.

Для взаимодействия с базой данных из Терминала нужно, находясь в контейнере Монги, запустить утилиту mongosh аналогичной командой.
