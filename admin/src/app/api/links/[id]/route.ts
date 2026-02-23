import { NextRequest, NextResponse } from 'next/server';
import { getFriendLink, updateFriendLink, deleteFriendLink } from '@/lib/api-client';

// GET /api/links/[id] - Get a single friend link
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const link = await getFriendLink(parseInt(id, 10));

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
    console.error('Get friend link error:', error);
    return NextResponse.json(
      { error: error.message || '获取友情链接失败' },
      { status: 404 }
    );
  }
}

// PUT /api/links/[id] - Update a friend link
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, url, avatar, description, sortOrder } = body;

    const link = await updateFriendLink(parseInt(id, 10), {
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
    console.error('Update friend link error:', error);
    return NextResponse.json(
      { error: error.message || '更新友情链接失败' },
      { status: 500 }
    );
  }
}

// DELETE /api/links/[id] - Delete a friend link
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteFriendLink(parseInt(id, 10));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete friend link error:', error);
    return NextResponse.json(
      { error: error.message || '删除友情链接失败' },
      { status: 500 }
    );
  }
}
