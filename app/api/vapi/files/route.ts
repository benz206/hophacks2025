import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Missing file' }, { status: 400 });
    }

    if (!process.env.VAPI_API_KEY) {
      return NextResponse.json({ error: 'Missing VAPI_API_KEY' }, { status: 500 });
    }

    const outbound = new FormData();
    outbound.append('file', file, file.name || 'upload');

    const vapiRes = await fetch('https://api.vapi.ai/file', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.VAPI_API_KEY}`,
      },
      body: outbound,
      // Don't set Content-Type, undici will set correct multipart boundary
    });

    const text = await vapiRes.text();
    let json: any;
    try {
      json = text ? JSON.parse(text) : {};
    } catch {
      json = { raw: text };
    }

    if (!vapiRes.ok) {
      const message = json?.error || json?.message || 'Vapi upload failed';
      return NextResponse.json({ error: message, details: json }, { status: vapiRes.status });
    }

    return NextResponse.json(json, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  try {
    if (!process.env.VAPI_API_KEY) {
      return NextResponse.json({ error: 'Missing VAPI_API_KEY' }, { status: 500 });
    }

    const res = await fetch('https://api.vapi.ai/file', {
      headers: { Authorization: `Bearer ${process.env.VAPI_API_KEY}` },
    });
    const text = await res.text();
    let json: any;
    try { json = text ? JSON.parse(text) : {}; } catch { json = { raw: text }; }
    if (!res.ok) {
      const message = json?.error || json?.message || 'Failed to list files';
      return NextResponse.json({ error: message, details: json }, { status: res.status });
    }
    return NextResponse.json(json);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


