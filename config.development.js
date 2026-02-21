module.exports = {
    db: {
        host: '127.0.0.1',
        port: 5432,
        database: 'ircom-api',
        schema: 'ircom-api',
        user: 'ircom-api',
        password: 'ircom-api-password-1',
        runMigrations: true,
    },
    http: {
        host: process.env.IRCOM_API_HOST || '0.0.0.0',
        port: 3002,
        path: '/ircom-api/v1',
    },
};
