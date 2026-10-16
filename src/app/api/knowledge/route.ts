import { NextRequest, NextResponse } from 'next/server';
import {
  getAllKnowledge,
  createKnowledgeItem,
  updateKnowledgeItem,
  deleteKnowledgeItem,
} from '@/lib/knowledge';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const items = await getAllKnowledge();
    return NextResponse.json({ success: true, data: items });
  } catch (err) {
    console.error('[API /api/knowledge GET Error]:', err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { content, category, heading } = body;

    if (!content?.trim() || !category?.trim() || !heading?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: content, category, heading' },
        { status: 400 }
      );
    }

    const item = await createKnowledgeItem(content.trim(), category.trim(), heading.trim());
    return NextResponse.json({ success: true, data: item });
  } catch (err) {
    console.error('[API /api/knowledge POST Error]:', err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, content, category, heading } = body;

    if (!id || !content?.trim() || !category?.trim() || !heading?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: id, content, category, heading' },
        { status: 400 }
      );
    }

    const item = await updateKnowledgeItem(Number(id), content.trim(), category.trim(), heading.trim());
    return NextResponse.json({ success: true, data: item });
  } catch (err) {
    console.error('[API /api/knowledge PUT Error]:', err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Missing required query parameter: id' },
        { status: 400 }
      );
    }

    await deleteKnowledgeItem(Number(id));
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[API /api/knowledge DELETE Error]:', err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
