import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Poll } from '@/models/Poll';

// GET all active polls (or all polls if ?all=true for admin)
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const showAll = searchParams.get('all') === 'true';

    const filter = showAll ? {} : { isActive: true };
    const polls = await Poll.find(filter).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, polls });
  } catch (error) {
    console.error('GET /api/polls error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch polls' }, { status: 500 });
  }
}

// POST new poll (Admin)
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const { question, category, description, options } = body;
    if (!question || !options || !Array.isArray(options) || options.length < 2) {
      return NextResponse.json(
        { success: false, error: 'Question and at least 2 options are required' },
        { status: 400 }
      );
    }

    const formattedOptions = options.map((opt: string | { text: string }) => {
      const text = typeof opt === 'string' ? opt : opt.text;
      return { text: text.trim(), votes: 0 };
    });

    const poll = await Poll.create({
      question: question.trim(),
      category: category || 'pricing',
      description: description?.trim() || '',
      options: formattedOptions,
      isActive: true,
      totalVotes: 0,
      voterIps: [],
    });

    return NextResponse.json({ success: true, poll }, { status: 201 });
  } catch (error) {
    console.error('POST /api/polls error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create poll' }, { status: 500 });
  }
}
