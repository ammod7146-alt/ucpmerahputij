'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const justRegistered = params.get('registered') === '1';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Terjadi kesalahan, coba lagi.');
        setLoading(false);
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch {
      setError('Gagal menghubungi server. Coba lagi.');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-10">
      <div className="card w-full max-w-[400px]">
        <h1 className="text-2xl font-bold mb-1.5">Masuk ke akun UCP</h1>
        <p className="text-dim text-sm mb-7">Pantau karaktermu dan kelola akunmu di sini.</p>

        {justRegistered && (
          <div className="bg-green-500/10 text-green-300 border border-green-500/25 rounded-[10px] px-4 py-3 text-[13.5px] mb-4">
            Akun UCP berhasil dibuat! Silakan masuk, atau langsung buat karakter pertamamu di game.
          </div>
        )}
        {error && (
          <div className="bg-red-500/10 text-red-300 border border-red-500/25 rounded-[10px] px-4 py-3 text-[13.5px] mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="field mb-4">
            <label className="block text-[13px] text-dim mb-1.5">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="field mb-4">
            <label className="block text-[13px] text-dim mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary w-full">
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        <p className="text-center text-[13px] text-dim mt-5">
          Belum punya akun?{' '}
          <Link href="/register" className="text-accenta">
            Daftar UCP
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
