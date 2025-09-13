import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleAIFileManager } from '@google/generative-ai/server';
import os from 'os';
import { writeFile, unlink } from 'fs/promises';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const prompt = String(formData.get('prompt') || '');
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Missing file' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const fileBytes = new Uint8Array(arrayBuffer);
    const tmpName = `${Date.now()}-${encodeURIComponent(file.name)}`;

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Missing GOOGLE_API_KEY' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    const fileManager = new GoogleAIFileManager(apiKey);

    const instruction = prompt && prompt.trim().length > 0
      ? prompt
      : 'Extract all information, retaining as much detail as possible, and present it as clean, well-structured Markdown with headings, bullet points, tables where applicable, and a short summary at the top.';

    // Upload the stored file to Gemini Files API via a temp file path (server SDK expects a path)
    const tmpFilePath = `${os.tmpdir()}/${tmpName}`;
    await writeFile(tmpFilePath, fileBytes);
    let uploadedToGemini;
    try {
      uploadedToGemini = await fileManager.uploadFile(tmpFilePath, {
        mimeType: file.type || 'application/octet-stream',
        displayName: file.name || 'uploaded-file',
      });
    } finally {
      // Cleanup temp file
      await unlink(tmpFilePath).catch(() => {});
    }

    const geminiFile = uploadedToGemini.file;

    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            {
              fileData: {
                fileUri: geminiFile.uri,
                mimeType: geminiFile.mimeType,
              },
            },
            { text: instruction },
          ],
        },
      ],
    });

    const response = await result.response;
    const markdown = response.text();

    return NextResponse.json({ markdown });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


