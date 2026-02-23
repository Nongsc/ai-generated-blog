import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getCurrentUser } from '@/lib/api-client';

export async function GET() {
  try {
    const user = await getCurrentUser();
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    return NextResponse.json({
      success: true,
      data: {
        isLoggedIn: true,
        userId: user.id,
        username: user.username,
      },
      token,
    });
  } catch (error) {
    return NextResponse.json({
      success: true,
      data: {
        isLoggedIn: false,
      },
    });
  }
}
