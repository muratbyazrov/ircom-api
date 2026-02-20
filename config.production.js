module.exports = {
    db: {
        host: '127.0.0.1',
        database: 'ircom-api',
        schema: 'ircom-api',
        user: 'ircom-api-user',
        password: 'replace-me',
        port: 5432,
        runMigrations: true,
    },
    http: {
        host: '0.0.0.0',
        port: 3002,
        path: '/ircom-api/v1',
    },
};
