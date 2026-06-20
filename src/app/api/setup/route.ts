import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';

// GET /api/setup — run ONCE after deploy to create tables + admin user
// Then DELETE this file or add auth to protect it
export async function GET() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL,
        message TEXT NOT NULL,
        ip_address VARCHAR(45),
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS resume_downloads (
        id SERIAL PRIMARY KEY,
        ip_address VARCHAR(45),
        user_agent TEXT,
        downloaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Default admin: username=admin, password=amara@2025
    const hash = await bcrypt.hash('amara@2025', 10);
    await sql`
      INSERT INTO admin_users (username, password_hash)
      VALUES ('admin', ${hash})
      ON CONFLICT (username) DO NOTHING
    `;

    return NextResponse.json({ success: true, message: 'Database setup complete! Delete this file now.' });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
