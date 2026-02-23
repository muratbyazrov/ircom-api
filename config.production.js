module.exports = {
    db: {
        host: process.env.IRCOM_DB_HOST || '127.0.0.1',
        database: process.env.IRCOM_DB_DATABASE || 'ircom-api',
        schema: process.env.IRCOM_DB_SCHEMA || 'public',
        user: process.env.IRCOM_DB_USER || 'ircom-api-user',
        password: process.env.IRCOM_DB_PASSWORD || 'replace-me',
        port: Number(process.env.IRCOM_DB_PORT) || 5432,
        runMigrations: process.env.IRCOM_DB_RUN_MIGRATIONS !== 'false',
    },
    http: {
        host: process.env.IRCOM_API_HOST || '0.0.0.0',
        port: Number(process.env.IRCOM_API_PORT) || 3002,
        path: process.env.IRCOM_API_PATH || '/ircom-api/v1',
    },
    media: {
        bucket: process.env.IRCOM_S3_BUCKET || '',
        region: process.env.IRCOM_S3_REGION || 'eu-central-1',
        keyPrefix: process.env.IRCOM_S3_KEY_PREFIX || 'ircom/photos',
        uploadEndpoint: process.env.IRCOM_S3_UPLOAD_ENDPOINT || '',
        publicBaseUrl: process.env.IRCOM_S3_PUBLIC_BASE_URL || '',
        objectAcl: process.env.IRCOM_S3_OBJECT_ACL || '',
        accessKeyId: process.env.IRCOM_S3_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.IRCOM_S3_SECRET_ACCESS_KEY || '',
        sessionToken: process.env.IRCOM_S3_SESSION_TOKEN || '',
        maxUploadBytes: Number(process.env.IRCOM_S3_MAX_UPLOAD_BYTES) || 10485760,
        uploadExpiresSeconds: Number(process.env.IRCOM_S3_UPLOAD_EXPIRES_SECONDS) || 300,
    },
};
