import { NextResponse } from 'next/server';
import { getDashboardStats } from '@/lib/api-client';

// GET /api/dashboard/stats - Get dashboard statistics
export async function GET() {
  try {
    const stats = await getDashboardStats();
    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    console.error('Get dashboard stats error:', error);
    return NextResponse.json(
      { success: false, error: error.message || '获取统计数据失败' },
      { status: 500 }
    );
  }
}
