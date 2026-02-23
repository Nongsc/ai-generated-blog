import { NextRequest, NextResponse } from 'next/server';
import { getTags, createTag } from '@/lib/api-client';

// GET /api/tags - List all tags
export async function GET() {
  try {
    const tags = await getTags();

    return NextResponse.json(
      tags.map((tag) => ({
        id: tag.id,
        name: tag.name,
        slug: tag.slug,
        count: 0, // API 暂不返回文章数
        createdAt: tag.createdAt,
        updatedAt: tag.updatedAt,
      }))
    );
  } catch (error: any) {
    console.error('Get tags error:', error);
    return NextResponse.json(
      { error: error.message || '获取标签失败' },
      { status: 500 }
    );
  }
}

// POST /api/tags - Create a new tag
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug } = body;

    const tag = await createTag({
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
    console.error('Create tag error:', error);
    return NextResponse.json(
      { error: error.message || '创建标签失败' },
      { status: 500 }
    );
  }
}
