# Подготовка БД для ircom-api

```sql
CREATE DATABASE "ircom-api";
CREATE USER "ircom-api-user-1" WITH ENCRYPTED PASSWORD 'ircom-api-password-1';
GRANT ALL PRIVILEGES ON DATABASE "ircom-api" TO "ircom-api-user-1";
```

После запуска сервиса миграции создадут схему и таблицы автоматически (`runMigrations: true`).
