import { v2 as cloudinary } from 'cloudinary';

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

const missing = [
  !cloudName ? 'CLOUDINARY_CLOUD_NAME' : null,
  !apiKey ? 'CLOUDINARY_API_KEY' : null,
  !apiSecret ? 'CLOUDINARY_API_SECRET' : null,
].filter(Boolean) as string[];

if (missing.length > 0) {
  throw new Error(
    `Cloudinary is not configured. Missing environment variable(s): ${missing.join(', ')}. ` +
    'Add them to your .env file (see .env.example) to enable file uploads.'
  );
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

export type CloudinaryResourceType = 'image' | 'video' | 'raw' | 'auto';

export function audioResourceType(): CloudinaryResourceType {
  // Audio must NOT be uploaded as 'raw': Cloudinary serves raw files with
  // Content-Disposition: attachment and application/octet-stream, which
  // browsers refuse to play in <audio> elements. 'auto' detects audio and
  // stores it as a video-type resource (proper MIME, range requests, inline).
  return 'auto';
}

export async function destroyAsset(publicId: string, type: 'IMAGE' | 'VIDEO' | 'VOICE_NOTE') {
  const candidates: CloudinaryResourceType[] =
    type === 'IMAGE' ? ['image'] :
    type === 'VIDEO' ? ['video'] :
    ['video', 'raw']; // VOICE_NOTE: new assets are video-type; legacy raws fall back
  for (const rt of candidates) {
    try {
      const result = await cloudinary.uploader.destroy(publicId, { resource_type: rt });
      if (result.result === 'ok' || result.result === 'not found') return;
    } catch { /* try next candidate */ }
  }
}

export default cloudinary;
