import { NextResponse } from 'next/server';
import pdf from 'pdf-parse';
import { analyzeSolicitationText } from '@/lib/analyze';
export const runtime = 'nodejs';
export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const file = form.get('file');
    if (!(file instanceof File)) return NextResponse.json({ error: 'Upload a PDF file.' }, { status: 400 });
    const buffer = Buffer.from(await file.arrayBuffer());
    const parsed = await pdf(buffer);
    const text = parsed.text?.trim();
    if (!text) return NextResponse.json({ error: 'No selectable text was found in the PDF. Try an OCR copy.' }, { status: 422 });
    const analysis = await analyzeSolicitationText(text);
    return NextResponse.json(analysis);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Analysis failed.' }, { status: 500 });
  }
}
