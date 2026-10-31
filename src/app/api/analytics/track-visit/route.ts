import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { MarketplaceVisit } from '@/models/MarketplaceVisit';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json().catch(() => ({}));

    const userAgent = req.headers.get('user-agent') || '';
    const forwardedFor = req.headers.get('x-forwarded-for') || '';
    const ip = forwardedFor.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown';

    let deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop';
    const ua = userAgent.toLowerCase();
    if (/(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(ua)) {
      deviceType = 'tablet';
    } else if (/(mobi|ipod|phone|blackberry|opera mini|fennec|minimo|symbian|psp|nintendo ds)/.test(ua)) {
      deviceType = 'mobile';
    }

    const source = (body.source || 'direct').toString().toLowerCase();
    const macAddress = body.macAddress || body.mac || undefined;
    const username = body.username || body.user || undefined;

    const visit = await MarketplaceVisit.create({
      source,
      macAddress: macAddress && !macAddress.includes('$') ? macAddress : undefined,
      username: username && !username.includes('$') ? username : undefined,
      ip,
      userAgent: userAgent.slice(0, 300),
      deviceType,
      path: body.path || '/partnership',
      businessName: body.businessName || undefined,
      productName: body.productName || undefined,
    });

    return NextResponse.json({ success: true, id: visit._id }, { status: 201, headers: CORS_HEADERS });
  } catch (error) {
    console.error('Error tracking marketplace visit:', error);
    return NextResponse.json({ success: false, error: 'Tracking failed' }, { status: 500, headers: CORS_HEADERS });
  }
}
