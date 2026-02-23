import { NextRequest, NextResponse } from 'next/server';
import { getCategory, updateCategory, deleteCategory } from '@/lib/api-client';

// GET /api/categories/[id] - Get a single category
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const category = await getCategory(parseInt(id, 10));

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
    console.error('Get category error:', error);
    return NextResponse.json(
      { error: error.message || '获取分类失败' },
      { status: 404 }
    );
  }
}

// PUT /api/categories/[id] - Update a category
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, slug, description } = body;

    const category = await updateCategory(parseInt(id, 10), {
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
    console.error('Update category error:', error);
    return NextResponse.json(
      { error: error.message || '更新分类失败' },
      { status: 500 }
    );
  }
}

// DELETE /api/categories/[id] - Delete a category
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteCategory(parseInt(id, 10));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete category error:', error);
    return NextResponse.json(
      { error: error.message || '删除分类失败' },
      { status: 500 }
    );
  }
}
