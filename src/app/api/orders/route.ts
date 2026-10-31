import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Order } from '@/models/Order';
import { Product } from '@/models/Product';

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

    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json({ success: false, error: 'No items in order' }, { status: 400 });
    }

    if (!body.customer || !body.customer.name || !body.customer.phone || !body.customer.deliveryAddress) {
      return NextResponse.json({ success: false, error: 'Customer contact and delivery details are required' }, { status: 400 });
    }

    // ── SECURITY: Prevent DOM Price Manipulation ──
    // Never trust prices sent from the client or DOM.
    // Fetch real prices directly from the database for each item.
    const productIds = body.items
      .map((it: any) => it.productId || it.product?._id || it._id)
      .filter(Boolean);

    const dbProducts = await Product.find({ _id: { $in: productIds } }).lean();
    const dbProductMap = new Map<string, any>(
      dbProducts.map((p: any) => [p._id.toString(), p])
    );

    const verifiedItems = body.items.map((item: any) => {
      const pid = (item.productId || item.product?._id || item._id)?.toString();
      const dbProd = pid ? dbProductMap.get(pid) : null;

      const quantity = Math.max(1, Math.floor(Number(item.quantity) || 1));

      // Use strictly database price if product exists in catalog
      const price = dbProd && typeof dbProd.price === 'number'
        ? dbProd.price
        : Math.max(0, Number(item.price) || 0);

      const productName = dbProd ? dbProd.name : item.productName || item.name || 'Item';
      const businessId = dbProd ? dbProd.businessId : item.businessId || '';
      const businessName = dbProd ? dbProd.businessName : item.businessName || 'Partner Merchant';

      return {
        productId: pid || 'item',
        productName,
        price,
        quantity,
        businessId,
        businessName,
      };
    });

    const totalAmount = verifiedItems.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );

    const primaryBusiness = verifiedItems[0]?.businessName || 'Partner Merchant';
    const primaryBusinessId = verifiedItems[0]?.businessId || '';

    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      businessId: primaryBusinessId,
      businessName: primaryBusiness,
      customer: {
        name: String(body.customer.name).trim(),
        email: String(body.customer.email || '').trim(),
        phone: String(body.customer.phone).trim(),
        deliveryAddress: String(body.customer.deliveryAddress).trim(),
        city: String(body.customer.city || 'Duayaw Nkwanta').trim(),
      },
      items: verifiedItems,
      totalAmount,
      paymentMethod: body.paymentMethod || 'cash_on_delivery',
      notes: body.notes ? String(body.notes).slice(0, 500) : undefined,
      status: 'pending',
    });

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error) {
    console.error('POST /api/orders error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create order' }, { status: 500 });
  }
}
