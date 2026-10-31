import { NextRequest, NextResponse } from 'next/server';
import { uploadProductImage, isR2Configured } from '@/lib/cloudflare-r2';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    r2Configured: isR2Configured(),
    provider: isR2Configured() ? 'cloudflare-r2' : 'local',
  });
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No image file provided' }, { status: 400 });
    }

    // Validate mime type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif', 'image/gif'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      return NextResponse.json(
        { success: false, error: 'Invalid file format. Please upload JPG, PNG, or WebP.' },
        { status: 400 }
      );
    }

    // Limit maximum size to 10MB
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, error: 'File size exceeds 10MB limit.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await uploadProductImage(buffer, file.name, file.type);

    return NextResponse.json({
      success: true,
      url: result.url,
      provider: result.provider,
      filename: file.name,
      size: file.size,
    });
  } catch (error: any) {
    console.error('POST /api/upload error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to upload photo' },
      { status: 500 }
    );
  }
}
