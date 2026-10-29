import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Feedback } from '@/models/Feedback';

// GET single feedback by ID
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const feedback = await Feedback.findById(resolvedParams.id);

    if (!feedback) {
      return NextResponse.json({ success: false, error: 'Feedback not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, feedback });
  } catch (error) {
    console.error('GET /api/feedback/[id] error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch feedback item' }, { status: 500 });
  }
}

// PUT update feedback (status, admin notes)
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const body = await req.json();

    const allowedUpdates: Record<string, any> = {};
    if (body.status !== undefined) allowedUpdates.status = body.status;
    if (body.adminNotes !== undefined) allowedUpdates.adminNotes = body.adminNotes;
    if (body.category !== undefined) allowedUpdates.category = body.category;

    const feedback = await Feedback.findByIdAndUpdate(
      resolvedParams.id,
      { $set: allowedUpdates },
      { new: true }
    );

    if (!feedback) {
      return NextResponse.json({ success: false, error: 'Feedback not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, feedback });
  } catch (error) {
    console.error('PUT /api/feedback/[id] error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update feedback' }, { status: 500 });
  }
}

// DELETE feedback
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const resolvedParams = await params;

    const feedback = await Feedback.findByIdAndDelete(resolvedParams.id);
    if (!feedback) {
      return NextResponse.json({ success: false, error: 'Feedback not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Feedback removed successfully' });
  } catch (error) {
    console.error('DELETE /api/feedback/[id] error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete feedback' }, { status: 500 });
  }
}
