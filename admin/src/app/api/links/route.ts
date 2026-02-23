import { NextRequest, NextResponse } from 'next/server';
import { getFriendLinks, createFriendLink } from '@/lib/api-client';

// GET /api/links - List all friend links
export async function GET() {
  try {
    const links = await getFriendLinks();

    return NextResponse.json(
      links.map((link) => ({
        id: link.id,
        name: link.name,
        url: link.url,
        avatar: link.avatar,
        description: link.description,
        sortOrder: link.sortOrder,
        status: link.status,
        createdAt: link.createdAt,
        updatedAt: link.updatedAt,
      }))
    );
  } catch (error: any) {
    console.error('Get friend links error:', error);
    return NextResponse.json(
      { error: error.message || '获取友情链接失败' },
      { status: 500 }
    );
  }
}

// POST /api/links - Create a new friend link
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, url, avatar, description, sortOrder } = body;

    const link = await createFriendLink({
      name,
      url,
      avatar,
      description,
      sortOrder,
    });

    return NextResponse.json({
      id: link.id,
      name: link.name,
      url: link.url,
      avatar: link.avatar,
      description: link.description,
      sortOrder: link.sortOrder,
      status: link.status,
      createdAt: link.createdAt,
      updatedAt: link.updatedAt,
    });
  } catch (error: any) {
    console.error('Create friend link error:', error);
    return NextResponse.json(
      { error: error.message || '创建友情链接失败' },
      { status: 500 }
    );
  }
}
