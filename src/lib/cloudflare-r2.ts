import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export interface UploadResult {
  url: string;
  key: string;
  provider: 'cloudflare-r2' | 'local';
  optimized?: boolean;
}

/**
 * Checks if Cloudflare R2 credentials are fully configured in environment variables.
 */
export function isR2Configured(): boolean {
  return !!(
    process.env.CLOUDFLARE_R2_ACCOUNT_ID &&
    process.env.CLOUDFLARE_R2_ACCESS_KEY_ID &&
    process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY &&
    process.env.CLOUDFLARE_R2_BUCKET_NAME
  );
}

/**
 * Uploads a file buffer to Cloudflare R2 object storage.
 * Cloudflare R2 offers zero egress fees and global CDN distribution.
 */
export async function uploadToCloudflareR2(
  buffer: Buffer,
  filename: string,
  contentType: string = 'image/webp'
): Promise<UploadResult> {
  const accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID!;
  const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!;
  const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!;
  const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME!;
  const publicDomain = (process.env.CLOUDFLARE_R2_PUBLIC_DOMAIN || '').replace(/\/$/, '');

  // Dynamic import of S3 client to keep cold-start light
  const { S3Client, PutObjectCommand } = await import('@aws-sdk/client-s3');

  const s3 = new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  const cleanFilename = filename.toLowerCase().replace(/[^a-z0-9_.-]/g, '-');
  const key = `products/${Date.now()}-${cleanFilename}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000, immutable', // 1 year immutable CDN cache
    })
  );

  // If a public domain or R2 dev URL is configured, use it; otherwise use default R2 path
  const url = publicDomain
    ? `${publicDomain}/${key}`
    : `https://${bucketName}.${accountId}.r2.cloudflarestorage.com/${key}`;

  return {
    url,
    key,
    provider: 'cloudflare-r2',
    optimized: true,
  };
}

/**
 * Local file fallback when Cloudflare R2 credentials have not been configured yet.
 * Saves to public/uploads/products/ so the app works seamlessly right away.
 */
export async function uploadToLocal(
  buffer: Buffer,
  filename: string
): Promise<UploadResult> {
  const cleanFilename = filename.toLowerCase().replace(/[^a-z0-9_.-]/g, '-');
  const finalFilename = `${Date.now()}-${cleanFilename}`;

  const uploadDir = join(process.cwd(), 'public', 'uploads', 'products');
  await mkdir(uploadDir, { recursive: true }).catch(() => {});

  const filePath = join(uploadDir, finalFilename);
  await writeFile(filePath, buffer);

  return {
    url: `/uploads/products/${finalFilename}`,
    key: `local/${finalFilename}`,
    provider: 'local',
    optimized: false,
  };
}

/**
 * Master upload helper: Uses Cloudflare R2 when env keys exist; otherwise falls back gracefully to local storage.
 */
export async function uploadProductImage(
  buffer: Buffer,
  filename: string,
  contentType: string = 'image/webp'
): Promise<UploadResult> {
  if (isR2Configured()) {
    try {
      return await uploadToCloudflareR2(buffer, filename, contentType);
    } catch (err) {
      console.error('[Cloudflare R2] Upload failed, falling back to local storage:', err);
      return await uploadToLocal(buffer, filename);
    }
  }

  return await uploadToLocal(buffer, filename);
}
