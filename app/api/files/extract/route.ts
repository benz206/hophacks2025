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
      headers: { Authorization: `Bearer ${process.env.VAPI_API_KEY}` },
      body: outbound,
    });
    const uploaded = await vapiRes.json();
    if (!vapiRes.ok) {
      return NextResponse.json({ error: uploaded?.error || 'Vapi upload failed' }, { status: vapiRes.status });
    }

    let markdown = '';
    try {
      if (uploaded?.parsedTextUrl) {
        const tr = await fetch(uploaded.parsedTextUrl);
        if (tr.ok) markdown = await tr.text();
      }
    } catch {}

    return NextResponse.json({ markdown, file: uploaded });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

