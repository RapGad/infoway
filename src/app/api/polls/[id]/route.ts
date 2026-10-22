import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Poll } from '@/models/Poll';

// PUT update poll status or details (Admin)
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const body = await req.json();

    const poll = await Poll.findByIdAndUpdate(resolvedParams.id, body, { new: true });
    if (!poll) {
      return NextResponse.json({ success: false, error: 'Poll not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, poll });
  } catch (error) {
    console.error('PUT /api/polls/[id] error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update poll' }, { status: 500 });
  }
}

// DELETE poll (Admin)
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const resolvedParams = await params;

    const poll = await Poll.findByIdAndDelete(resolvedParams.id);
    if (!poll) {
      return NextResponse.json({ success: false, error: 'Poll not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Poll deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/polls/[id] error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete poll' }, { status: 500 });
  }
}
