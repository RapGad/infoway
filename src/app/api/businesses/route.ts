import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Business } from '@/models/Business';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const filter: Record<string, unknown> = { isActive: true };
    if (category && category !== 'all') {
      filter.category = category;
    }
    const businesses = await Business.find(filter).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, businesses });
  } catch (error) {
    console.error('GET /api/businesses error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch businesses' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const business = await Business.create({
      name: body.name,
      category: body.category,
      description: body.description,
      location: body.location,
      phone: body.phone,
      email: body.email,
      logo: body.logo,
      banner: body.banner,
      badge: body.badge || 'Partner Business',
      isActive: body.isActive !== undefined ? body.isActive : true,
    });

    return NextResponse.json({ success: true, business }, { status: 201 });
  } catch (error) {
    console.error('POST /api/businesses error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create business' }, { status: 500 });
  }
}
