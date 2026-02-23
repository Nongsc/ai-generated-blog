import { NextRequest, NextResponse } from 'next/server';
import { login } from '@/lib/api-client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: '用户名和密码不能为空' },
        { status: 400 }
      );
    }

    const result = await login({ username, password });

    return NextResponse.json({
      success: true,
      data: {
        id: 0, // API 返回的 token 中包含用户信息
        username: result.username,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: error.message || '登录失败' },
      { status: 401 }
    );
  }
}
