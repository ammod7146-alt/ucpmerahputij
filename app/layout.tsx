import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Merah Putih Theater — Panel UCP',
  description: 'Daftar akun UCP, pantau karakter, dan kelola akunmu.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        <div className="max-w-[1120px] mx-auto px-6">{children}</div>
      </body>
    </html>
  );
}
