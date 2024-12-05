# Используем официальный образ Node.js
FROM node:22

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install --legacy-peer-deps

# Копируем остальные файлы проекта
COPY . .

# Собираем проект TypeScript
RUN npm run prepare  # Выполняет npm run tsc

# Запускаем приложение
CMD ["node", "build/server.js"]  # Замените на путь к вашему скомпилированному файлу
