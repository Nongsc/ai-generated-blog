import { NextRequest, NextResponse } from 'next/server';
import { getCategories, createCategory } from '@/lib/api-client';

// GET /api/categories - List all categories
export async function GET() {
  try {
    const categories = await getCategories();

    return NextResponse.json(
      categories.map((cat) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        count: 0, // API 暂不返回文章数
        createdAt: cat.createdAt,
        updatedAt: cat.updatedAt,
      }))
    );
  } catch (error: any) {
    console.error('Get categories error:', error);
    return NextResponse.json(
      { error: error.message || '获取分类失败' },
      { status: 500 }
    );
  }
}

// POST /api/categories - Create a new category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, description } = body;

    const category = await createCategory({
      name,
      slug,
      description,
    });

    return NextResponse.json({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      count: 0,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    });
  } catch (error: any) {
    console.error('Create category error:', error);
    return NextResponse.json(
      { error: error.message || '创建分类失败' },
      { status: 500 }
    );
  }
}
