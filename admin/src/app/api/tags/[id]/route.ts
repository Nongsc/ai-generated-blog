import { NextRequest, NextResponse } from 'next/server';
import { getTag, updateTag, deleteTag } from '@/lib/api-client';

// GET /api/tags/[id] - Get a single tag
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const tag = await getTag(parseInt(id, 10));

    return NextResponse.json({
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
      count: 0,
      createdAt: tag.createdAt,
      updatedAt: tag.updatedAt,
    });
  } catch (error: any) {
    console.error('Get tag error:', error);
    return NextResponse.json(
      { error: error.message || '获取标签失败' },
      { status: 404 }
    );
  }
}

// PUT /api/tags/[id] - Update a tag
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, slug } = body;

    const tag = await updateTag(parseInt(id, 10), {
      name,
      slug,
    });

    return NextResponse.json({
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
      count: 0,
      createdAt: tag.createdAt,
      updatedAt: tag.updatedAt,
    });
  } catch (error: any) {
    console.error('Update tag error:', error);
    return NextResponse.json(
      { error: error.message || '更新标签失败' },
      { status: 500 }
    );
  }
}

// DELETE /api/tags/[id] - Delete a tag
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteTag(parseInt(id, 10));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete tag error:', error);
    return NextResponse.json(
      { error: error.message || '删除标签失败' },
      { status: 500 }
    );
  }
}
