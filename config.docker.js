module.exports = {
    db: {
        host: 'postgres',
        port: 5432,
        database: 'ircom-api',
        schema: 'public',
        user: 'ircom-api',
        password: 'ircom-api-password-1',
        runMigrations: true,
    },
    http: {
        host: '0.0.0.0',
        port: 3002,
        path: '/ircom-api/v1',
    },
};
