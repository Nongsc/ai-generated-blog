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
    // 认证错误返回 401，让前端可以正确处理
    const status = error.message?.includes('403') || error.message?.includes('401') ? 401 : 500;
    return NextResponse.json(
      { success: false, error: error.message || '获取统计数据失败' },
      { status }
    );
  }
}
