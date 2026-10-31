import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { MarketplaceVisit } from '@/models/MarketplaceVisit';
import { Order } from '@/models/Order';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const limit = Math.min(100, Math.max(10, Number(searchParams.get('limit')) || 50));

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalVisits,
      hotspotVisits,
      todayVisits,
      weekVisits,
      uniqueUsers,
      recentVisits,
      ordersCount,
    ] = await Promise.all([
      MarketplaceVisit.countDocuments(),
      MarketplaceVisit.countDocuments({ source: { $regex: '^hotspot', $options: 'i' } }),
      MarketplaceVisit.countDocuments({ createdAt: { $gte: startOfToday } }),
      MarketplaceVisit.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      MarketplaceVisit.distinct('macAddress', { macAddress: { $exists: true, $ne: '' } }),
      MarketplaceVisit.find().sort({ createdAt: -1 }).limit(limit).lean(),
      Order.countDocuments(),
    ]);

    // Source breakdown aggregation
    const sourceStats = await MarketplaceVisit.aggregate([
      {
        $group: {
          _id: '$source',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Daily breakdown for last 7 days to show improvement over time
    const dailyStats = await MarketplaceVisit.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          total: { $sum: 1 },
          hotspot: {
            $sum: {
              $cond: [
                { $regexMatch: { input: '$source', regex: '^hotspot', options: 'i' } },
                1,
                0,
              ],
            },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        totalVisits,
        hotspotVisits,
        todayVisits,
        weekVisits,
        uniqueHotspotDevices: uniqueUsers.length,
        ordersCount,
        sources: sourceStats.map((s: any) => ({
          source: s._id || 'direct',
          count: s.count,
        })),
        dailyGrowth: dailyStats.map((d: any) => ({
          date: d._id,
          total: d.total,
          hotspot: d.hotspot,
        })),
      },
      recentVisits,
    });
  } catch (error) {
    console.error('GET /api/analytics/marketplace error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
