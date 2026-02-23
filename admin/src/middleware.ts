import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 不需要认证的路径
const publicPaths = ['/login', '/api/auth/login'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 检查是否是公开路径
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

  // 检查是否有认证 token
  const authToken = request.cookies.get('auth_token')?.value;

  // 如果是公开路径且用户已登录，重定向到首页
  if (isPublicPath && authToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 如果不是公开路径且用户未登录，重定向到登录页
  if (!isPublicPath && !authToken) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // 匹配所有路径，除了静态文件
  matcher: [
    /*
     * 匹配所有请求路径，除了：
     * - _next/static (静态文件)
     * - _next/image (图片优化文件)
     * - favicon.ico (网站图标)
     * - public 文件夹中的文件
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
