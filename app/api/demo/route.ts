import { NextResponse } from 'next/server';
import { demoAnalysis } from '@/lib/demo';
export async function GET() { return NextResponse.json({ ...demoAnalysis, generatedAt: new Date().toISOString() }); }
