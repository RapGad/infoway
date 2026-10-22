import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Order } from '@/models/Order';

function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `INF-${timestamp}-${random}`;
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const businessId = searchParams.get('businessId');
    const filter: Record<string, unknown> = {};
    if (status && status !== 'all') {
      filter.status = status;
    }
    if (businessId && businessId !== 'all') {
      filter['items.businessId'] = businessId;
    }
    const orders = await Order.find(filter).sort({ createdAt: -1 }).limit(200);
    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error('GET /api/orders error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const totalAmount = body.items.reduce(
      (sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity,
      0
    );

    const primaryBusiness = body.items[0]?.businessName || 'Partner Merchant';
    const primaryBusinessId = body.items[0]?.businessId || '';

    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      businessId: primaryBusinessId,
      businessName: primaryBusiness,
      customer: body.customer,
      items: body.items,
      totalAmount,
      paymentMethod: body.paymentMethod || 'cash_on_delivery',
      notes: body.notes,
      status: 'pending',
    });

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error) {
    console.error('POST /api/orders error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create order' }, { status: 500 });
  }
}
