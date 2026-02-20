FROM --platform=linux/amd64 python:3.7-alpine

# Используйте официальный образ Node.js
FROM node:18

# Установите рабочую директорию в контейнере
WORKDIR /app

# Скопируйте package.json и package-lock.json в контейнер
COPY package*.json ./

# Установите зависимости
RUN npm install -g db-migrate
RUN npm install

# Скопируйте остальные файлы приложения в контейнер
COPY . .

# Запустите приложение при запуске контейнера
CMD [ "node", "app.js" ]
