import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// GET /api/auth/check - 检查认证状态
export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) {
    return NextResponse.json({ authenticated: false });
  }

  // 验证 token（简单检查是否存在，实际应该验证 JWT）
  // 这里我们信任前端已经设置了有效的 token
  return NextResponse.json({ authenticated: true });
}
