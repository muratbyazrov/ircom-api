# Подготовка БД для ircom-api

```sql
CREATE DATABASE "ircom-api";
CREATE USER "ircom-api" WITH ENCRYPTED PASSWORD 'ircom-api-password-1';
GRANT ALL PRIVILEGES ON DATABASE "ircom-api" TO "ircom-api";
\c "ircom-api"
GRANT USAGE, CREATE ON SCHEMA public TO "ircom-api";
```

После запуска сервиса миграции создадут таблицы автоматически в схеме `public` (`runMigrations: true`)
