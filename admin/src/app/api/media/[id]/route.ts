import { NextRequest, NextResponse } from 'next/server';
import { deleteMedia } from '@/lib/api-client';

// DELETE /api/media/[id] - Delete a media file
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteMedia(parseInt(id, 10));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete media error:', error);
    return NextResponse.json(
      { error: error.message || '删除媒体失败' },
      { status: 500 }
    );
  }
}
