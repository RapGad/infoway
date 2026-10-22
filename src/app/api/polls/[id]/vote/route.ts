import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Poll } from '@/models/Poll';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const body = await req.json();
    const { optionId } = body;

    if (!optionId) {
      return NextResponse.json({ success: false, error: 'Option ID is required' }, { status: 400 });
    }

    // Capture voter IP or identifier to prevent spam
    const voterIp =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('x-real-ip') ||
      'anonymous-voter';

    const poll = await Poll.findById(resolvedParams.id);
    if (!poll) {
      return NextResponse.json({ success: false, error: 'Poll not found' }, { status: 404 });
    }

    if (!poll.isActive) {
      return NextResponse.json({ success: false, error: 'This poll is currently closed' }, { status: 400 });
    }

    // Find option and increment
    const option = poll.options.id(optionId);
    if (!option) {
      return NextResponse.json({ success: false, error: 'Option not found' }, { status: 404 });
    }

    option.votes = (option.votes || 0) + 1;
    poll.totalVotes = (poll.totalVotes || 0) + 1;

    if (voterIp && !poll.voterIps.includes(voterIp)) {
      poll.voterIps.push(voterIp);
    }

    await poll.save();

    return NextResponse.json({
      success: true,
      message: 'Vote recorded successfully',
      poll,
    });
  } catch (error) {
    console.error('POST /api/polls/[id]/vote error:', error);
    return NextResponse.json({ success: false, error: 'Failed to record vote' }, { status: 500 });
  }
}
