import { NextRequest, NextResponse } from 'next/server';
import { getConfig, saveConfig } from '@/lib/api-client';

// GET /api/config - Get config(s)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const key = searchParams.get('key') || undefined;

    const result = await getConfig(key);

    // 单个配置
    if (key && !Array.isArray(result)) {
      try {
        return NextResponse.json({
          value: result.value ? JSON.parse(result.value) : null,
        });
      } catch {
        return NextResponse.json({ value: result.value });
      }
    }

    // 所有配置
    const configs = Array.isArray(result) ? result : [result];
    const configMap: Record<string, any> = {};
    
    for (const config of configs) {
      if (config && config.key) {
        try {
          configMap[config.key] = config.value ? JSON.parse(config.value) : null;
        } catch {
          configMap[config.key] = config.value;
        }
      }
    }

    return NextResponse.json(configMap);
  } catch (error: any) {
    console.error('Get config error:', error);
    return NextResponse.json({});
  }
}

// POST /api/config - Save config
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { key, value } = body;

    const config = await saveConfig({
      key,
      value: typeof value === 'string' ? value : JSON.stringify(value),
    });

    return NextResponse.json({
      key: config.key,
      value: config.value ? JSON.parse(config.value) : null,
    });
  } catch (error: any) {
    console.error('Save config error:', error);
    return NextResponse.json(
      { error: error.message || '保存配置失败' },
      { status: 500 }
    );
  }
}

// OPTIONS /api/config - CORS preflight
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
