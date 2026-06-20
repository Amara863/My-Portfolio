import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, message } = body;

    if (!name || name.trim().length < 2) {
      return NextResponse.json({ success: false, message: 'Name must be at least 2 characters' }, { status: 400 });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json({ success: false, message: 'Invalid email address' }, { status: 400 });
    }
    if (!message || message.trim().length < 10) {
      return NextResponse.json({ success: false, message: 'Message must be at least 10 characters' }, { status: 400 });
    }

    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';

    await sql`
      INSERT INTO contact_messages (name, email, message, ip_address)
      VALUES (${name.trim()}, ${email.trim()}, ${message.trim()}, ${ip})
    `;

    return NextResponse.json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json({ success: false, message: 'Server error. Please try again.' }, { status: 500 });
  }
}
