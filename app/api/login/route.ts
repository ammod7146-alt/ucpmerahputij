import { NextRequest, NextResponse } from 'next/server';
import { queryOne } from '@/lib/db';
import { hashit, createSession } from '@/lib/auth';

type UcpAccount = {
  ucpID: number;
  ucpUsername: string;
  ucpPassword: string;
  ucpSalt: string;
};

export async function POST(req: NextRequest) {
  const body = await req.json();
  const username = String(body.username || '').trim();
  const password = String(body.password || '');

  const acc = await queryOne<UcpAccount>('SELECT * FROM ucp_accounts WHERE ucpUsername = ?', [
    username,
  ]);

  if (!acc || hashit(acc.ucpSalt, password) !== acc.ucpPassword.toLowerCase()) {
    return NextResponse.json({ error: 'Username atau password salah.' }, { status: 401 });
  }

  await createSession(acc.ucpID, acc.ucpUsername);

  return NextResponse.json({ ok: true });
}
