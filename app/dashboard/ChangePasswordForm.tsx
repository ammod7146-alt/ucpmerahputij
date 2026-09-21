'use client';

import { useState } from 'react';

export default function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPassword2, setNewPassword2] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const res = await fetch('/api/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword, newPassword2 }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Terjadi kesalahan, coba lagi.');
        setLoading(false);
        return;
      }

      setSuccess('Password berhasil diubah. Dipakai juga buat login in-game.');
      setCurrentPassword('');
      setNewPassword('');
      setNewPassword2('');
      setLoading(false);
    } catch {
      setError('Gagal menghubungi server. Coba lagi.');
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <p className="text-[15px] font-bold mb-4">Ganti Password</p>

      {success && (
        <div className="bg-green-500/10 text-green-300 border border-green-500/25 rounded-[10px] px-4 py-3 text-[13.5px] mb-4">
          {success}
        </div>
      )}
      {error && (
        <div className="bg-red-500/10 text-red-300 border border-red-500/25 rounded-[10px] px-4 py-3 text-[13.5px] mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="field mb-4">
          <label className="block text-[13px] text-dim mb-1.5">Password Saat Ini</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        <div className="field mb-4">
          <label className="block text-[13px] text-dim mb-1.5">Password Baru</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div className="field mb-4">
          <label className="block text-[13px] text-dim mb-1.5">Konfirmasi Password Baru</label>
          <input
            type="password"
            value={newPassword2}
            onChange={(e) => setNewPassword2(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading} className="btn btn-primary w-full">
          {loading ? 'Menyimpan...' : 'Simpan Password Baru'}
        </button>
      </form>
    </div>
  );
}
