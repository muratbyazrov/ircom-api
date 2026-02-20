module.exports = {
    db: {
        host: '127.0.0.1',
        port: 5432,
        database: 'ircom-api',
        schema: 'ircom-api',
        user: 'ircom-api-user-1',
        password: 'ircom-api-password-1',
        runMigrations: true,
    },
    http: {
        host: '127.0.0.1',
        port: 3002,
        path: '/ircom-api/v1',
    },
};
