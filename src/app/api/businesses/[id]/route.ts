import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Business } from '@/models/Business';
import { Product } from '@/models/Product';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const business = await Business.findById(resolvedParams.id);
    if (!business) {
      return NextResponse.json({ success: false, error: 'Business not found' }, { status: 404 });
    }
    const products = await Product.find({ businessId: resolvedParams.id, inStock: true });
    return NextResponse.json({ success: true, business, products });
  } catch (error) {
    console.error('GET /api/businesses/[id] error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch business' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const body = await req.json();
    const business = await Business.findByIdAndUpdate(resolvedParams.id, body, { new: true });
    if (!business) {
      return NextResponse.json({ success: false, error: 'Business not found' }, { status: 404 });
    }
    // Also sync businessName to products if changed
    if (body.name) {
      await Product.updateMany({ businessId: resolvedParams.id }, { businessName: body.name });
    }
    return NextResponse.json({ success: true, business });
  } catch (error) {
    console.error('PUT /api/businesses/[id] error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update business' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const business = await Business.findByIdAndDelete(resolvedParams.id);
    if (!business) {
      return NextResponse.json({ success: false, error: 'Business not found' }, { status: 404 });
    }
    // Delete products associated with this business
    await Product.deleteMany({ businessId: resolvedParams.id });
    return NextResponse.json({ success: true, message: 'Business and related products deleted' });
  } catch (error) {
    console.error('DELETE /api/businesses/[id] error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete business' }, { status: 500 });
  }
}
