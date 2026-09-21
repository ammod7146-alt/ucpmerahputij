'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, pin, password, password2 }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Terjadi kesalahan, coba lagi.');
        setLoading(false);
        return;
      }

      router.push('/login?registered=1');
    } catch {
      setError('Gagal menghubungi server. Coba lagi.');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-10">
      <div className="card w-full max-w-[400px]">
        <h1 className="text-2xl font-bold mb-1.5">Daftar akun UCP</h1>
        <p className="text-dim text-sm mb-7">
          Butuh PIN whitelist dari Discord dulu sebelum bisa daftar.
        </p>

        {error && (
          <div className="bg-red-500/10 text-red-300 border border-red-500/25 rounded-[10px] px-4 py-3 text-[13.5px] mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="field mb-4">
            <label className="block text-[13px] text-dim mb-1.5">
              Username (sama seperti nama connect di game)
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="contoh: ryann"
              required
            />
          </div>
          <div className="field mb-4">
            <label className="block text-[13px] text-dim mb-1.5">PIN Whitelist Discord</label>
            <input
              type="text"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="6 digit dari DM bot"
              required
            />
            <div className="text-xs text-dim mt-1.5">
              Belum punya? Ketik <code>!whitelist {username || 'usernamekamu'}</code> di channel
              whitelist Discord kami.
            </div>
          </div>
          <div className="field mb-4">
            <label className="block text-[13px] text-dim mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
              required
            />
          </div>
          <div className="field mb-4">
            <label className="block text-[13px] text-dim mb-1.5">Konfirmasi Password</label>
            <input
              type="password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              placeholder="Ulangi password"
              required
            />
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary w-full">
            {loading ? 'Memproses...' : 'Buat Akun UCP'}
          </button>
        </form>

        <p className="text-center text-[13px] text-dim mt-5">
          Sudah punya akun?{' '}
          <Link href="/login" className="text-accenta">
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
