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

export default cloudinary;
