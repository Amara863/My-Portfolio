import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { cookies } from 'next/headers';

async function checkAuth() {
  const cookieStore = await cookies();
  return cookieStore.get('admin_session')?.value;
}

export async function GET() {
  const session = await checkAuth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const messages = await sql`SELECT * FROM contact_messages ORDER BY submitted_at DESC`;
  const downloads = await sql`SELECT COUNT(*) as total FROM resume_downloads`;

  return NextResponse.json({
    messages: messages.rows,
    downloads: downloads.rows[0].total,
    admin: session,
  });
}

export async function DELETE(req: NextRequest) {
  const session = await checkAuth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  await sql`DELETE FROM contact_messages WHERE id = ${id}`;
  return NextResponse.json({ success: true });
}
