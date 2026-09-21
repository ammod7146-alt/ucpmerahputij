import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';
import { hashit, gensalt, isValidUsername } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const username = String(body.username || '').trim();
  const pin = String(body.pin || '').trim();
  const password = String(body.password || '');
  const password2 = String(body.password2 || '');

  if (!isValidUsername(username)) {
    return NextResponse.json(
      { error: 'Username harus 3-24 karakter, huruf & angka saja.' },
      { status: 400 }
    );
  }
  if (password.length < 6) {
    return NextResponse.json({ error: 'Password minimal 6 karakter.' }, { status: 400 });
  }
  if (password !== password2) {
    return NextResponse.json({ error: 'Konfirmasi password tidak cocok.' }, { status: 400 });
  }
  if (!pin) {
    return NextResponse.json(
      { error: 'Masukkan PIN whitelist yang kamu dapat dari Discord.' },
      { status: 400 }
    );
  }

  const existing = await queryOne('SELECT ucpID FROM ucp_accounts WHERE ucpUsername = ?', [
    username,
  ]);
  if (existing) {
    return NextResponse.json(
      { error: 'Username itu sudah terdaftar. Coba masuk lewat halaman Login.' },
      { status: 400 }
    );
  }

  const whitelistRow = await queryOne<{ wID: number }>(
    'SELECT wID FROM whitelist WHERE wName = ? AND wPin = ? AND wUsed = 0 LIMIT 1',
    [username, pin]
  );
  if (!whitelistRow) {
    return NextResponse.json(
      {
        error: `Username belum di-whitelist atau PIN salah. Pastikan sudah ketik "!whitelist ${username}" di Discord dan pakai PIN yang benar.`,
      },
      { status: 400 }
    );
  }

  const salt = gensalt();
  const hash = hashit(salt, password);
  const regDate = new Date()
    .toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' })
    .replace(/\//g, '.');
  const ip = req.headers.get('x-forwarded-for') || 'unknown';

  await query(
    'INSERT INTO ucp_accounts (ucpUsername, ucpPassword, ucpSalt, ucpMail, ucpReferal, ucpRegDate, ucpRegIP) VALUES (?, ?, ?, "None", 0, ?, ?)',
    [username, hash, salt, regDate, ip]
  );

  await query('UPDATE whitelist SET wUsed = 1 WHERE wID = ?', [whitelistRow.wID]);

  return NextResponse.json({ ok: true });
}
