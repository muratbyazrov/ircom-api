module.exports = {
    db: {
        host: '127.0.0.1',
        port: 5432,
        database: 'ircom-api',
        schema: 'public',
        user: 'ircom-api',
        password: 'ircom-api-password-1',
        runMigrations: true,
    },
    http: {
        host: process.env.IRCOM_API_HOST || '0.0.0.0',
        port: 3002,
        path: '/ircom-api/v1',
    },
    media: {
        bucket: process.env.IRCOM_S3_BUCKET || '',
        region: process.env.IRCOM_S3_REGION || 'eu-central-1',
        keyPrefix: process.env.IRCOM_S3_KEY_PREFIX || 'ircom/photos',
        uploadEndpoint: process.env.IRCOM_S3_UPLOAD_ENDPOINT || '',
        publicBaseUrl: process.env.IRCOM_S3_PUBLIC_BASE_URL || '',
        accessKeyId: process.env.IRCOM_S3_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.IRCOM_S3_SECRET_ACCESS_KEY || '',
        sessionToken: process.env.IRCOM_S3_SESSION_TOKEN || '',
        maxUploadBytes: Number(process.env.IRCOM_S3_MAX_UPLOAD_BYTES) || 10485760,
        uploadExpiresSeconds: Number(process.env.IRCOM_S3_UPLOAD_EXPIRES_SECONDS) || 300,
    },
};
