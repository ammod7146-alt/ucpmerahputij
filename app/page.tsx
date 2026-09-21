import Link from 'next/link';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { getSession } from '@/lib/auth';
import { queryOne } from '@/lib/db';

export default async function HomePage() {
  const session = await getSession();

  const ucpCount = await queryOne<{ c: number }>('SELECT COUNT(*) c FROM ucp_accounts');
  const charCount = await queryOne<{ c: number }>('SELECT COUNT(*) c FROM accounts');

  return (
    <>
      <Navbar />

      <div className="pt-24 pb-16">
        <span className="inline-flex items-center gap-2 py-1.5 px-3.5 rounded-full text-[13px] bg-card border border-cardborder text-dim mb-6">
          ⚡ Panel resmi Merah Putih Theater
        </span>
        <h1 className="text-[44px] md:text-[48px] leading-[1.12] font-extrabold mb-4 max-w-[620px]">
          Satu akun, <span className="grad-text">dua karakter</span>, penuh kendali.
        </h1>
        <p className="text-dim text-base max-w-[480px] mb-8 leading-relaxed">
          Daftar akun UCP kamu, pantau level dan skin tiap karaktermu, dan ganti kata sandi
          kapan saja — tanpa perlu buka game.
        </p>

        <div className="flex gap-3.5">
          {session ? (
            <Link href="/dashboard" className="btn btn-primary">Buka Dashboard</Link>
          ) : (
            <>
              <Link href="/register" className="btn btn-primary">Daftar UCP</Link>
              <Link href="/login" className="btn btn-ghost">Sudah punya akun? Masuk</Link>
            </>
          )}
        </div>

        <div className="flex gap-11 mt-14 flex-wrap">
          <div>
            <b className="block text-2xl font-extrabold">{ucpCount?.c ?? 0}+</b>
            <span className="text-dim text-[13px]">Akun UCP Terdaftar</span>
          </div>
          <div>
            <b className="block text-2xl font-extrabold">{charCount?.c ?? 0}+</b>
            <span className="text-dim text-[13px]">Karakter Dibuat</span>
          </div>
          <div>
            <b className="block text-2xl font-extrabold">2</b>
            <span className="text-dim text-[13px]">Maks Karakter / Akun</span>
          </div>
        </div>
      </div>

      <div id="cara-main" className="card mb-4">
        <p className="text-[15px] font-bold mb-4">Cara mulai main</p>
        <p className="text-dim text-sm leading-7">
          1. Minta PIN whitelist di Discord kami dengan ketik <code>!whitelist usernamekamu</code>.<br />
          2. Masuk ke server, masukkan PIN yang dikirim bot lewat DM.<br />
          3. Buat password akun UCP kamu, lalu buat karakter pertama.<br />
          4. Pantau progres karaktermu kapan saja lewat dashboard di sini.
        </p>
      </div>

      <div id="faq" className="card mb-10">
        <p className="text-[15px] font-bold mb-4">FAQ</p>
        <p className="text-dim text-sm leading-7">
          <b className="text-white">Kenapa 1 username tapi bisa 2 karakter?</b><br />
          Username UCP kamu terpisah dari nama karakter roleplay-mu, jadi 1 akun bisa dipakai
          buat menjalani 2 kehidupan berbeda di server.
        </p>
      </div>

      <Footer />
    </>
  );
}
