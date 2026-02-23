import { NextRequest, NextResponse } from 'next/server';
import { getPost, updatePost, deletePost } from '@/lib/api-client';

// GET /api/posts/[id] - Get a single post
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const post = await getPost(parseInt(id, 10));

    return NextResponse.json({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.summary,
      content: post.content,
      cover: post.cover || null,
      status: post.status === 1 ? 'PUBLISHED' : 'DRAFT',
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      publishedAt: post.publishedAt,
      categories: post.categoryName ? [{ id: post.categoryId!, name: post.categoryName }] : [],
      tags: post.tags || [],
    });
  } catch (error: any) {
    console.error('Get post error:', error);
    return NextResponse.json(
      { error: error.message || '获取文章失败' },
      { status: 404 }
    );
  }
}

// PUT /api/posts/[id] - Update a post
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, slug, content, excerpt, cover, status, categoryIds, tagIds } = body;

    const post = await updatePost(parseInt(id, 10), {
      title,
      slug,
      summary: excerpt,
      content,
      cover,
      status: status === 'PUBLISHED' ? 1 : 0,
      categoryId: categoryIds?.[0],
      tagIds,
    });

    return NextResponse.json({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.summary,
      content: post.content,
      cover: post.cover || null,
      status: post.status === 1 ? 'PUBLISHED' : 'DRAFT',
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      publishedAt: post.publishedAt,
      categories: post.categoryName ? [{ id: post.categoryId!, name: post.categoryName }] : [],
      tags: post.tags || [],
    });
  } catch (error: any) {
    console.error('Update post error:', error);
    return NextResponse.json(
      { error: error.message || '更新文章失败' },
      { status: 500 }
    );
  }
}

// DELETE /api/posts/[id] - Delete a post
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deletePost(parseInt(id, 10));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete post error:', error);
    return NextResponse.json(
      { error: error.message || '删除文章失败' },
      { status: 500 }
    );
  }
}
