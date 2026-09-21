import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { query, queryOne } from '@/lib/db';
import { skinName } from '@/lib/skins';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ChangePasswordForm from './ChangePasswordForm';

type UcpAccount = {
  ucpID: number;
  ucpUsername: string;
  ucpRegDate: string;
};

type Character = {
  pID: number;
  pName: string;
  pLevel: number;
  pExp: number;
  pSkin: number;
  pCash: number;
  pBank: number;
  pJob: number;
};

const MAX_UCP_CHARS = 2; // samakan dengan MAX_UCP_CHARS di lisa.pwn

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }

  const ucp = await queryOne<UcpAccount>('SELECT * FROM ucp_accounts WHERE ucpID = ?', [
    session.ucpID,
  ]);
  if (!ucp) {
    redirect('/login');
  }

  const characters = await query<Character>(
    'SELECT pID, pName, pLevel, pExp, pSkin, pCash, pBank, pJob FROM accounts WHERE ucpID = ? ORDER BY pID ASC',
    [session.ucpID]
  );

  return (
    <>
      <Navbar />

      <div className="flex justify-between items-end my-10">
        <div>
          <h1 className="text-[26px] font-bold mb-1.5">Halo, {ucp!.ucpUsername} 👋</h1>
          <p className="text-dim text-sm">Akun UCP terdaftar sejak {ucp!.ucpRegDate}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card">
          <p className="text-[15px] font-bold mb-4">
            Karakter Kamu ({characters.length}/{MAX_UCP_CHARS})
          </p>

          {characters.length === 0 && (
            <div className="text-dim text-sm py-5 text-center">
              Belum ada karakter. Masuk ke server buat bikin karakter pertamamu.
            </div>
          )}

          {characters.map((c) => (
            <div
              key={c.pID}
              className="flex items-center justify-between p-4 rounded-xl bg-bgsoft border border-cardborder mt-2.5 first:mt-0"
            >
              <div>
                <div className="font-bold text-[15px]">{c.pName}</div>
                <div className="text-dim text-xs mt-0.5">{skinName(c.pSkin)}</div>
              </div>
              <div className="hidden sm:flex gap-5 text-right">
                <div>
                  <b className="block text-[15px]">{c.pLevel}</b>
                  <span className="text-dim text-[11px]">Level</span>
                </div>
                <div>
                  <b className="block text-[15px]">rp{c.pCash.toLocaleString('id-ID')}</b>
                  <span className="text-dim text-[11px]">Cash</span>
                </div>
                <div>
                  <b className="block text-[15px]">rp{c.pBank.toLocaleString('id-ID')}</b>
                  <span className="text-dim text-[11px]">Bank</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <ChangePasswordForm />
      </div>

      <Footer />
    </>
  );
}
