import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Feedback } from '@/models/Feedback';

// GET feedback list (with optional query filters: status, category, rating, search, all)
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);

    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const rating = searchParams.get('rating');
    const search = searchParams.get('search');

    const filter: Record<string, any> = {};

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (category && category !== 'all') {
      filter.category = category;
    }

    if (rating && rating !== 'all') {
      filter.rating = Number(rating);
    }

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { name: regex },
        { message: regex },
        { subject: regex },
        { email: regex },
        { location: regex },
      ];
    }

    const feedbacks = await Feedback.find(filter).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, feedbacks });
  } catch (error) {
    console.error('GET /api/feedback error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch feedback' }, { status: 500 });
  }
}

// POST new feedback from user/student/customer
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const { name, email, phone, category, rating, subject, message, location, role } = body;

    if (!message || !message.trim()) {
      return NextResponse.json(
        { success: false, error: 'Feedback message is required' },
        { status: 400 }
      );
    }

    const numericRating = Number(rating);
    const validRating = !isNaN(numericRating) && numericRating >= 1 && numericRating <= 5 ? numericRating : 5;

    const validCategories = [
      'connectivity',
      'vouchers',
      'customer_service',
      'pricing',
      'feature_request',
      'general',
    ];
    const chosenCategory = validCategories.includes(category) ? category : 'general';

    const feedback = await Feedback.create({
      name: name?.trim() || 'Anonymous',
      email: email?.trim() || '',
      phone: phone?.trim() || '',
      category: chosenCategory,
      rating: validRating,
      subject: subject?.trim() || '',
      message: message.trim(),
      location: location?.trim() || '',
      role: role?.trim() || 'student',
      status: 'new',
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you for your feedback! It has been submitted successfully.',
        feedback,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/feedback error:', error);
    return NextResponse.json({ success: false, error: 'Failed to submit feedback' }, { status: 500 });
  }
}
