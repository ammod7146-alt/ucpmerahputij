import Link from 'next/link';
import { getSession } from '@/lib/auth';

export default async function Navbar() {
  const session = await getSession();

  return (
    <div className="flex items-center justify-between py-5 border-b border-cardborder">
      <Link href="/" className="flex items-center gap-2.5 font-bold text-lg">
        <span className="w-[34px] h-[34px] rounded-[10px] bg-gradient-to-br from-accenta to-accentb flex items-center justify-center font-extrabold text-[15px]">
          MP
        </span>
        Merah Putih Theater
      </Link>

      <div className="hidden md:flex gap-7 text-sm text-dim">
        <Link href="/#cara-main" className="hover:text-white">Cara Main</Link>
        <Link href="/#faq" className="hover:text-white">FAQ</Link>
      </div>

      <div className="flex gap-3 items-center">
        {session ? (
          <>
            <Link href="/dashboard" className="btn btn-ghost">Dashboard</Link>
            <Link href="/api/logout" className="btn btn-primary">Keluar</Link>
          </>
        ) : (
          <>
            <Link href="/login" className="btn btn-ghost">Masuk</Link>
            <Link href="/register" className="btn btn-primary">Daftar UCP</Link>
          </>
        )}
      </div>
    </div>
  );
}
