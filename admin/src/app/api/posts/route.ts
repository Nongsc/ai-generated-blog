import { NextRequest, NextResponse } from 'next/server';
import { getPosts, createPost } from '@/lib/api-client';

// GET /api/posts - List posts with pagination
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1', 10) - 1; // Admin 从 1 开始，API 从 0 开始
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const status = searchParams.get('status');
    const categoryId = searchParams.get('categoryId');

    const result = await getPosts({
      page,
      size: limit,
      status: status ? (status === 'DRAFT' ? 0 : 1) : undefined,
      categoryId: categoryId ? parseInt(categoryId, 10) : undefined,
    });

    // 转换响应格式以适配 Admin 端
    return NextResponse.json({
      posts: result.content.map((post) => ({
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
      })),
      pagination: {
        page: page + 1, // 转回从 1 开始
        limit,
        total: result.totalElements,
        totalPages: result.totalPages,
      },
    });
  } catch (error: any) {
    console.error('Get posts error:', error);
    return NextResponse.json(
      { error: error.message || '获取文章列表失败' },
      { status: 500 }
    );
  }
}

// POST /api/posts - Create a new post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, slug, content, excerpt, cover, status, categoryIds, tagIds } = body;

    const post = await createPost({
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
    console.error('Create post error:', error);
    return NextResponse.json(
      { error: error.message || '创建文章失败' },
      { status: 500 }
    );
  }
}
