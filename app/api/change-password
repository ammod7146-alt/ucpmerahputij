import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';
import { getSession, hashit, gensalt } from '@/lib/auth';

type UcpAccount = {
  ucpID: number;
  ucpPassword: string;
  ucpSalt: string;
};

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Sesi habis, silakan login lagi.' }, { status: 401 });
  }

  const body = await req.json();
  const currentPassword = String(body.currentPassword || '');
  const newPassword = String(body.newPassword || '');
  const newPassword2 = String(body.newPassword2 || '');

  const acc = await queryOne<UcpAccount>('SELECT * FROM ucp_accounts WHERE ucpID = ?', [
    session.ucpID,
  ]);
  if (!acc) {
    return NextResponse.json({ error: 'Akun tidak ditemukan.' }, { status: 404 });
  }

  if (hashit(acc.ucpSalt, currentPassword) !== acc.ucpPassword.toLowerCase()) {
    return NextResponse.json({ error: 'Password saat ini salah.' }, { status: 400 });
  }
  if (newPassword.length < 6) {
    return NextResponse.json({ error: 'Password baru minimal 6 karakter.' }, { status: 400 });
  }
  if (newPassword !== newPassword2) {
    return NextResponse.json({ error: 'Konfirmasi password baru tidak cocok.' }, { status: 400 });
  }

  const newSalt = gensalt();
  const newHash = hashit(newSalt, newPassword);

  await query('UPDATE ucp_accounts SET ucpPassword = ?, ucpSalt = ? WHERE ucpID = ?', [
    newHash,
    newSalt,
    acc.ucpID,
  ]);

  return NextResponse.json({ ok: true });
}
