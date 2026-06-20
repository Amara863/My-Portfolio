import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const ua = req.headers.get('user-agent') || '';

    await sql`
      INSERT INTO resume_downloads (ip_address, user_agent)
      VALUES (${ip}, ${ua})
    `;

    const filePath = join(process.cwd(), 'public', 'resume.pdf');
    const fileBuffer = readFileSync(filePath);

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="Amara_Firdous_Resume.pdf"',
        'Content-Length': fileBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Resume download error:', error);
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }
}
