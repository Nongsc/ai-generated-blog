import { NextRequest, NextResponse } from 'next/server';
import { getMedia, uploadMedia } from '@/lib/api-client';

// GET /api/media - List media with pagination
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1', 10) - 1;
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    const result = await getMedia({
      page,
      size: limit,
    });

    return NextResponse.json({
      media: result.content.map((item) => ({
        id: item.id,
        filename: item.filename,
        originalName: item.originalFilename,
        path: item.filepath,
        mimeType: item.mimeType,
        size: item.size,
        storageType: 'LOCAL',
        createdAt: item.createdAt,
      })),
      pagination: {
        page: page + 1,
        limit,
        total: result.totalElements,
        totalPages: result.totalPages,
      },
    });
  } catch (error: any) {
    console.error('Get media error:', error);
    return NextResponse.json(
      { error: error.message || '获取媒体列表失败' },
      { status: 500 }
    );
  }
}

// POST /api/media - Upload media file
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: '请选择要上传的文件' },
        { status: 400 }
      );
    }

    // 创建新的 FormData 用于 API 调用
    const apiFormData = new FormData();
    apiFormData.append('file', file);

    const result = await uploadMedia(apiFormData);

    return NextResponse.json({
      id: result.id,
      filename: result.filename,
      originalName: result.originalFilename,
      path: result.filepath,
      mimeType: result.mimeType,
      size: result.size,
      storageType: 'LOCAL',
      createdAt: result.createdAt,
    });
  } catch (error: any) {
    console.error('Upload media error:', error);
    return NextResponse.json(
      { error: error.message || '上传文件失败' },
      { status: 500 }
    );
  }
}
