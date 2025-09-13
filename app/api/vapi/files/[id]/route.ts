import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    if (!id) {
      return NextResponse.json({ error: 'Missing file id' }, { status: 400 });
    }
    if (!process.env.VAPI_API_KEY) {
      return NextResponse.json({ error: 'Missing VAPI_API_KEY' }, { status: 500 });
    }

    const res = await fetch(`https://api.vapi.ai/file/${encodeURIComponent(id)}`, {
      headers: { Authorization: `Bearer ${process.env.VAPI_API_KEY}` },
    });
    const text = await res.text();
    let json: any;
    try { json = text ? JSON.parse(text) : {}; } catch { json = { raw: text }; }
    if (!res.ok) {
      const message = json?.error || json?.message || 'Failed to fetch file';
      return NextResponse.json({ error: message, details: json }, { status: res.status });
    }
    return NextResponse.json(json);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    if (!id) {
      return NextResponse.json({ error: 'Missing file id' }, { status: 400 });
    }
    if (!process.env.VAPI_API_KEY) {
      return NextResponse.json({ error: 'Missing VAPI_API_KEY' }, { status: 500 });
    }

    const res = await fetch(`https://api.vapi.ai/file/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${process.env.VAPI_API_KEY}` },
    });
    if (!res.ok) {
      const text = await res.text();
      let json: any; try { json = text ? JSON.parse(text) : {}; } catch { json = { raw: text }; }
      const message = json?.error || json?.message || 'Failed to delete file';
      return NextResponse.json({ error: message, details: json }, { status: res.status });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


