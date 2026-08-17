import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { put } from '@vercel/blob';
import { v2 as cloudinary } from 'cloudinary';
import { NextRequest, NextResponse } from 'next/server';

const MAX_UPLOAD_SIZE = 4 * 1024 * 1024;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const type = formData.get('type') as string | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    if (!type || !['image', 'resume'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid file type' },
        { status: 400 }
      );
    }

    // Validate file type based on upload type
    if (type === 'image') {
      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validImageTypes.includes(file.type)) {
        return NextResponse.json(
          { error: 'Invalid image format. Please upload JPG, PNG, GIF, or WebP.' },
          { status: 400 }
        );
      }

      if (file.size > MAX_UPLOAD_SIZE) {
        return NextResponse.json(
          { error: 'Image size too large. Maximum size is 4MB.' },
          { status: 400 }
        );
      }
    }

    if (type === 'resume') {
      const validResumeTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      if (!validResumeTypes.includes(file.type)) {
        return NextResponse.json(
          { error: 'Invalid resume format. Please upload PDF, DOC, or DOCX.' },
          { status: 400 }
        );
      }

      if (file.size > MAX_UPLOAD_SIZE) {
        return NextResponse.json(
          { error: 'Resume size too large. Maximum size is 4MB.' },
          { status: 400 }
        );
      }
    }

    const originalName = file.name.replace(/[^a-zA-Z0-9.]/g, '-');
    const pathname = `${type}/${originalName}`;

    // Resume files: save to public/uploads/resume/ for direct local serving (e.g. /uploads/resume/1786361332001-yeneCv--1-.pdf)
    if (type === 'resume' || process.env.USE_LOCAL_UPLOADS === 'true') {
      const bytes = await file.arrayBuffer();
      const filename = `${Date.now()}-${originalName}`;
      const uploadDir = path.join(process.cwd(), 'public/uploads', type);
      await mkdir(uploadDir, { recursive: true });
      await writeFile(path.join(uploadDir, filename), Buffer.from(bytes));

      return NextResponse.json({ url: `/uploads/${type}/${filename}`, success: true });
    }

    // Cloudinary Storage Support for images
    if (process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_URL) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const isRawFile = type === 'resume' || file.type === 'application/pdf' || file.type.includes('word') || file.type.includes('document');

      const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: `portfolio/${type}`,
            resource_type: isRawFile ? 'raw' : 'image',
          },
          (error, res) => {
            if (error || !res) reject(error || new Error('Cloudinary upload failed'));
            else resolve(res);
          }
        );
        uploadStream.end(buffer);
      });

      let finalUrl = result.secure_url;
      if (isRawFile && finalUrl.includes('/upload/') && !finalUrl.includes('fl_inline')) {
        finalUrl = finalUrl.replace('/upload/', '/upload/fl_inline/');
      }

      return NextResponse.json({ url: finalUrl, success: true });
    }

    // Hosted deployments need durable object storage. A runtime write to public/
    // disappears when a serverless instance is recycled.
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(pathname, file, {
        access: 'public',
        addRandomSuffix: true,
        contentType: file.type,
      });

      return NextResponse.json({ url: blob.url, success: true });
    }

    // Keep local development convenient, but never pretend ephemeral production
    // storage is persistent.
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'File storage is not configured. Configure Cloudinary credentials or Vercel Blob store and redeploy.' },
        { status: 503 }
      );
    }

    const bytes = await file.arrayBuffer();
    const filename = `${Date.now()}-${originalName}`;
    const uploadDir = path.join(process.cwd(), 'public/uploads', type);
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, filename), Buffer.from(bytes));

    return NextResponse.json({ url: `/uploads/${type}/${filename}`, success: true });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed. Please try again.' },
      { status: 500 }
    );
  }
}

// Optional: Add GET method to check if endpoint is working
export async function GET() {
  return NextResponse.json({ message: 'Upload endpoint is ready' });
}
