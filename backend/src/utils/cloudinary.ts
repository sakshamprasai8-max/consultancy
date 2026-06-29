import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

const isCloudinaryConfigured = cloudName && apiKey && apiSecret;

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
}

export interface UploadResult {
  url: string;
  publicId: string;
}

export const uploadFile = async (
  file: Express.Multer.File | { path: string; originalname: string },
  folder: string = 'edu-consult-pro'
): Promise<UploadResult> => {
  if (!isCloudinaryConfigured) {
    // Local / development mockup fallback
    console.log('Cloudinary not configured. Mocking file upload...');
    const filename = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
    const mockUrl = `/uploads/${folder}/${filename}`;
    
    // In a real local upload scenario, we would move the file to a public uploads directory.
    // For local fallback validation, we just print the path and return a mock structure.
    console.log(`Saved file locally at mock path: ${mockUrl}`);
    return {
      url: mockUrl,
      publicId: `mock_${filename}`,
    };
  }

  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: folder,
      resource_type: 'auto',
    });

    // Remove local file after successful upload to Cloudinary
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('Upload failed');
  }
};

export const deleteFile = async (publicId: string): Promise<void> => {
  if (!isCloudinaryConfigured || publicId.startsWith('mock_')) {
    console.log(`Mock delete for publicId: ${publicId}`);
    return;
  }

  try {
    await cloudinary.uploader.destroy(publicId);
    console.log(`Deleted file: ${publicId} from Cloudinary`);
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
  }
};
