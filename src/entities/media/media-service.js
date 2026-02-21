const {Story} = require('story-system');
const crypto = require('crypto');

const MAX_UPLOAD_BYTES = 20 * 1024 * 1024;
const DEFAULT_UPLOAD_BYTES = 10 * 1024 * 1024;
const DEFAULT_UPLOAD_EXPIRES_SECONDS = 300;
const ALLOWED_MIME_TYPES = new Set([
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/heic',
    'image/heif',
    'image/avif',
    'image/gif',
]);

const encodeRfc3986 = value => encodeURIComponent(value).replace(/[!'()*]/g, c => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
const normalizePrefix = (value, fallback) => String(value || fallback || 'uploads')
    .trim()
    .replace(/^\/+|\/+$/g, '')
    .replace(/\s+/g, '-');
const normalizeRegion = region => String(region || '').trim() || 'eu-central-1';
const toInt = (value, fallback) => {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return fallback;
    return Math.trunc(parsed);
};
const mapMimeToExt = mimeType => {
    const map = {
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'image/webp': 'webp',
        'image/heic': 'heic',
        'image/heif': 'heif',
        'image/avif': 'avif',
        'image/gif': 'gif',
    };
    return map[mimeType] || 'bin';
};
const safeNamePart = value => String(value || '')
    .toLowerCase()
    .replace(/\.[a-z0-9]{1,10}$/i, '')
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48);
const getSignatureKey = ({secretAccessKey, dateStamp, region, service}) => {
    const kDate = crypto.createHmac('sha256', `AWS4${secretAccessKey}`).update(dateStamp).digest();
    const kRegion = crypto.createHmac('sha256', kDate).update(region).digest();
    const kService = crypto.createHmac('sha256', kRegion).update(service).digest();
    return crypto.createHmac('sha256', kService).update('aws4_request').digest();
};
const buildS3PostUrl = ({bucket, region, endpoint}) => {
    const normalizedEndpoint = String(endpoint || '').trim();
    if (normalizedEndpoint) {
        return normalizedEndpoint.replace(/\/+$/, '');
    }
    return `https://${bucket}.s3.${region}.amazonaws.com`;
};
const buildPublicUrl = ({publicBaseUrl, objectKey}) => {
    const base = String(publicBaseUrl || '').trim().replace(/\/+$/, '');
    if (!base) return null;
    return `${base}/${encodeRfc3986(objectKey).replace(/%2F/g, '/')}`;
};
const buildDefaultAwsPublicUrl = ({bucket, region, objectKey}) => {
    const normalizedBucket = String(bucket || '').trim();
    const normalizedRegion = normalizeRegion(region);
    const normalizedKey = String(objectKey || '').trim();
    if (!normalizedBucket || !normalizedKey) {
        return null;
    }
    return `https://${normalizedBucket}.s3.${normalizedRegion}.amazonaws.com/${encodeRfc3986(normalizedKey).replace(/%2F/g, '/')}`;
};

class MediaService {
    constructor(config = {}) {
        this.config = config;
    }

    getS3Config() {
        const mediaConfig = this.config.media || {};
        const bucket = String(process.env.IRCOM_S3_BUCKET || mediaConfig.bucket || '').trim();
        const region = normalizeRegion(process.env.IRCOM_S3_REGION || mediaConfig.region);
        const accessKeyId = String(process.env.IRCOM_S3_ACCESS_KEY_ID || mediaConfig.accessKeyId || '').trim();
        const secretAccessKey = String(process.env.IRCOM_S3_SECRET_ACCESS_KEY || mediaConfig.secretAccessKey || '').trim();
        const sessionToken = String(process.env.IRCOM_S3_SESSION_TOKEN || mediaConfig.sessionToken || '').trim() || null;
        const keyPrefix = normalizePrefix(process.env.IRCOM_S3_KEY_PREFIX || mediaConfig.keyPrefix, 'ircom/photos');
        const endpoint = String(process.env.IRCOM_S3_UPLOAD_ENDPOINT || mediaConfig.uploadEndpoint || '').trim();
        const publicBaseUrl = String(process.env.IRCOM_S3_PUBLIC_BASE_URL || mediaConfig.publicBaseUrl || '').trim();
        const objectAcl = String(process.env.IRCOM_S3_OBJECT_ACL || mediaConfig.objectAcl || '').trim();
        const maxUploadBytes = Math.min(
            MAX_UPLOAD_BYTES,
            Math.max(1, toInt(process.env.IRCOM_S3_MAX_UPLOAD_BYTES || mediaConfig.maxUploadBytes, DEFAULT_UPLOAD_BYTES)),
        );
        const expiresSeconds = Math.max(
            60,
            Math.min(900, toInt(process.env.IRCOM_S3_UPLOAD_EXPIRES_SECONDS || mediaConfig.uploadExpiresSeconds, DEFAULT_UPLOAD_EXPIRES_SECONDS)),
        );

        if (!bucket || !accessKeyId || !secretAccessKey) {
            throw new Story.errors.BadRequestError('S3 is not configured');
        }

        return {
            bucket,
            region,
            accessKeyId,
            secretAccessKey,
            sessionToken,
            keyPrefix,
            endpoint,
            publicBaseUrl,
            objectAcl,
            maxUploadBytes,
            expiresSeconds,
        };
    }

    buildPhotoUrl({params}) {
        const {publicBaseUrl, bucket, region} = this.getS3Config();
        if (/^https?:\/\//i.test(params.objectKey)) {
            return {
                objectKey: params.objectKey,
                photoUrl: params.objectKey,
            };
        }
        const explicitPublicUrl = buildPublicUrl({
            publicBaseUrl,
            objectKey: params.objectKey,
        });
        return {
            objectKey: params.objectKey,
            photoUrl: explicitPublicUrl || buildDefaultAwsPublicUrl({
                bucket,
                region,
                objectKey: params.objectKey,
            }),
        };
    }

    initPhotoUpload({params}) {
        const config = this.getS3Config();
        const mimeType = String(params.mimeType || '').trim().toLowerCase();

        if (!ALLOWED_MIME_TYPES.has(mimeType)) {
            throw new Story.errors.BadRequestError('Unsupported image type');
        }
        if (params.byteSize > config.maxUploadBytes) {
            throw new Story.errors.BadRequestError(`Image is too large. Max ${config.maxUploadBytes} bytes`);
        }

        const now = new Date();
        const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
        const dateStamp = amzDate.slice(0, 8);
        const scope = `${dateStamp}/${config.region}/s3/aws4_request`;
        const ext = mapMimeToExt(mimeType);
        const originalName = safeNamePart(params.originalName || '');
        const randomId = crypto.randomUUID();
        const objectKey = [
            config.keyPrefix,
            `account-${params.accountId}`,
            params.entityType,
            `${Date.now()}-${randomId}${originalName ? `-${originalName}` : ''}.${ext}`,
        ].join('/');

        const expiration = new Date(now.getTime() + (config.expiresSeconds * 1000)).toISOString();
        const conditions = [
            {bucket: config.bucket},
            {key: objectKey},
            {'Content-Type': mimeType},
            {'x-amz-algorithm': 'AWS4-HMAC-SHA256'},
            {'x-amz-credential': `${config.accessKeyId}/${scope}`},
            {'x-amz-date': amzDate},
            ['content-length-range', 1, config.maxUploadBytes],
        ];
        if (config.sessionToken) {
            conditions.push({'x-amz-security-token': config.sessionToken});
        }
        if (config.objectAcl) {
            conditions.push({acl: config.objectAcl});
        }
        const policy = Buffer.from(JSON.stringify({expiration, conditions})).toString('base64');
        const signingKey = getSignatureKey({
            secretAccessKey: config.secretAccessKey,
            dateStamp,
            region: config.region,
            service: 's3',
        });
        const signature = crypto.createHmac('sha256', signingKey).update(policy).digest('hex');

        const fields = {
            'key': objectKey,
            'Content-Type': mimeType,
            policy,
            'x-amz-algorithm': 'AWS4-HMAC-SHA256',
            'x-amz-credential': `${config.accessKeyId}/${scope}`,
            'x-amz-date': amzDate,
            'x-amz-signature': signature,
            ...(config.objectAcl ? {acl: config.objectAcl} : {}),
            ...(config.sessionToken ? {'x-amz-security-token': config.sessionToken} : {}),
        };

        return {
            objectKey,
            upload: {
                method: 'POST',
                url: buildS3PostUrl({
                    bucket: config.bucket,
                    region: config.region,
                    endpoint: config.endpoint,
                }),
                fields,
                expiresAt: expiration,
            },
            photoUrl: buildPublicUrl({
                publicBaseUrl: config.publicBaseUrl,
                objectKey,
            }) || buildDefaultAwsPublicUrl({
                bucket: config.bucket,
                region: config.region,
                objectKey,
            }),
        };
    }
}

module.exports = {MediaService};
