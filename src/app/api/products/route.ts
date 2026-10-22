import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Product } from '@/models/Product';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const businessId = searchParams.get('businessId');
    const filter: Record<string, unknown> = {};
    if (businessId) {
      filter.businessId = businessId;
    }
    const products = await Product.find(filter).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error('GET /api/products error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const product = await Product.create({
      businessId: body.businessId,
      businessName: body.businessName,
      name: body.name,
      description: body.description,
      price: body.price,
      category: body.category,
      image: body.image,
      inStock: body.inStock !== undefined ? body.inStock : true,
      featured: body.featured || false,
      tags: body.tags || [],
    });

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error) {
    console.error('POST /api/products error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create product' }, { status: 500 });
  }
}
