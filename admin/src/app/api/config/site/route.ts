import { NextResponse } from 'next/server';
import { getSiteConfig, saveSiteConfig } from '@/lib/api-client';

// GET /api/config/site - Get all site config
export async function GET() {
  try {
    const config = await getSiteConfig();
    return NextResponse.json({
      success: true,
      data: config,
    });
  } catch (error: any) {
    console.error('Get site config error:', error);
    return NextResponse.json(
      { success: false, error: error.message || '获取配置失败' },
      { status: 500 }
    );
  }
}

// POST /api/config/site - Save all site config
export async function POST(request: Request) {
  try {
    const body = await request.json();
    await saveSiteConfig(body);
    return NextResponse.json({
      success: true,
      message: '配置保存成功',
    });
  } catch (error: any) {
    console.error('Save site config error:', error);
    return NextResponse.json(
      { success: false, error: error.message || '保存配置失败' },
      { status: 500 }
    );
  }
}

// OPTIONS /api/config/site - CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
